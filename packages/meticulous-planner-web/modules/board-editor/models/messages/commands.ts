import { Command as BaseCommand } from '@/modules/base/models/records/values';
import { BoardId, FrameId, Position, StickyNoteId } from '../records/values';

export enum BoardEditorCommandType {
  OpenBoardEditor = 'board-editor:open-board-editor',
  Undo = 'board-editor:undo',
  Redo = 'board-editor:redo',
  Copy = 'board-editor:copy',
  Paste = 'board-editor:paste',
  Duplicate = 'board-editor:duplicate',
}

export class OpenBoardEditorCommand extends BaseCommand<BoardEditorCommandType.OpenBoardEditor> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorCommandType.OpenBoardEditor);
  }
}

export class UndoCommand extends BaseCommand<BoardEditorCommandType.Undo> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorCommandType.Undo);
  }
}

export class RedoCommand extends BaseCommand<BoardEditorCommandType.Redo> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorCommandType.Redo);
  }
}

export class CopyCommand extends BaseCommand<BoardEditorCommandType.Copy> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteIds: readonly StickyNoteId[],
    public readonly frameIds: readonly FrameId[],
  ) {
    super(BoardEditorCommandType.Copy);
  }
}

export class PasteCommand extends BaseCommand<BoardEditorCommandType.Paste> {
  constructor(
    public readonly boardId: BoardId,
    public readonly position: Position,
  ) {
    super(BoardEditorCommandType.Paste);
  }
}

export class DuplicateCommand extends BaseCommand<BoardEditorCommandType.Duplicate> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteIds: readonly StickyNoteId[],
    public readonly frameIds: readonly FrameId[],
    public readonly offset: Position,
  ) {
    super(BoardEditorCommandType.Duplicate);
  }
}
