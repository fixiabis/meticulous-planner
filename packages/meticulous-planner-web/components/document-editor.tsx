"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FileText, Clock, MoreHorizontal, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useWorkspace,
  updateDocumentContent,
  updateDocumentTitle,
  openDocumentSheet,
  deleteDocument,
  type Document,
} from "@/lib/workspace-store"

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function DocumentLinks({
  content,
  allDocs,
  currentDocId,
}: {
  content: string
  allDocs: Document[]
  currentDocId: string
}) {
  const linkRegex = /\[\[([^\]]+)\]\]/g
  const matches = [...content.matchAll(linkRegex)]

  if (matches.length === 0) return null

  const linkedDocs = matches
    .map((match) => {
      const linkText = match[1]
      return allDocs.find(
        (d) =>
          d.title.toLowerCase() === linkText.toLowerCase() &&
          d.id !== currentDocId,
      )
    })
    .filter(Boolean) as Document[]

  if (linkedDocs.length === 0) return null

  return (
    <div className="mt-6 border-t border-border pt-4">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Linked Documents
      </h3>
      <div className="flex flex-wrap gap-2">
        {linkedDocs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => openDocumentSheet(doc.id)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="h-3.5 w-3.5" />
            {doc.title}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ContentRendererProps {
  content: string
  allDocs: Document[]
  currentDocId: string
}

function ContentRenderer({
  content,
  allDocs,
  currentDocId,
}: ContentRendererProps) {
  const lines = content.split("\n")

  return (
    <div className="prose-custom space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-3xl font-bold text-foreground leading-tight mt-6 mb-2 first:mt-0"
            >
              {renderInlineContent(
                line.slice(2),
                allDocs,
                currentDocId,
              )}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-semibold text-foreground leading-snug mt-5 mb-1.5"
            >
              {renderInlineContent(
                line.slice(3),
                allDocs,
                currentDocId,
              )}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-lg font-medium text-foreground leading-snug mt-4 mb-1"
            >
              {renderInlineContent(
                line.slice(4),
                allDocs,
                currentDocId,
              )}
            </h3>
          )
        }
        if (line.startsWith("- [ ] ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <div className="mt-1 h-4 w-4 rounded border border-border shrink-0" />
              <span className="text-foreground leading-relaxed">
                {renderInlineContent(
                  line.slice(6),
                  allDocs,
                  currentDocId,
                )}
              </span>
            </div>
          )
        }
        if (line.startsWith("- [x] ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <div className="mt-1 h-4 w-4 rounded border border-accent bg-accent shrink-0 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground line-through leading-relaxed">
                {renderInlineContent(
                  line.slice(6),
                  allDocs,
                  currentDocId,
                )}
              </span>
            </div>
          )
        }
        if (line.match(/^\d+\.\s/)) {
          const text = line.replace(/^\d+\.\s/, "")
          const num = line.match(/^(\d+)\./)?.[1]
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="mt-0.5 min-w-5 text-sm text-muted-foreground">
                {num}.
              </span>
              <span className="text-foreground leading-relaxed">
                {renderInlineContent(
                  text,
                  allDocs,
                  currentDocId,
                )}
              </span>
            </div>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
              <span className="text-foreground leading-relaxed">
                {renderInlineContent(
                  line.slice(2),
                  allDocs,
                  currentDocId,
                )}
              </span>
            </div>
          )
        }
        if (line.trim() === "") {
          return <div key={i} className="h-3" />
        }
        return (
          <p key={i} className="text-foreground leading-relaxed">
            {renderInlineContent(line, allDocs, currentDocId)}
          </p>
        )
      })}
    </div>
  )
}

