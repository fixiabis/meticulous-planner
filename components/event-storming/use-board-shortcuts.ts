import { useEffect, useRef } from 'react';
import { type Node, useReactFlow } from '@xyflow/react';

function isEditingTarget(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return true;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const anchorNode = selection.anchorNode;
  if (!anchorNode) return false;

  const anchorElement =
    anchorNode.nodeType === Node.ELEMENT_NODE
      ? (anchorNode as HTMLElement)
      : anchorNode.parentElement;

  return anchorElement?.closest('[contenteditable]') != null;
}

export function useBoardShortcuts(options: {
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
}): void {
  const { takeSnapshot, undo, redo } = options;
  const clipboardRef = useRef<Node[]>([]);
  const { getNodes, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditingTarget(event)) return;

      const isMod = event.metaKey || event.ctrlKey;

      // Delete / Backspace
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length === 0) return;

        event.preventDefault();
        takeSnapshot();
        const selectedIds = new Set(selected.map((n) => n.id));
        setNodes((nodes) => nodes.filter((n) => !selectedIds.has(n.id)));
        setEdges((edges) =>
          edges.filter(
            (e) => !selectedIds.has(e.source) && !selectedIds.has(e.target),
          ),
        );
        return;
      }

      // Ctrl/Cmd+C — Copy
      if (isMod && event.key === 'c') {
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length === 0) return;

        clipboardRef.current = selected.map((n) => ({
          ...n,
          data: { ...n.data },
          position: { ...n.position },
          ...(n.style ? { style: { ...n.style } } : {}),
        }));
        return;
      }

      // Ctrl/Cmd+V — Paste
      if (isMod && event.key === 'v') {
        if (clipboardRef.current.length === 0) return;
        event.preventDefault();

        takeSnapshot();
        const newNodes = clipboardRef.current.map((n) => ({
          ...n,
          id: `${n.type}-${crypto.randomUUID()}`,
          data: { ...n.data },
          position: { x: n.position.x + 30, y: n.position.y + 30 },
          selected: true,
          ...(n.style ? { style: { ...n.style } } : {}),
        }));

        // Update clipboard positions for cascading pastes
        clipboardRef.current = newNodes.map((n) => ({
          ...n,
          data: { ...n.data },
          position: { ...n.position },
          selected: false,
          ...(n.style ? { style: { ...n.style } } : {}),
        }));

        setNodes((nodes) =>
          nodes.map((n) => (n.selected ? { ...n, selected: false } : n)).concat(newNodes),
        );
        return;
      }

      // Ctrl/Cmd+D — Duplicate
      if (isMod && event.key === 'd') {
        event.preventDefault();
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length === 0) return;

        takeSnapshot();
        const newNodes = selected.map((n) => ({
          ...n,
          id: `${n.type}-${crypto.randomUUID()}`,
          data: { ...n.data },
          position: { x: n.position.x + 30, y: n.position.y + 30 },
          selected: true,
          ...(n.style ? { style: { ...n.style } } : {}),
        }));

        setNodes((nodes) =>
          nodes.map((n) => (n.selected ? { ...n, selected: false } : n)).concat(newNodes),
        );
        return;
      }

      // Ctrl/Cmd+Z — Undo, Ctrl/Cmd+Shift+Z — Redo
      if (isMod && event.key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [takeSnapshot, undo, redo, getNodes, setNodes, setEdges]);
}
