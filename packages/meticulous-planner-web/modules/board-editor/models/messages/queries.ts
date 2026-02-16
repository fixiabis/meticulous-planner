import { Query } from '@/modules/base/models/records/values';
import { BoardId } from '../records/values';

export enum BoardEditorQueryType {
  GetBoardEditor = 'board-editor:get-board-editor',
}

export class GetBoardEditor extends Query<BoardEditorQueryType.GetBoardEditor> {
  constructor(public readonly boardId: BoardId) {
    super(BoardEditorQueryType.GetBoardEditor);
  }
}
