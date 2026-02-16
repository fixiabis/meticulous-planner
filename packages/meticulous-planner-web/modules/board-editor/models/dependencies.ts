import { Store } from '@/modules/base/entrypoint/store';
import { BoardGateway } from '@/modules/board/entrypoints/board-gateway';
import { BoardStore } from '@/modules/board/models/dependencies';
import { BoardEditor } from './records/board-editor';

export type { BoardGateway, BoardStore };

export interface BoardEditorStore extends Store<BoardEditor> {}
