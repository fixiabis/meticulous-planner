import { Event as Base_Event } from '@/modules/base/models/records/values';
import { BoardId, Position, Size, StickyNoteId } from './values';
import { StickyNoteAdded, StickyNoteTextEdited, StickyNoteMoved, StickyNoteRemoved } from '../messages/events';

export type StickyNoteProps = {
  readonly id: StickyNoteId;
  readonly domainEvents: Base_Event[];
  readonly boardId: BoardId;
  readonly type: string;
  readonly text: string;
  readonly position: Position;
  readonly size: Size;
};

export type BaseStickyNoteProps = Pick<StickyNoteProps, 'id' | 'boardId' | 'type' | 'size'> & Partial<StickyNoteProps>;

export type WithStickyNoteProps = Partial<Omit<StickyNoteProps, 'id' | 'boardId' | 'type' | 'size'>>;

export class StickyNote implements StickyNoteProps {
  readonly id: StickyNoteId;
  readonly domainEvents: Base_Event[];
  readonly boardId: BoardId;
  readonly type: string;
  readonly text: string;
  readonly position: Position;
  readonly size: Size;

  constructor(props: BaseStickyNoteProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.boardId = props.boardId;
    this.type = props.type;
    this.text = props.text ?? '';
    this.position = props.position ?? { x: 0, y: 0 };
    this.size = props.size;
  }

  added(props: BaseStickyNoteProps) {
    return this.withProps({
      domainEvents: [...this.domainEvents, new StickyNoteAdded(this.boardId, this.id, props)],
    });
  }

  removed() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new StickyNoteRemoved(this.boardId, this.id)],
    });
  }

  editText(text: string) {
    return this.withProps({
      text,
      domainEvents: [...this.domainEvents, new StickyNoteTextEdited(this.boardId, this.id, text, this.text)],
    });
  }

  move(position: Position) {
    return this.withProps({
      position,
      domainEvents: [...this.domainEvents, new StickyNoteMoved(this.boardId, this.id, position, this.position)],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithStickyNoteProps) {
    return new StickyNote({
      ...this,
      ...props,
      id: this.id,
      boardId: this.boardId,
      type: this.type,
      size: this.size,
    });
  }
}
