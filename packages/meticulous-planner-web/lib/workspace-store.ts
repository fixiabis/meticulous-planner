import { useSyncExternalStore } from "react"

export interface Document {
  id: string
  title: string
  content: string
  folderId: string
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
  isOpen: boolean
  createdAt: number
}

interface WorkspaceState {
  folders: Folder[]
  documents: Document[]
  activeDocumentId: string | null
  sheetDocumentId: string | null
}

let state: WorkspaceState = {
  folders: [
    { id: "folder-1", name: "Getting Started", isOpen: true, createdAt: Date.now() },
    { id: "folder-2", name: "Projects", isOpen: false, createdAt: Date.now() },
  ],
  documents: [
    {
      id: "doc-1",
      title: "Welcome",
      content:
        "# Welcome to Your Workspace\n\nThis is your personal document editor. You can create folders, add documents, and start writing.\n\n## Quick Start\n\n- Use the **sidebar** to navigate between folders and documents\n- Click the **+** button next to a folder to add a new document\n- Click on any linked document like [[Meeting Notes]] to open it in a side panel\n- Check the [[Project Roadmap]] for our full plan\n- Edit your content right here in the main area\n\n## Features\n\n- Folder-based organization\n- Rich text editing with markdown support\n- Side panel for quick document reference\n- Clean and minimal interface",
      folderId: "folder-1",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "doc-2",
      title: "Meeting Notes",
      content:
        "# Meeting Notes\n\nDate: February 2026\n\n## Agenda\n\n1. Project update\n2. Design review\n3. Sprint planning\n\n## Notes\n\nDiscussed the new feature roadmap and aligned on priorities for Q1. The team agreed to focus on improving the core editing experience before adding new integrations.\n\nSee the full details in [[Project Roadmap]].\n\n## Action Items\n\n- [ ] Finalize design specs\n- [ ] Set up development environment\n- [x] Review the [[Welcome]] document\n- [ ] Schedule follow-up meeting",
      folderId: "folder-1",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "doc-3",
      title: "Project Roadmap",
      content:
        "# Project Roadmap\n\nRefer back to [[Meeting Notes]] for context on decisions.\n\n## Phase 1 - Foundation\n\n- Set up workspace structure\n- Implement document editing\n- Add folder management\n\n## Phase 2 - Enhancement\n\n- Real-time collaboration\n- Advanced formatting tools\n- Export capabilities\n\n## Phase 3 - Scale\n\n- Team workspaces\n- Permission management\n- API integrations",
      folderId: "folder-2",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  activeDocumentId: "doc-1",
  sheetDocumentId: null,
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export function useWorkspace() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function setActiveDocument(docId: string) {
  state = { ...state, activeDocumentId: docId, sheetDocumentId: null }
  emitChange()
}

export function openDocumentSheet(docId: string) {
  state = { ...state, sheetDocumentId: docId }
  emitChange()
}

export function closeDocumentSheet() {
  state = { ...state, sheetDocumentId: null }
  emitChange()
}

export function addFolder(name: string) {
  const newFolder: Folder = {
    id: `folder-${Date.now()}`,
    name,
    isOpen: true,
    createdAt: Date.now(),
  }
  state = { ...state, folders: [...state.folders, newFolder] }
  emitChange()
}

export function renameFolder(folderId: string, name: string) {
  state = {
    ...state,
    folders: state.folders.map((f) =>
      f.id === folderId ? { ...f, name } : f,
    ),
  }
  emitChange()
}

export function deleteFolder(folderId: string) {
  const docsInFolder = state.documents.filter((d) => d.folderId === folderId)
  const docIds = docsInFolder.map((d) => d.id)
  state = {
    ...state,
    folders: state.folders.filter((f) => f.id !== folderId),
    documents: state.documents.filter((d) => d.folderId !== folderId),
    activeDocumentId: docIds.includes(state.activeDocumentId || "")
      ? null
      : state.activeDocumentId,
    sheetDocumentId: docIds.includes(state.sheetDocumentId || "")
      ? null
      : state.sheetDocumentId,
  }
  emitChange()
}

export function toggleFolder(folderId: string) {
  state = {
    ...state,
    folders: state.folders.map((f) =>
      f.id === folderId ? { ...f, isOpen: !f.isOpen } : f,
    ),
  }
  emitChange()
}

export function addDocument(folderId: string, title: string) {
  const newDoc: Document = {
    id: `doc-${Date.now()}`,
    title,
    content: `# ${title}\n\nStart writing here...`,
    folderId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  state = {
    ...state,
    documents: [...state.documents, newDoc],
    activeDocumentId: newDoc.id,
  }
  emitChange()
}

export function updateDocumentContent(docId: string, content: string) {
  state = {
    ...state,
    documents: state.documents.map((d) =>
      d.id === docId ? { ...d, content, updatedAt: Date.now() } : d,
    ),
  }
  emitChange()
}

export function updateDocumentTitle(docId: string, title: string) {
  state = {
    ...state,
    documents: state.documents.map((d) =>
      d.id === docId ? { ...d, title, updatedAt: Date.now() } : d,
    ),
  }
  emitChange()
}

export function deleteDocument(docId: string) {
  state = {
    ...state,
    documents: state.documents.filter((d) => d.id !== docId),
    activeDocumentId:
      state.activeDocumentId === docId ? null : state.activeDocumentId,
    sheetDocumentId:
      state.sheetDocumentId === docId ? null : state.sheetDocumentId,
  }
  emitChange()
}
