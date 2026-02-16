import { Event } from '@/modules/base/models/records/values';
import { BoardId } from '../records/values';

export enum BoardEditorEventType {
  BoardEditorOpened = 'board-editor:board-editor-opened',
  BoardUndone = 'board-editor:board-undone',
  BoardRedone = 'board-editor:board-redone',
  ItemsCopied = 'board-editor:items-copied',
  ItemsPasted = 'board-editor:items-pasted',
  ItemsDuplicated = 'board-editor:items-duplicated',
}

export class BoardEditorOpened extends Event<BoardEditorEventType.BoardEditorOpened> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.BoardEditorOpened);
  }
}

export class BoardUndone extends Event<BoardEditorEventType.BoardUndone> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.BoardUndone);
  }
}

export class BoardRedone extends Event<BoardEditorEventType.BoardRedone> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.BoardRedone);
  }
}

export class ItemsCopied extends Event<BoardEditorEventType.ItemsCopied> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.ItemsCopied);
  }
}

export class ItemsPasted extends Event<BoardEditorEventType.ItemsPasted> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.ItemsPasted);
  }
}

export class ItemsDuplicated extends Event<BoardEditorEventType.ItemsDuplicated> {
  constructor(
    public readonly boardId: BoardId,
  ) {
    super(BoardEditorEventType.ItemsDuplicated);
  }
}
