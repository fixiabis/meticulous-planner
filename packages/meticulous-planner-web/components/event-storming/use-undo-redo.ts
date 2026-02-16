import { type Dispatch, type SetStateAction, useCallback, useRef } from 'react';
import { type Edge, type Node } from '@xyflow/react';

type Snapshot<N extends Node = Node> = {
  nodes: N[];
  edges: Edge[];
};

const MAX_HISTORY = 50;

function cloneSnapshot<N extends Node>(nodes: N[], edges: Edge[]): Snapshot<N> {
  return {
    nodes: nodes.map((n) => ({
      ...n,
      data: { ...n.data },
      position: { ...n.position },
      ...(n.style ? { style: { ...n.style } } : {}),
    })),
    edges: edges.map((e) => ({ ...e })),
  };
}

export function useUndoRedo<N extends Node>(
  nodes: N[],
  edges: Edge[],
  setNodes: Dispatch<SetStateAction<N[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>,
) {
  const pastRef = useRef<Snapshot<N>[]>([]);
  const futureRef = useRef<Snapshot<N>[]>([]);

  const takeSnapshot = useCallback(() => {
    pastRef.current.push(cloneSnapshot(nodes, edges));
    if (pastRef.current.length > MAX_HISTORY) {
      pastRef.current.shift();
    }
    futureRef.current = [];
  }, [nodes, edges]);

  const undo = useCallback(() => {
    const past = pastRef.current;
    if (past.length === 0) return;

    futureRef.current.push(cloneSnapshot(nodes, edges));
    const snapshot = past.pop()!;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
  }, [nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    const future = futureRef.current;
    if (future.length === 0) return;

    pastRef.current.push(cloneSnapshot(nodes, edges));
    const snapshot = future.pop()!;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
  }, [nodes, edges, setNodes, setEdges]);

  return { takeSnapshot, undo, redo };
}
