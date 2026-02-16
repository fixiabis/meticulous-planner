'use client';

import { cn } from '@/lib/utils';
import { FrameIcon, MousePointer2Icon, StickyNoteIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  StickyNoteType,
  StickyNoteBgClassName,
  StickyNoteLabel,
  EventStormingTypes,
} from './types';

export enum BoardMode {
  Select = 'select',
  AddNote = 'add-note',
  AddFrame = 'add-frame',
}

interface BoardControlProps {
  mode: BoardMode;
  onSelectMode: () => void;
  onAddNoteMode: (type: StickyNoteType) => void;
  onAddFrameMode: () => void;
  selectedNoteType?: StickyNoteType | null;
}

export function BoardControl(props: BoardControlProps) {
  const { mode, onSelectMode, onAddNoteMode, onAddFrameMode, selectedNoteType } = props;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNoteTypeSelect = (type: StickyNoteType) => {
    onAddNoteMode(type);
    setIsPopoverOpen(false);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <button
        onClick={onSelectMode}
        className={cn(
          'p-2 rounded-md transition-colors hover:bg-gray-100 cursor-pointer',
          mode === BoardMode.Select ? 'bg-gray-100 text-blue-500' : 'text-gray-500'
        )}
        title="選取模式"
      >
        <MousePointer2Icon className="w-5 h-5" />
      </button>

      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className={cn(
            'p-2 rounded-md transition-colors hover:bg-gray-100 flex items-center gap-1 cursor-pointer',
            mode === BoardMode.AddNote ? 'bg-gray-100 text-blue-500' : 'text-gray-500'
          )}
          title="新增便條紙"
        >
          {mode === BoardMode.AddNote && selectedNoteType != null ? (
            <div className={cn('w-4 h-4 rounded-sm border border-black/10', StickyNoteBgClassName[selectedNoteType])} />
          ) : (
            <StickyNoteIcon className="w-5 h-5" />
          )}
        </button>

        {isPopoverOpen && (
          <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200 grid grid-cols-4 gap-2 w-max">
            {EventStormingTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleNoteTypeSelect(type)}
                className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div
                  className={cn('w-8 h-8 rounded-md shadow-sm border border-black/10', StickyNoteBgClassName[type])}
                />
                <span className="text-[10px] text-gray-600 whitespace-nowrap">
                  {StickyNoteLabel[type]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onAddFrameMode}
        className={cn(
          'p-2 rounded-md transition-colors hover:bg-gray-100 cursor-pointer',
          mode === BoardMode.AddFrame ? 'bg-gray-100 text-blue-500' : 'text-gray-500'
        )}
        title="新增框架"
      >
        <FrameIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
