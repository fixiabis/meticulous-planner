import { Event as Base_Event } from '@/modules/base/models/records/values';
import { BoardEditorOpened, BoardUndone, BoardRedone, ItemsCopied, ItemsPasted, ItemsDuplicated } from '../messages/events';
import { BoardId, ClipboardItem, UndoEntry } from './values';

const MAX_UNDO_STACK_SIZE = 50;

export type BoardEditorProps = {
  readonly id: BoardId;
  readonly domainEvents: Base_Event[];
  readonly undoStack: readonly UndoEntry[];
  readonly redoStack: readonly UndoEntry[];
  readonly clipboard: readonly ClipboardItem[];
};

export type BaseBoardEditorProps = Pick<BoardEditorProps, 'id'> & Partial<BoardEditorProps>;

export type WithBoardEditorProps = Partial<Omit<BoardEditorProps, 'id'>>;

export class BoardEditor implements BoardEditorProps {
  readonly id: BoardId;
  readonly domainEvents: Base_Event[];
  readonly undoStack: readonly UndoEntry[];
  readonly redoStack: readonly UndoEntry[];
  readonly clipboard: readonly ClipboardItem[];

  constructor(props: BaseBoardEditorProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.undoStack = props.undoStack ?? [];
    this.redoStack = props.redoStack ?? [];
    this.clipboard = props.clipboard ?? [];
  }

  opened() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new BoardEditorOpened(this.id)],
    });
  }

  pushUndo(entry: UndoEntry) {
    const undoStack = [...this.undoStack, entry].slice(-MAX_UNDO_STACK_SIZE);
    return this.withProps({
      undoStack,
      redoStack: [],
    });
  }

  undo(redoEntry: UndoEntry) {
    return this.withProps({
      undoStack: this.undoStack.slice(0, -1),
      redoStack: [...this.redoStack, redoEntry],
      domainEvents: [...this.domainEvents, new BoardUndone(this.id)],
    });
  }

  redo(undoEntry: UndoEntry) {
    return this.withProps({
      redoStack: this.redoStack.slice(0, -1),
      undoStack: [...this.undoStack, undoEntry],
      domainEvents: [...this.domainEvents, new BoardRedone(this.id)],
    });
  }

  copy(items: readonly ClipboardItem[]) {
    return this.withProps({
      clipboard: items,
      domainEvents: [...this.domainEvents, new ItemsCopied(this.id)],
    });
  }

  pasted() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new ItemsPasted(this.id)],
    });
  }

  duplicated() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new ItemsDuplicated(this.id)],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithBoardEditorProps) {
    return new BoardEditor({
      ...this,
      ...props,
      id: this.id,
    });
  }
}
