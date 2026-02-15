import { Query } from '@/modules/base/models/records/values';
import { ProjectId } from '../records/values';

export enum BoardQueryType {
  GetProjectBoards = 'board:get-project-boards',
}

export class GetProjectBoards extends Query<BoardQueryType.GetProjectBoards> {
  constructor(public readonly projectId: ProjectId) {
    super(BoardQueryType.GetProjectBoards);
  }
}
