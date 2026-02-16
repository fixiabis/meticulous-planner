import { Event } from '@/modules/base/models/records/values';
import { BaseBoardProps, WithBoardProps } from '../records/board';
import { BaseStickyNoteProps } from '../records/sticky-note';
import { BaseFrameProps } from '../records/frame';
import { BoardId, FrameId, Position, ProjectId, Size, StickyNoteId } from '../records/values';

export enum BoardEventType {
  BoardCreated = 'board:board-created',
  BoardEdited = 'board:board-edited',
  BoardRemoved = 'board:board-removed',
  StickyNoteAdded = 'board:sticky-note-added',
  StickyNoteTextEdited = 'board:sticky-note-text-edited',
  StickyNoteMoved = 'board:sticky-note-moved',
  StickyNoteRemoved = 'board:sticky-note-removed',
  FrameAdded = 'board:frame-added',
  FrameTextEdited = 'board:frame-text-edited',
  FrameMoved = 'board:frame-moved',
  FrameResized = 'board:frame-resized',
  FrameRemoved = 'board:frame-removed',
}

export class BoardCreated extends Event<BoardEventType.BoardCreated> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly boardId: BoardId,
    public readonly boardProps: BaseBoardProps,
  ) {
    super(BoardEventType.BoardCreated);
  }
}

export class BoardEdited extends Event<BoardEventType.BoardEdited> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly boardId: BoardId,
    public readonly boardProps: WithBoardProps,
  ) {
    super(BoardEventType.BoardEdited);
  }
}

export class BoardRemoved extends Event<BoardEventType.BoardRemoved> {
  constructor(
    public readonly projectId: ProjectId,
    public readonly boardId: BoardId,
  ) {
    super(BoardEventType.BoardRemoved);
  }
}

export class StickyNoteAdded extends Event<BoardEventType.StickyNoteAdded> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
    public readonly stickyNoteProps: BaseStickyNoteProps,
  ) {
    super(BoardEventType.StickyNoteAdded);
  }
}

export class StickyNoteTextEdited extends Event<BoardEventType.StickyNoteTextEdited> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
    public readonly text: string,
    public readonly prevText: string,
  ) {
    super(BoardEventType.StickyNoteTextEdited);
  }
}

export class StickyNoteMoved extends Event<BoardEventType.StickyNoteMoved> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
    public readonly position: Position,
    public readonly prevPosition: Position,
  ) {
    super(BoardEventType.StickyNoteMoved);
  }
}

export class StickyNoteRemoved extends Event<BoardEventType.StickyNoteRemoved> {
  constructor(
    public readonly boardId: BoardId,
    public readonly stickyNoteId: StickyNoteId,
  ) {
    super(BoardEventType.StickyNoteRemoved);
  }
}

export class FrameAdded extends Event<BoardEventType.FrameAdded> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly frameProps: BaseFrameProps,
  ) {
    super(BoardEventType.FrameAdded);
  }
}

export class FrameTextEdited extends Event<BoardEventType.FrameTextEdited> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly text: string,
    public readonly prevText: string,
  ) {
    super(BoardEventType.FrameTextEdited);
  }
}

export class FrameMoved extends Event<BoardEventType.FrameMoved> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly position: Position,
    public readonly prevPosition: Position,
  ) {
    super(BoardEventType.FrameMoved);
  }
}

export class FrameResized extends Event<BoardEventType.FrameResized> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
    public readonly size: Size,
    public readonly prevSize: Size,
  ) {
    super(BoardEventType.FrameResized);
  }
}

export class FrameRemoved extends Event<BoardEventType.FrameRemoved> {
  constructor(
    public readonly boardId: BoardId,
    public readonly frameId: FrameId,
  ) {
    super(BoardEventType.FrameRemoved);
  }
}
