import { WithBoardProps } from '@/modules/board/models/records/board';
import { BaseFrameProps } from '@/modules/board/models/records/frame';
import { BaseStickyNoteProps } from '@/modules/board/models/records/sticky-note';
import { BoardId, FrameId, Position, Size, StickyNoteId } from '@/modules/board/models/records/values';

export { BoardId, FrameId, StickyNoteId };
export type { Position, Size };

export type EditBoardUndoEntry = {
  readonly type: 'edit-board';
  readonly boardId: BoardId;
  readonly boardProps: WithBoardProps;
  readonly prevBoardProps: WithBoardProps;
};

export type AddStickyNoteUndoEntry = {
  readonly type: 'add-sticky-note';
  readonly boardId: BoardId;
  readonly stickyNoteId: StickyNoteId;
  readonly props: BaseStickyNoteProps;
};

export type EditStickyNoteTextUndoEntry = {
  readonly type: 'edit-sticky-note-text';
  readonly boardId: BoardId;
  readonly stickyNoteId: StickyNoteId;
  readonly text: string;
  readonly prevText: string;
};

export type MoveStickyNoteUndoEntry = {
  readonly type: 'move-sticky-note';
  readonly boardId: BoardId;
  readonly stickyNoteId: StickyNoteId;
  readonly position: Position;
  readonly prevPosition: Position;
};

export type RemoveStickyNoteUndoEntry = {
  readonly type: 'remove-sticky-note';
  readonly boardId: BoardId;
  readonly stickyNoteId: StickyNoteId;
  readonly props: BaseStickyNoteProps;
};

export type AddFrameUndoEntry = {
  readonly type: 'add-frame';
  readonly boardId: BoardId;
  readonly frameId: FrameId;
  readonly props: BaseFrameProps;
};

export type EditFrameTextUndoEntry = {
  readonly type: 'edit-frame-text';
  readonly boardId: BoardId;
  readonly frameId: FrameId;
  readonly text: string;
  readonly prevText: string;
};

export type MoveFrameUndoEntry = {
  readonly type: 'move-frame';
  readonly boardId: BoardId;
  readonly frameId: FrameId;
  readonly position: Position;
  readonly prevPosition: Position;
};

export type ResizeFrameUndoEntry = {
  readonly type: 'resize-frame';
  readonly boardId: BoardId;
  readonly frameId: FrameId;
  readonly size: Size;
  readonly prevSize: Size;
};

export type RemoveFrameUndoEntry = {
  readonly type: 'remove-frame';
  readonly boardId: BoardId;
  readonly frameId: FrameId;
  readonly props: BaseFrameProps;
};

export type BatchUndoEntry = {
  readonly type: 'batch';
  readonly entries: readonly UndoEntry[];
};

export type UndoEntry =
  | EditBoardUndoEntry
  | AddStickyNoteUndoEntry
  | EditStickyNoteTextUndoEntry
  | MoveStickyNoteUndoEntry
  | RemoveStickyNoteUndoEntry
  | AddFrameUndoEntry
  | EditFrameTextUndoEntry
  | MoveFrameUndoEntry
  | ResizeFrameUndoEntry
  | RemoveFrameUndoEntry
  | BatchUndoEntry;

export type ClipboardStickyNote = {
  readonly type: 'sticky-note';
  readonly stickyNoteType: string;
  readonly text: string;
  readonly relativePosition: Position;
  readonly size: Size;
};

export type ClipboardFrame = {
  readonly type: 'frame';
  readonly text: string;
  readonly relativePosition: Position;
  readonly size: Size;
};

export type ClipboardItem = ClipboardStickyNote | ClipboardFrame;
