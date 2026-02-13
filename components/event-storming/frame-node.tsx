'use client';

import { cn } from '@/lib/utils';
import { Node, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { ContentEditable } from './content-editable';

export type FrameNodeData = {
  text: string;
};

export type FrameFlowNode = Node<FrameNodeData> & { type: 'frame' };

export function FrameNode(props: NodeProps<FrameFlowNode>) {
  const { data, selected, id } = props;
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (text: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, text } } : node
      )
    );
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={400}
        minHeight={300}
        handleStyle={{
          width: 8,
          height: 8,
          backgroundColor: 'black',
          pointerEvents: 'auto',
        }}
      />
      <div className="w-full h-full border-2 border-black -z-10 pointer-events-none">
        <div className="p-2 absolute top-1 left-1 min-w-20 pointer-events-auto">
          <ContentEditable
            className={cn(
              'px-2 py-1 text-sm font-semibold text-black rounded',
              'cursor-text hover:bg-black/10',
              'focus-visible:outline-1 focus-visible:outline-black',
              isEditing && 'nowheel nodrag'
            )}
            content={data.text || ''}
            onContentChange={handleContentChange}
            placeholder="業務範疇"
            onEditStart={() => setIsEditing(true)}
            onEditEnd={() => setIsEditing(false)}
          />
        </div>
        <div className={cn('absolute -top-px left-0 w-full h-[2px]', !selected && 'pointer-events-auto')} />
        <div className={cn('absolute bottom-px left-0 w-full h-[2px]', !selected && 'pointer-events-auto')} />
        <div className={cn('absolute top-0 -left-px w-[2px] h-full', !selected && 'pointer-events-auto')} />
        <div className={cn('absolute top-0 right-px w-[2px] h-full', !selected && 'pointer-events-auto')} />
      </div>
    </>
  );
}
