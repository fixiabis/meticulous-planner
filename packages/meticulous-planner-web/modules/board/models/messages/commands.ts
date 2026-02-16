import { Command as BaseCommand } from '@/modules/base/models/records/values';
import { WithBoardProps } from '../records/board';
import { BaseStickyNoteProps } from '../records/sticky-note';
import { BaseFrameProps } from '../records/frame';
import { BoardId, FrameId, Position, ProjectId, Size, StickyNoteId } from '../records/values';

export enum BoardCommandType {
  CreateBoard = 'board:create-board',
  EditBoard = 'board:edit-board',
  RemoveBoard = 'board:remove-board',
  AddStickyNote = 'board:add-sticky-note',
  EditStickyNoteText = 'board:edit-sticky-note-text',
  MoveStickyNote = 'board:move-sticky-note',
  RemoveStickyNote = 'board:remove-sticky-note',
  AddFrame = 'board:add-frame',
  EditFrameText = 'board:edit-frame-text',
  MoveFrame = 'board:move-frame',
  ResizeFrame = 'board:resize-frame',
  RemoveFrame = 'board:remove-frame',
}

export class CreateBoardCommand extends BaseCommand<BoardCommandType.CreateBoard> {
  constructor(
    public readonly projectId: ProjectId,
  ) {
    super(BoardCommandType.CreateBoard);
  }
}

export class EditBoardCommand extends BaseCommand<BoardCommandType.EditBoard> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly boardId: BoardId,
    public readonly boardProps: WithBoardProps,
  ) {
    super(BoardCommandType.EditBoard);
  }
}

export class RemoveBoardCommand extends BaseCommand<BoardCommandType.RemoveBoard> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly boardId: BoardId,
  ) {
    super(BoardCommandType.RemoveBoard);
  }
}

export class AddStickyNoteCommand extends BaseCommand<BoardCommandType.AddStickyNote> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteProps: BaseStickyNoteProps,
  ) {
    super(BoardCommandType.AddStickyNote);
  }
}

export class EditStickyNoteTextCommand extends BaseCommand<BoardCommandType.EditStickyNoteText> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
    public readonly text: string,
  ) {
    super(BoardCommandType.EditStickyNoteText);
  }
}

export class MoveStickyNoteCommand extends BaseCommand<BoardCommandType.MoveStickyNote> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
    public readonly position: Position,
  ) {
    super(BoardCommandType.MoveStickyNote);
  }
}

export class RemoveStickyNoteCommand extends BaseCommand<BoardCommandType.RemoveStickyNote> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
  ) {
    super(BoardCommandType.RemoveStickyNote);
  }
}

export class AddFrameCommand extends BaseCommand<BoardCommandType.AddFrame> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameProps: BaseFrameProps,
  ) {
    super(BoardCommandType.AddFrame);
  }
}

export class EditFrameTextCommand extends BaseCommand<BoardCommandType.EditFrameText> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly text: string,
  ) {
    super(BoardCommandType.EditFrameText);
  }
}

export class MoveFrameCommand extends BaseCommand<BoardCommandType.MoveFrame> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly position: Position,
  ) {
    super(BoardCommandType.MoveFrame);
  }
}

export class ResizeFrameCommand extends BaseCommand<BoardCommandType.ResizeFrame> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly size: Size,
  ) {
    super(BoardCommandType.ResizeFrame);
  }
}

export class RemoveFrameCommand extends BaseCommand<BoardCommandType.RemoveFrame> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
  ) {
    super(BoardCommandType.RemoveFrame);
  }
}
