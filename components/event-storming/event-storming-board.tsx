'use client';

import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { BoardControl, BoardMode } from './board-control';
import { FrameFlowNode, FrameNode } from './frame-node';
import { StickyNoteFlowNode, StickyNoteNode } from './sticky-note-node';
import { StickyNoteSize, StickyNoteType } from './types';
import { useBoardShortcuts } from './use-board-shortcuts';
import { useUndoRedo } from './use-undo-redo';

export type BoardNode = StickyNoteFlowNode | FrameFlowNode;

const nodeTypes = {
  stickyNote: StickyNoteNode,
  frame: FrameNode,
};

function EventStormingBoardInner() {
  const { screenToFlowPosition } = useReactFlow<BoardNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState<BoardNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [mode, setMode] = useState<BoardMode>(BoardMode.Select);
  const [addNoteType, setAddNoteType] = useState<StickyNoteType | null>(null);

  const { takeSnapshot, undo, redo } = useUndoRedo(nodes, edges, setNodes, setEdges);
  useBoardShortcuts({ takeSnapshot, undo, redo });

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (mode === BoardMode.AddNote && addNoteType != null) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const size = StickyNoteSize[addNoteType];

        const newNode: StickyNoteFlowNode = {
          id: `stickyNote-${crypto.randomUUID()}`,
          type: 'stickyNote',
          position: {
            x: position.x - size[0] / 2,
            y: position.y - size[1] / 2,
          },
          data: {
            type: addNoteType,
            text: '',
          },
        };

        takeSnapshot();
        setNodes((nodes) => [...nodes, newNode]);
        setMode(BoardMode.Select);
      } else if (mode === BoardMode.AddFrame) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: FrameFlowNode = {
          id: `frame-${crypto.randomUUID()}`,
          type: 'frame',
          position,
          data: { text: '' },
          style: {
            width: 800,
            height: 600,
            zIndex: -10,
          },
          draggable: true,
          selectable: true,
        };

        takeSnapshot();
        setNodes((nodes) => [...nodes, newNode]);
        setMode(BoardMode.Select);
      }
    },
    [mode, addNoteType, screenToFlowPosition, setNodes, takeSnapshot],
  );

  return (
    <div
      className={String.raw`w-full h-full [&_.react-flow\_\_resize-control.line]:[border-width:4px] [&_.react-flow\_\_node-frame:not(.selected)]:pointer-events-none!`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={handlePaneClick}
        onNodeDragStart={takeSnapshot}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
        panOnDrag={false}
        panOnScroll={true}
        selectionOnDrag={true}
        selectNodesOnDrag={false}
        minZoom={0.25}
        maxZoom={2.5}
        style={{
          cursor: mode === BoardMode.AddNote || mode === BoardMode.AddFrame ? 'crosshair' : 'default',
        }}
        className="bg-gray-50"
      >
        <Background />
        <BoardControl
          mode={mode}
          onSelectMode={() => setMode(BoardMode.Select)}
          onAddNoteMode={(type) => {
            setMode(BoardMode.AddNote);
            setAddNoteType(type);
          }}
          onAddFrameMode={() => setMode(BoardMode.AddFrame)}
          selectedNoteType={addNoteType}
        />
      </ReactFlow>
    </div>
  );
}

export function EventStormingBoard() {
  return (
    <ReactFlowProvider>
      <EventStormingBoardInner />
    </ReactFlowProvider>
  );
}
