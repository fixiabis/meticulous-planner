import { Event as Base_Event } from '@/modules/base/models/records/values';
import { BoardId, FrameId, Position, Size } from './values';
import { FrameAdded, FrameTextEdited, FrameMoved, FrameResized, FrameRemoved } from '../messages/events';

export type FrameProps = {
  readonly id: FrameId;
  readonly domainEvents: Base_Event[];
  readonly boardId: BoardId;
  readonly text: string;
  readonly position: Position;
  readonly size: Size;
};

export type BaseFrameProps = Pick<FrameProps, 'id' | 'boardId'> & Partial<FrameProps>;

export type WithFrameProps = Partial<Omit<FrameProps, 'id' | 'boardId'>>;

export class Frame implements FrameProps {
  readonly id: FrameId;
  readonly domainEvents: Base_Event[];
  readonly boardId: BoardId;
  readonly text: string;
  readonly position: Position;
  readonly size: Size;

  constructor(props: BaseFrameProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.boardId = props.boardId;
    this.text = props.text ?? '';
    this.position = props.position ?? { x: 0, y: 0 };
    this.size = props.size ?? { width: 800, height: 600 };
  }

  added(props: BaseFrameProps) {
    return this.withProps({
      domainEvents: [...this.domainEvents, new FrameAdded(this.boardId, this.id, props)],
    });
  }

  removed() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new FrameRemoved(this.boardId, this.id)],
    });
  }

  editText(text: string) {
    return this.withProps({
      text,
      domainEvents: [...this.domainEvents, new FrameTextEdited(this.boardId, this.id, text, this.text)],
    });
  }

  move(position: Position) {
    return this.withProps({
      position,
      domainEvents: [...this.domainEvents, new FrameMoved(this.boardId, this.id, position, this.position)],
    });
  }

  resize(size: Size) {
    return this.withProps({
      size,
      domainEvents: [...this.domainEvents, new FrameResized(this.boardId, this.id, size, this.size)],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithFrameProps) {
    return new Frame({
      ...this,
      ...props,
      id: this.id,
      boardId: this.boardId,
    });
  }
}
