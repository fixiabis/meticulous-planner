import { DefaultStore } from '@/modules/base/integrations/default-store';
import { BoardGateway } from '@/modules/board/entrypoints/board-gateway';
import { BoardStore } from '@/modules/board/models/dependencies';
import { BoardEditorService } from '../services/board-editor-service';
import { BoardEditorGateway } from './board-editor-gateway';

export class BoardEditorGatewayProvider {
  constructor(
    private readonly boardGateway: BoardGateway,
    private readonly boardStore: BoardStore,
  ) {}

  async get(): Promise<BoardEditorGateway> {
    return new BoardEditorService(
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
      this.boardGateway,
      this.boardStore,
    );
  }
}