function renderInlineContent(
  text: string,
  allDocs: Document[],
  currentDocId: string,
) {
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIndex = 0

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[\[([^\]]+)\]\]/)
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

    const linkIndex = linkMatch?.index ?? Infinity
    const boldIndex = boldMatch?.index ?? Infinity

    if (linkIndex === Infinity && boldIndex === Infinity) {
      parts.push(<span key={keyIndex++}>{remaining}</span>)
      break
    }

    if (linkIndex < boldIndex && linkMatch) {
      if (linkMatch.index! > 0) {
        parts.push(
          <span key={keyIndex++}>
            {remaining.slice(0, linkMatch.index)}
          </span>,
        )
      }
      const linkText = linkMatch[1]
      const linkedDoc = allDocs.find(
        (d) =>
          d.title.toLowerCase() === linkText.toLowerCase() &&
          d.id !== currentDocId,
      )
      if (linkedDoc) {
        parts.push(
          <button
            key={keyIndex++}
            onClick={() => openDocumentSheet(linkedDoc.id)}
            className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-accent underline underline-offset-2 hover:bg-secondary transition-colors"
          >
            {linkText}
          </button>,
        )
      } else {
        parts.push(
          <span
            key={keyIndex++}
            className="text-muted-foreground"
          >
            {"[[" + linkText + "]]"}
          </span>,
        )
      }
      remaining = remaining.slice(
        linkMatch.index! + linkMatch[0].length,
      )
    } else if (boldMatch) {
      if (boldMatch.index! > 0) {
        parts.push(
          <span key={keyIndex++}>
            {remaining.slice(0, boldMatch.index)}
          </span>,
        )
      }
      parts.push(
        <strong key={keyIndex++} className="font-semibold">
          {boldMatch[1]}
        </strong>,
      )
      remaining = remaining.slice(
        boldMatch.index! + boldMatch[0].length,
      )
    }
  }

  return parts
}

export function DocumentEditor() {
  const workspace = useWorkspace()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeDoc = workspace.documents.find(
    (d) => d.id === workspace.activeDocumentId,
  )

  const startEditing = useCallback(() => {
    if (activeDoc) {
      setEditContent(activeDoc.content)
      setEditTitle(activeDoc.title)
      setIsEditing(true)
    }
  }, [activeDoc])

  const saveAndExit = useCallback(() => {
    if (activeDoc) {
      updateDocumentContent(activeDoc.id, editContent)
      if (editTitle.trim() && editTitle !== activeDoc.title) {
        updateDocumentTitle(activeDoc.id, editTitle.trim())
      }
    }
    setIsEditing(false)
  }, [activeDoc, editContent, editTitle])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current
      el.focus()
      el.selectionStart = el.value.length
      el.selectionEnd = el.value.length
    }
  }, [isEditing])

  useEffect(() => {
    setIsEditing(false)
  }, [workspace.activeDocumentId])

  if (!activeDoc) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg text-muted-foreground">
            Select a document to get started
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Choose a document from the sidebar or create a new one
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none border-b border-dashed border-muted-foreground/30 focus:border-accent"
            />
          ) : (
            <h1 className="truncate text-sm font-medium text-foreground">
              {activeDoc.title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(activeDoc.updatedAt)}
          </div>
          {isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={saveAndExit}
              className="h-7 text-xs text-accent hover:text-accent"
            >
              Done
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditing}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Document options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-popover text-popover-foreground"
            >
              <DropdownMenuItem
                onClick={() => deleteDocument(activeDoc.id)}
                className="text-sm text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-3xl px-8 py-8">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[calc(100vh-200px)] w-full resize-none bg-transparent text-foreground leading-relaxed outline-none font-mono text-sm"
              spellCheck={false}
            />
          ) : (
            <>
              <div
                onDoubleClick={startEditing}
                className="cursor-text"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") startEditing()
                }}
              >
                <ContentRenderer
                  content={activeDoc.content}
                  allDocs={workspace.documents}
                  currentDocId={activeDoc.id}
                />
              </div>
              <DocumentLinks
                content={activeDoc.content}
                allDocs={workspace.documents}
                currentDocId={activeDoc.id}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
