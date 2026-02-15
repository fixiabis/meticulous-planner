import { Event as Base_Event } from '@/modules/base/models/records/values';
import { BoardId, FrameId, Position, ProjectId, Size, StickyNoteId } from './values';
import { BoardCreated, BoardEdited, BoardRemoved } from '../messages/events';
import { StickyNote, BaseStickyNoteProps } from './sticky-note';
import { Frame, BaseFrameProps } from './frame';

export type BoardProps = {
  readonly id: BoardId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly name: string;
  readonly stickyNotes: readonly StickyNote[];
  readonly frames: readonly Frame[];
};

export type BaseBoardProps = Pick<BoardProps, 'id' | 'projectId'> & Partial<BoardProps>;

export type WithBoardProps = Partial<Omit<BoardProps, 'id' | 'projectId'>>;

export class Board implements BoardProps {
  readonly id: BoardId;
  readonly domainEvents: Base_Event[];
  readonly projectId: ProjectId;
  readonly name: string;
  readonly stickyNotes: readonly StickyNote[];
  readonly frames: readonly Frame[];

  constructor(props: BaseBoardProps) {
    this.id = props.id;
    this.domainEvents = props.domainEvents ?? [];
    this.projectId = props.projectId;
    this.name = props.name ?? '';
    this.stickyNotes = props.stickyNotes ?? [];
    this.frames = props.frames ?? [];
  }

  created(props: BaseBoardProps) {
    return this.withProps({
      domainEvents: [...this.domainEvents, new BoardCreated(this.projectId, this.id, props)],
    });
  }

  removed() {
    return this.withProps({
      domainEvents: [...this.domainEvents, new BoardRemoved(this.projectId, this.id)],
    });
  }

  edit(props: WithBoardProps) {
    return this.withProps({
      ...props,
      domainEvents: [...this.domainEvents, new BoardEdited(this.projectId, this.id, props)],
    });
  }

  addStickyNote(props: BaseStickyNoteProps) {
    const baseProps: BaseStickyNoteProps = { ...props, id: props.id, boardId: this.id };
    const addedStickyNote = new StickyNote(baseProps).clearDomainEvents().added(baseProps);
    return this.withProps({
      stickyNotes: [...this.stickyNotes, addedStickyNote.clearDomainEvents()],
      domainEvents: [...this.domainEvents, ...addedStickyNote.domainEvents],
    });
  }

  editStickyNoteText(stickyNoteId: StickyNoteId, text: string) {
    return this.withEditStickyNote(stickyNoteId, (stickyNote) => stickyNote.editText(text));
  }

  moveStickyNote(stickyNoteId: StickyNoteId, position: Position) {
    return this.withEditStickyNote(stickyNoteId, (stickyNote) => stickyNote.move(position));
  }

  withEditStickyNote(stickyNoteId: StickyNoteId, edit: (stickyNote: StickyNote) => StickyNote) {
    const stickyNote = this.stickyNotes.find((sn) => sn.id === stickyNoteId);

    if (!stickyNote) {
      return this;
    }

    const editedStickyNote = edit(stickyNote.clearDomainEvents());

    const stickyNotes = this.stickyNotes.map((sn) => {
      return sn.id !== stickyNoteId ? sn : editedStickyNote.clearDomainEvents();
    });

    return this.withProps({
      stickyNotes,
      domainEvents: [...this.domainEvents, ...editedStickyNote.domainEvents],
    });
  }

  removeStickyNote(stickyNoteId: StickyNoteId) {
    const stickyNote = this.stickyNotes.find((sn) => sn.id === stickyNoteId)!;
    const removedStickyNote = stickyNote.clearDomainEvents().removed();
    return this.withProps({
      stickyNotes: this.stickyNotes.filter((sn) => sn.id !== stickyNoteId),
      domainEvents: [...this.domainEvents, ...removedStickyNote.domainEvents],
    });
  }

  addFrame(props: BaseFrameProps) {
    const baseProps: BaseFrameProps = { ...props, id: props.id, boardId: this.id };
    const addedFrame = new Frame(baseProps).clearDomainEvents().added(baseProps);
    return this.withProps({
      frames: [...this.frames, addedFrame.clearDomainEvents()],
      domainEvents: [...this.domainEvents, ...addedFrame.domainEvents],
    });
  }

  editFrameText(frameId: FrameId, text: string) {
    return this.withEditFrame(frameId, (frame) => frame.editText(text));
  }

  moveFrame(frameId: FrameId, position: Position) {
    return this.withEditFrame(frameId, (frame) => frame.move(position));
  }

  resizeFrame(frameId: FrameId, size: Size) {
    return this.withEditFrame(frameId, (frame) => frame.resize(size));
  }

  withEditFrame(frameId: FrameId, edit: (frame: Frame) => Frame) {
    const frame = this.frames.find((f) => f.id === frameId);

    if (!frame) {
      return this;
    }

    const editedFrame = edit(frame.clearDomainEvents());

    const frames = this.frames.map((f) => {
      return f.id !== frameId ? f : editedFrame.clearDomainEvents();
    });

    return this.withProps({
      frames,
      domainEvents: [...this.domainEvents, ...editedFrame.domainEvents],
    });
  }

  removeFrame(frameId: FrameId) {
    const frame = this.frames.find((f) => f.id === frameId)!;
    const removedFrame = frame.clearDomainEvents().removed();
    return this.withProps({
      frames: this.frames.filter((f) => f.id !== frameId),
      domainEvents: [...this.domainEvents, ...removedFrame.domainEvents],
    });
  }

  clearDomainEvents() {
    return this.withProps({ domainEvents: [] });
  }

  private withProps(props: WithBoardProps) {
    return new Board({
      ...this,
      ...props,
      id: this.id,
      projectId: this.projectId,
    });
  }
}
