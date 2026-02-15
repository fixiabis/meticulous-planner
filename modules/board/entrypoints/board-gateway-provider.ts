import { DefaultStore } from '@/modules/base/integrations/default-store';
import { BoardService } from '../services/board-service';
import { BoardGateway } from './board-gateway';

export class BoardGatewayProvider {
  async get(): Promise<BoardGateway> {
    return new BoardService(
      new DefaultStore(
        () => ({}),
        (values) => values,
      ),
    );
  }
}
