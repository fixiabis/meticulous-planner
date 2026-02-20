"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronRight,
  FileText,
  FolderIcon,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
  PanelLeftClose,
  Search,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  useWorkspace,
  setActiveDocument,
  addFolder,
  addDocument,
  toggleFolder,
  renameFolder,
  deleteFolder,
  deleteDocument,
} from "@/lib/workspace-store"
import { cn } from "@/lib/utils"

interface WorkspaceSidebarProps {
  onClose: () => void
}

export function WorkspaceSidebar({ onClose }: WorkspaceSidebarProps) {
  const workspace = useWorkspace()
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState("")
  const [addingDocFolderId, setAddingDocFolderId] = useState<string | null>(
    null,
  )
  const [newDocTitle, setNewDocTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const folderInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingFolder && folderInputRef.current) {
      folderInputRef.current.focus()
    }
  }, [isAddingFolder])

  useEffect(() => {
    if (addingDocFolderId && docInputRef.current) {
      docInputRef.current.focus()
    }
  }, [addingDocFolderId])

  useEffect(() => {
    if (editingFolderId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingFolderId])

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim())
      setNewFolderName("")
      setIsAddingFolder(false)
    }
  }

  const handleRenameFolder = (folderId: string) => {
    if (editFolderName.trim()) {
      renameFolder(folderId, editFolderName.trim())
      setEditingFolderId(null)
      setEditFolderName("")
    }
  }

  const handleAddDocument = (folderId: string) => {
    if (newDocTitle.trim()) {
      addDocument(folderId, newDocTitle.trim())
      setNewDocTitle("")
      setAddingDocFolderId(null)
    }
  }

  const filteredFolders = workspace.folders.filter((folder) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (folder.name.toLowerCase().includes(q)) return true
    const docs = workspace.documents.filter((d) => d.folderId === folder.id)
    return docs.some((d) => d.title.toLowerCase().includes(q))
  })

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold text-sidebar-foreground tracking-tight">
          Workspace
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={onClose}
        >
          <PanelLeftClose className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 bg-sidebar-accent border-transparent pl-8 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="px-2 py-1">
          {filteredFolders.map((folder) => {
            const folderDocs = workspace.documents.filter(
              (d) => d.folderId === folder.id,
            )
            const filteredDocs = searchQuery
              ? folderDocs.filter((d) =>
                  d.title.toLowerCase().includes(searchQuery.toLowerCase()),
                )
              : folderDocs

            return (
              <div key={folder.id} className="mb-1">
                <div className="group flex items-center gap-0.5 rounded-md px-1.5 py-1 hover:bg-sidebar-accent">
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="flex items-center text-muted-foreground hover:text-sidebar-foreground"
                    aria-label={
                      folder.isOpen ? "Collapse folder" : "Expand folder"
                    }
                  >
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        folder.isOpen && "rotate-90",
                      )}
                    />
                  </button>

                  {editingFolderId === folder.id ? (
                    <Input
                      ref={editInputRef}
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleRenameFolder(folder.id)
                        if (e.key === "Escape") {
                          setEditingFolderId(null)
                          setEditFolderName("")
                        }
                      }}
                      onBlur={() => handleRenameFolder(folder.id)}
                      className="h-6 flex-1 border-transparent bg-transparent px-1 py-0 text-sm text-sidebar-foreground focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  ) : (
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="flex flex-1 items-center gap-1.5 overflow-hidden"
                    >
                      {folder.isOpen ? (
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate text-sm text-sidebar-foreground">
                        {folder.name}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAddingDocFolderId(folder.id)
                        if (!folder.isOpen) toggleFolder(folder.id)
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span className="sr-only">Add document</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                          <span className="sr-only">Folder options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-40 bg-popover text-popover-foreground"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingFolderId(folder.id)
                            setEditFolderName(folder.name)
                          }}
                          className="text-sm"
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteFolder(folder.id)}
                          className="text-sm text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {folder.isOpen && (
                  <div className="ml-4 mt-0.5">
                    {filteredDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDocument(doc.id)}
                        className={cn(
                          "group/doc flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm transition-colors",
                          workspace.activeDocumentId === doc.id
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 truncate">{doc.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <span
                              role="button"
                              tabIndex={0}
                              className="opacity-0 group-hover/doc:opacity-100 flex h-5 w-5 items-center justify-center rounded hover:bg-border"
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  e.stopPropagation()
                              }}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-36 bg-popover text-popover-foreground"
                          >
                            <DropdownMenuItem
                              onClick={() => deleteDocument(doc.id)}
                              className="text-sm text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </button>
                    ))}

                    {addingDocFolderId === folder.id && (
                      <div className="px-2 py-1">
                        <Input
                          ref={docInputRef}
                          placeholder="Document title..."
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleAddDocument(folder.id)
                            if (e.key === "Escape") {
                              setAddingDocFolderId(null)
                              setNewDocTitle("")
                            }
                          }}
                          onBlur={() => {
                            if (newDocTitle.trim()) {
                              handleAddDocument(folder.id)
                            } else {
                              setAddingDocFolderId(null)
                            }
                          }}
                          className="h-7 border-transparent bg-sidebar-accent text-sm text-sidebar-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {isAddingFolder ? (
            <div className="px-1.5 py-1">
              <Input
                ref={folderInputRef}
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddFolder()
                  if (e.key === "Escape") {
                    setIsAddingFolder(false)
                    setNewFolderName("")
                  }
                }}
                onBlur={() => {
                  if (newFolderName.trim()) {
                    handleAddFolder()
                  } else {
                    setIsAddingFolder(false)
                  }
                }}
                className="h-7 border-transparent bg-sidebar-accent text-sm text-sidebar-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddingFolder(true)}
              className="mt-1 flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Folder
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
