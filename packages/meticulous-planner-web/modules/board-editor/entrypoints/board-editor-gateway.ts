import { Event as Base_Event } from '@/modules/base/models/records/values';
import {
  AddFrameCommand,
  AddStickyNoteCommand,
  EditBoardCommand,
  EditFrameTextCommand,
  EditStickyNoteTextCommand,
  MoveFrameCommand,
  MoveStickyNoteCommand,
  RemoveFrameCommand,
  RemoveStickyNoteCommand,
  ResizeFrameCommand,
} from '@/modules/board/models/messages/commands';
import {
  CopyCommand,
  DuplicateCommand,
  OpenBoardEditorCommand,
  PasteCommand,
  RedoCommand,
  UndoCommand,
} from '../models/messages/commands';

export interface BoardEditorGateway {
  openBoardEditor(command: OpenBoardEditorCommand): Promise<Base_Event[]>;

  undo(command: UndoCommand): Promise<Base_Event[]>;
  redo(command: RedoCommand): Promise<Base_Event[]>;

  copy(command: CopyCommand): Promise<Base_Event[]>;
  paste(command: PasteCommand): Promise<Base_Event[]>;
  duplicate(command: DuplicateCommand): Promise<Base_Event[]>;

  editBoard(command: EditBoardCommand): Promise<Base_Event[]>;
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
