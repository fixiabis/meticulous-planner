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
  BoardEventType,
  FrameAdded,
  FrameMoved,
  FrameResized,
  FrameTextEdited,
  StickyNoteAdded,
  StickyNoteMoved,
  StickyNoteTextEdited,
} from '@/modules/board/models/messages/events';
import { BaseStickyNoteProps } from '@/modules/board/models/records/sticky-note';
import { BaseFrameProps } from '@/modules/board/models/records/frame';
import { BoardEditorGateway } from '../entrypoints/board-editor-gateway';
import { BoardEditorStore, BoardGateway, BoardStore } from '../models/dependencies';
import {
  CopyCommand,
  DuplicateCommand,
  OpenBoardEditorCommand,
  PasteCommand,
  RedoCommand,
  UndoCommand,
} from '../models/messages/commands';
import { BoardEditor } from '../models/records/board-editor';
import {
  ClipboardFrame,
  ClipboardItem,
  ClipboardStickyNote,
  UndoEntry,
} from '../models/records/values';

export class BoardEditorService implements BoardEditorGateway {
  constructor(
    private readonly boardEditorStore: BoardEditorStore,
    private readonly boardGateway: BoardGateway,
    private readonly boardStore: BoardStore,
  ) {}

  async openBoardEditor(command: OpenBoardEditorCommand) {
    const editor = new BoardEditor({ id: command.boardId }).clearDomainEvents().opened();
    this.boardEditorStore.put(editor);
    return editor.domainEvents;
  }

