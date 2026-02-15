import { Event as Base_Event } from '@/modules/base/models/records/values';
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

export interface BoardGateway {
  getProjectBoards(query: GetProjectBoards): Promise<Board[]>;
  createBoard(command: CreateBoardCommand): Promise<Base_Event[]>;
  editBoard(command: EditBoardCommand): Promise<Base_Event[]>;
  removeBoard(command: RemoveBoardCommand): Promise<Base_Event[]>;
  addStickyNote(command: AddStickyNoteCommand): Promise<Base_Event[]>;
  editStickyNoteText(command: EditStickyNoteTextCommand): Promise<Base_Event[]>;
  moveStickyNote(command: MoveStickyNoteCommand): Promise<Base_Event[]>;
  removeStickyNote(command: RemoveStickyNoteCommand): Promise<Base_Event[]>;
  addFrame(command: AddFrameCommand): Promise<Base_Event[]>;
  editFrameText(command: EditFrameTextCommand): Promise<Base_Event[]>;
  moveFrame(command: MoveFrameCommand): Promise<Base_Event[]>;
  resizeFrame(command: ResizeFrameCommand): Promise<Base_Event[]>;
  removeFrame(command: RemoveFrameCommand): Promise<Base_Event[]>;
}
