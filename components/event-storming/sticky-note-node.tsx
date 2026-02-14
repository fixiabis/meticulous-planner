'use client';

import { cn } from '@/lib/utils';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { ContentEditable } from '../base/content-editable';
import {
  StickyNoteType,
  StickyNoteBgClassName,
  StickyNoteClassName,
  StickyNotePlaceholder,
} from './types';

export type StickyNoteNodeData = {
  type: StickyNoteType;
  text: string;
};

export type StickyNoteFlowNode = Node<StickyNoteNodeData> & { type: 'stickyNote' };

export function StickyNoteNode(props: NodeProps<StickyNoteFlowNode>) {
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
    <div
      className={cn(
        'relative rounded-md shadow-sm',
        StickyNoteBgClassName[data.type],
        StickyNoteClassName[data.type],
      )}
    >
      <ContentEditable
        className={cn(
          'w-full h-full shadow rounded-md text-center',
          'p-3 flex flex-col items-center justify-center',
          'focus-visible:outline-1 focus-visible:outline-black',
          '[&:after]:p-3 [&:after]:flex [&:after]:flex-col [&:after]:items-center [&:after]:justify-center',
          isEditing && 'nowheel nodrag'
        )}
        content={data.text}
        onContentChange={handleContentChange}
        placeholder={StickyNotePlaceholder[data.type]}
        onEditStart={() => setIsEditing(true)}
        onEditEnd={() => setIsEditing(false)}
      />
      <div
        className={cn('absolute top-0 left-0 w-full h-full rounded-md', {
          'outline-1 outline-black/50 pointer-events-none': selected,
        })}
      />
    </div>
  );
}
