import { BoardGateway } from '../entrypoints/board-gateway';
import { BoardStore } from '../models/dependencies';
import {
  AddFrameCommand,
  AddStickyNoteCommand,
  CreateBoardCommand,
  EditBoardCommand,
  EditFrameTextCommand,
  EditStickyNoteTextCommand,
  MoveFrameCommand,
  MoveStickyNoteCommand,
  RemoveBoardCommand,
  RemoveFrameCommand,
  RemoveStickyNoteCommand,
  ResizeFrameCommand,
} from '../models/messages/commands';
import { GetProjectBoards } from '../models/messages/queries';
import { Board } from '../models/records/board';
import { FrameId, StickyNoteId } from '../models/records/values';

export class BoardService implements BoardGateway {
  constructor(private readonly boardStore: BoardStore) {}

  async getProjectBoards(query: GetProjectBoards) {
    return this.boardStore.findAllByQuery((board) => board.projectId === query.projectId);
  }

  async createBoard(command: CreateBoardCommand) {
    const baseProps = { id: this.boardStore.generateId(), projectId: command.projectId };
    const createdBoard = new Board(baseProps).clearDomainEvents().created(baseProps);

    this.boardStore.put(createdBoard);

    return createdBoard.domainEvents;
  }

  async editBoard(command: EditBoardCommand) {
    const editedBoard = this.boardStore.getById(command.boardId).clearDomainEvents().edit(command.boardProps);
    this.boardStore.put(editedBoard);
    return editedBoard.domainEvents;
  }

  async removeBoard(command: RemoveBoardCommand) {
    const removedBoard = this.boardStore.getById(command.boardId).clearDomainEvents().removed();
    this.boardStore.removeById(removedBoard.id);
    return removedBoard.domainEvents;
  }

  async addStickyNote(command: AddStickyNoteCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .addStickyNote({ ...command.stickyNoteProps, id: this.boardStore.generateId<StickyNoteId>('sticky-note') });

    this.boardStore.put(board);

    return board.domainEvents;
  }

  async editStickyNoteText(command: EditStickyNoteTextCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .editStickyNoteText(command.stickyNoteId, command.text);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async moveStickyNote(command: MoveStickyNoteCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .moveStickyNote(command.stickyNoteId, command.position);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async removeStickyNote(command: RemoveStickyNoteCommand) {
    const board = this.boardStore.getById(command.boardId).clearDomainEvents().removeStickyNote(command.stickyNoteId);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async addFrame(command: AddFrameCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .addFrame({ ...command.frameProps, id: this.boardStore.generateId<FrameId>('frame') });

    this.boardStore.put(board);

    return board.domainEvents;
  }

  async editFrameText(command: EditFrameTextCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .editFrameText(command.frameId, command.text);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async moveFrame(command: MoveFrameCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .moveFrame(command.frameId, command.position);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async resizeFrame(command: ResizeFrameCommand) {
    const board = this.boardStore
      .getById(command.boardId)
      .clearDomainEvents()
      .resizeFrame(command.frameId, command.size);
    this.boardStore.put(board);
    return board.domainEvents;
  }

  async removeFrame(command: RemoveFrameCommand) {
    const board = this.boardStore.getById(command.boardId).clearDomainEvents().removeFrame(command.frameId);
    this.boardStore.put(board);
    return board.domainEvents;
  }
}
