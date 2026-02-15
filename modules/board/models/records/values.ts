import { ProjectId } from '@/modules/project/models/records/values';

export { ProjectId };

export type BoardId = string & { _type: 'board-id' };
export const BoardId = (value: string) => value as BoardId;

export type StickyNoteId = string & { _type: 'sticky-note-id' };
export const StickyNoteId = (value: string) => value as StickyNoteId;

export type FrameId = string & { _type: 'frame-id' };
export const FrameId = (value: string) => value as FrameId;

export type Position = { readonly x: number; readonly y: number };

export type Size = { readonly width: number; readonly height: number };