  async editBoard(command: EditBoardCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const board = this.boardStore.getById(command.boardId);

    const boardRecord = board as unknown as Record<string, unknown>;
    const prevBoardProps = Object.fromEntries(
      Object.keys(command.boardProps).map((key) => [key, boardRecord[key]]),
    ) as typeof command.boardProps;

    const boardEvents = await this.boardGateway.editBoard(command);

    const entry: UndoEntry = {
      type: 'edit-board',
      boardId: command.boardId,
      boardProps: command.boardProps,
      prevBoardProps,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async addStickyNote(command: AddStickyNoteCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.addStickyNote(command);

    const addedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.StickyNoteAdded,
    ) as StickyNoteAdded;

    const entry: UndoEntry = {
      type: 'add-sticky-note',
      boardId: command.boardId,
      stickyNoteId: addedEvent.stickyNoteId,
      props: command.stickyNoteProps,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async editStickyNoteText(command: EditStickyNoteTextCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.editStickyNoteText(command);

    const editedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.StickyNoteTextEdited,
    ) as StickyNoteTextEdited;

    const entry: UndoEntry = {
      type: 'edit-sticky-note-text',
      boardId: command.boardId,
      stickyNoteId: command.stickyNoteId,
      text: editedEvent.text,
      prevText: editedEvent.prevText,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async moveStickyNote(command: MoveStickyNoteCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.moveStickyNote(command);

    const movedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.StickyNoteMoved,
    ) as StickyNoteMoved;

    const entry: UndoEntry = {
      type: 'move-sticky-note',
      boardId: command.boardId,
      stickyNoteId: command.stickyNoteId,
      position: movedEvent.position,
      prevPosition: movedEvent.prevPosition,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async removeStickyNote(command: RemoveStickyNoteCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const board = this.boardStore.getById(command.boardId);
    const stickyNote = board.stickyNotes.find((sn) => sn.id === command.stickyNoteId)!;

    const savedProps: BaseStickyNoteProps = {
      id: stickyNote.id,
      boardId: stickyNote.boardId,
      type: stickyNote.type,
      size: stickyNote.size,
      text: stickyNote.text,
      position: stickyNote.position,
    };

    const boardEvents = await this.boardGateway.removeStickyNote(command);

    const entry: UndoEntry = {
      type: 'remove-sticky-note',
      boardId: command.boardId,
      stickyNoteId: command.stickyNoteId,
      props: savedProps,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async addFrame(command: AddFrameCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.addFrame(command);

    const addedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.FrameAdded,
    ) as FrameAdded;

    const entry: UndoEntry = {
      type: 'add-frame',
      boardId: command.boardId,
      frameId: addedEvent.frameId,
      props: command.frameProps,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async editFrameText(command: EditFrameTextCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.editFrameText(command);

    const editedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.FrameTextEdited,
    ) as FrameTextEdited;

    const entry: UndoEntry = {
      type: 'edit-frame-text',
      boardId: command.boardId,
      frameId: command.frameId,
      text: editedEvent.text,
      prevText: editedEvent.prevText,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async moveFrame(command: MoveFrameCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.moveFrame(command);

    const movedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.FrameMoved,
    ) as FrameMoved;

    const entry: UndoEntry = {
      type: 'move-frame',
      boardId: command.boardId,
      frameId: command.frameId,
      position: movedEvent.position,
      prevPosition: movedEvent.prevPosition,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async resizeFrame(command: ResizeFrameCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const boardEvents = await this.boardGateway.resizeFrame(command);

    const resizedEvent = boardEvents.find(
      (e) => e.type === BoardEventType.FrameResized,
    ) as FrameResized;

    const entry: UndoEntry = {
      type: 'resize-frame',
      boardId: command.boardId,
      frameId: command.frameId,
      size: resizedEvent.size,
      prevSize: resizedEvent.prevSize,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async removeFrame(command: RemoveFrameCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const board = this.boardStore.getById(command.boardId);
    const frame = board.frames.find((f) => f.id === command.frameId)!;

    const savedProps: BaseFrameProps = {
      id: frame.id,
      boardId: frame.boardId,
      text: frame.text,
      position: frame.position,
      size: frame.size,
    };

    const boardEvents = await this.boardGateway.removeFrame(command);

    const entry: UndoEntry = {
      type: 'remove-frame',
      boardId: command.boardId,
      frameId: command.frameId,
      props: savedProps,
    };

    const newEditor = editor.pushUndo(entry);
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...boardEvents];
  }

  async undo(command: UndoCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();

    if (editor.undoStack.length === 0) {
      return [];
    }

    const entry = editor.undoStack[editor.undoStack.length - 1];
    const { events: boardEvents, updatedEntry: redoEntry } = await this.executeReverse(entry);
    const undoneEditor = editor.undo(redoEntry);
    this.boardEditorStore.put(undoneEditor);
    return [...undoneEditor.domainEvents, ...boardEvents];
  }

  async redo(command: RedoCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();

    if (editor.redoStack.length === 0) {
      return [];
    }

    const entry = editor.redoStack[editor.redoStack.length - 1];
    const { events: boardEvents, updatedEntry: undoEntry } = await this.executeForward(entry);
    const redoneEditor = editor.redo(undoEntry);
    this.boardEditorStore.put(redoneEditor);
    return [...redoneEditor.domainEvents, ...boardEvents];
  }

  async copy(command: CopyCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const board = this.boardStore.getById(command.boardId);

    const selectedStickyNotes = board.stickyNotes.filter((sn) =>
      command.stickyNoteIds.includes(sn.id),
    );
    const selectedFrames = board.frames.filter((f) =>
      command.frameIds.includes(f.id),
    );

    const allPositions = [
      ...selectedStickyNotes.map((sn) => sn.position),
      ...selectedFrames.map((f) => f.position),
    ];

    if (allPositions.length === 0) {
      return [];
    }

    const anchorX = Math.min(...allPositions.map((p) => p.x));
    const anchorY = Math.min(...allPositions.map((p) => p.y));

    const clipboardItems: ClipboardItem[] = [
      ...selectedStickyNotes.map((sn): ClipboardStickyNote => ({
        type: 'sticky-note',
        stickyNoteType: sn.type,
        text: sn.text,
        relativePosition: { x: sn.position.x - anchorX, y: sn.position.y - anchorY },
        size: sn.size,
      })),
      ...selectedFrames.map((f): ClipboardFrame => ({
        type: 'frame',
        text: f.text,
        relativePosition: { x: f.position.x - anchorX, y: f.position.y - anchorY },
        size: f.size,
      })),
    ];

    const copiedEditor = editor.copy(clipboardItems);
    this.boardEditorStore.put(copiedEditor);
    return copiedEditor.domainEvents;
  }

  async paste(command: PasteCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();

    if (editor.clipboard.length === 0) {
      return [];
    }

    const allBoardEvents: Base_Event[] = [];
    const batchEntries: UndoEntry[] = [];

    for (const item of editor.clipboard) {
      const position = {
        x: command.position.x + item.relativePosition.x,
        y: command.position.y + item.relativePosition.y,
      };

      if (item.type === 'sticky-note') {
        const stickyNoteProps: BaseStickyNoteProps = {
          id: '' as BaseStickyNoteProps['id'],
          boardId: command.boardId as BaseStickyNoteProps['boardId'],
          type: item.stickyNoteType,
          size: item.size,
          text: item.text,
          position,
        };
        const events = await this.boardGateway.addStickyNote(
          new AddStickyNoteCommand(command.boardId, stickyNoteProps),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.StickyNoteAdded,
        ) as StickyNoteAdded;
        batchEntries.push({
          type: 'add-sticky-note',
          boardId: command.boardId,
          stickyNoteId: addedEvent.stickyNoteId,
          props: stickyNoteProps,
        });
        allBoardEvents.push(...events);
      } else {
        const frameProps: BaseFrameProps = {
          id: '' as BaseFrameProps['id'],
          boardId: command.boardId as BaseFrameProps['boardId'],
          text: item.text,
          size: item.size,
          position,
        };
        const events = await this.boardGateway.addFrame(
          new AddFrameCommand(command.boardId, frameProps),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.FrameAdded,
        ) as FrameAdded;
        batchEntries.push({
          type: 'add-frame',
          boardId: command.boardId,
          frameId: addedEvent.frameId,
          props: frameProps,
        });
        allBoardEvents.push(...events);
      }
    }

    const batchEntry: UndoEntry = { type: 'batch', entries: batchEntries };
    const newEditor = editor.pushUndo(batchEntry).pasted();
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...allBoardEvents];
  }

  async duplicate(command: DuplicateCommand) {
    const editor = this.boardEditorStore.getById(command.boardId).clearDomainEvents();
    const board = this.boardStore.getById(command.boardId);

    const selectedStickyNotes = board.stickyNotes.filter((sn) =>
      command.stickyNoteIds.includes(sn.id),
    );
    const selectedFrames = board.frames.filter((f) =>
      command.frameIds.includes(f.id),
    );

    if (selectedStickyNotes.length === 0 && selectedFrames.length === 0) {
      return [];
    }

    const allBoardEvents: Base_Event[] = [];
    const batchEntries: UndoEntry[] = [];

    for (const sn of selectedStickyNotes) {
      const position = { x: sn.position.x + command.offset.x, y: sn.position.y + command.offset.y };
      const stickyNoteProps: BaseStickyNoteProps = {
        id: sn.id,
        boardId: sn.boardId,
        type: sn.type,
        size: sn.size,
        text: sn.text,
        position,
      };
      const events = await this.boardGateway.addStickyNote(
        new AddStickyNoteCommand(command.boardId, stickyNoteProps),
      );
      const addedEvent = events.find(
        (e) => e.type === BoardEventType.StickyNoteAdded,
      ) as StickyNoteAdded;
      batchEntries.push({
        type: 'add-sticky-note',
        boardId: command.boardId,
        stickyNoteId: addedEvent.stickyNoteId,
        props: stickyNoteProps,
      });
      allBoardEvents.push(...events);
    }

    for (const f of selectedFrames) {
      const position = { x: f.position.x + command.offset.x, y: f.position.y + command.offset.y };
      const frameProps: BaseFrameProps = {
        id: f.id,
        boardId: f.boardId,
        text: f.text,
        size: f.size,
        position,
      };
      const events = await this.boardGateway.addFrame(
        new AddFrameCommand(command.boardId, frameProps),
      );
      const addedEvent = events.find(
        (e) => e.type === BoardEventType.FrameAdded,
      ) as FrameAdded;
      batchEntries.push({
        type: 'add-frame',
        boardId: command.boardId,
        frameId: addedEvent.frameId,
        props: frameProps,
      });
      allBoardEvents.push(...events);
    }

    const batchEntry: UndoEntry = { type: 'batch', entries: batchEntries };
    const newEditor = editor.pushUndo(batchEntry).duplicated();
    this.boardEditorStore.put(newEditor);
    return [...newEditor.domainEvents, ...allBoardEvents];
  }

  private async executeReverse(entry: UndoEntry): Promise<{ events: Base_Event[]; updatedEntry: UndoEntry }> {
    switch (entry.type) {
      case 'edit-board': {
        const board = this.boardStore.getById(entry.boardId);
        const events = await this.boardGateway.editBoard(
          new EditBoardCommand(board.projectId, entry.boardId, entry.prevBoardProps),
        );
        return { events, updatedEntry: entry };
      }

      case 'add-sticky-note': {
        const events = await this.boardGateway.removeStickyNote(
          new RemoveStickyNoteCommand(entry.boardId, entry.stickyNoteId),
        );
        return { events, updatedEntry: entry };
      }

      case 'edit-sticky-note-text': {
        const events = await this.boardGateway.editStickyNoteText(
          new EditStickyNoteTextCommand(entry.boardId, entry.stickyNoteId, entry.prevText),
        );
        return { events, updatedEntry: entry };
      }

      case 'move-sticky-note': {
        const events = await this.boardGateway.moveStickyNote(
          new MoveStickyNoteCommand(entry.boardId, entry.stickyNoteId, entry.prevPosition),
        );
        return { events, updatedEntry: entry };
      }

      case 'remove-sticky-note': {
        const events = await this.boardGateway.addStickyNote(
          new AddStickyNoteCommand(entry.boardId, entry.props),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.StickyNoteAdded,
        ) as StickyNoteAdded | undefined;
        const updatedEntry = addedEvent
          ? { ...entry, stickyNoteId: addedEvent.stickyNoteId }
          : entry;
        return { events, updatedEntry };
      }

      case 'add-frame': {
        const events = await this.boardGateway.removeFrame(
          new RemoveFrameCommand(entry.boardId, entry.frameId),
        );
        return { events, updatedEntry: entry };
      }

      case 'edit-frame-text': {
        const events = await this.boardGateway.editFrameText(
          new EditFrameTextCommand(entry.boardId, entry.frameId, entry.prevText),
        );
        return { events, updatedEntry: entry };
      }

      case 'move-frame': {
        const events = await this.boardGateway.moveFrame(
          new MoveFrameCommand(entry.boardId, entry.frameId, entry.prevPosition),
        );
        return { events, updatedEntry: entry };
      }

      case 'resize-frame': {
        const events = await this.boardGateway.resizeFrame(
          new ResizeFrameCommand(entry.boardId, entry.frameId, entry.prevSize),
        );
        return { events, updatedEntry: entry };
      }

      case 'remove-frame': {
        const events = await this.boardGateway.addFrame(
          new AddFrameCommand(entry.boardId, entry.props),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.FrameAdded,
        ) as FrameAdded | undefined;
        const updatedEntry = addedEvent
          ? { ...entry, frameId: addedEvent.frameId }
          : entry;
        return { events, updatedEntry };
      }

      case 'batch': {
        const allEvents: Base_Event[] = [];
        const updatedEntries: UndoEntry[] = [];

        for (let i = entry.entries.length - 1; i >= 0; i--) {
          const result = await this.executeReverse(entry.entries[i]);
          allEvents.push(...result.events);
          updatedEntries.unshift(result.updatedEntry);
        }

        return { events: allEvents, updatedEntry: { type: 'batch', entries: updatedEntries } };
      }
    }
  }

  private async executeForward(entry: UndoEntry): Promise<{ events: Base_Event[]; updatedEntry: UndoEntry }> {
    switch (entry.type) {
      case 'edit-board': {
        const board = this.boardStore.getById(entry.boardId);
        const events = await this.boardGateway.editBoard(
          new EditBoardCommand(board.projectId, entry.boardId, entry.boardProps),
        );
        return { events, updatedEntry: entry };
      }

      case 'add-sticky-note': {
        const events = await this.boardGateway.addStickyNote(
          new AddStickyNoteCommand(entry.boardId, entry.props),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.StickyNoteAdded,
        ) as StickyNoteAdded | undefined;
        const updatedEntry = addedEvent
          ? { ...entry, stickyNoteId: addedEvent.stickyNoteId }
          : entry;
        return { events, updatedEntry };
      }

      case 'edit-sticky-note-text': {
        const events = await this.boardGateway.editStickyNoteText(
          new EditStickyNoteTextCommand(entry.boardId, entry.stickyNoteId, entry.text),
        );
        return { events, updatedEntry: entry };
      }

      case 'move-sticky-note': {
        const events = await this.boardGateway.moveStickyNote(
          new MoveStickyNoteCommand(entry.boardId, entry.stickyNoteId, entry.position),
        );
        return { events, updatedEntry: entry };
      }

      case 'remove-sticky-note': {
        const events = await this.boardGateway.removeStickyNote(
          new RemoveStickyNoteCommand(entry.boardId, entry.stickyNoteId),
        );
        return { events, updatedEntry: entry };
      }

      case 'add-frame': {
        const events = await this.boardGateway.addFrame(
          new AddFrameCommand(entry.boardId, entry.props),
        );
        const addedEvent = events.find(
          (e) => e.type === BoardEventType.FrameAdded,
        ) as FrameAdded | undefined;
        const updatedEntry = addedEvent
          ? { ...entry, frameId: addedEvent.frameId }
          : entry;
        return { events, updatedEntry };
      }

      case 'edit-frame-text': {
        const events = await this.boardGateway.editFrameText(
          new EditFrameTextCommand(entry.boardId, entry.frameId, entry.text),
        );
        return { events, updatedEntry: entry };
      }

      case 'move-frame': {
        const events = await this.boardGateway.moveFrame(
          new MoveFrameCommand(entry.boardId, entry.frameId, entry.position),
        );
        return { events, updatedEntry: entry };
      }

      case 'resize-frame': {
        const events = await this.boardGateway.resizeFrame(
          new ResizeFrameCommand(entry.boardId, entry.frameId, entry.size),
        );
        return { events, updatedEntry: entry };
      }

      case 'remove-frame': {
        const events = await this.boardGateway.removeFrame(
          new RemoveFrameCommand(entry.boardId, entry.frameId),
        );
        return { events, updatedEntry: entry };
      }

      case 'batch': {
        const allEvents: Base_Event[] = [];
        const updatedEntries: UndoEntry[] = [];

        for (const subEntry of entry.entries) {
          const result = await this.executeForward(subEntry);
          allEvents.push(...result.events);
          updatedEntries.push(result.updatedEntry);
        }

        return { events: allEvents, updatedEntry: { type: 'batch', entries: updatedEntries } };
      }
    }
  }
}
