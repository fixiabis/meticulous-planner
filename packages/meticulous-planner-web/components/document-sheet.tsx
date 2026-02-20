"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FileText, Clock, ExternalLink } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  useWorkspace,
  closeDocumentSheet,
  updateDocumentContent,
  updateDocumentTitle,
  setActiveDocument,
  openDocumentSheet,
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

function SheetContentRenderer({
  content,
  allDocs,
  currentDocId,
}: {
  content: string
  allDocs: Document[]
  currentDocId: string
}) {
  const lines = content.split("\n")

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-2xl font-bold text-foreground leading-tight mt-4 mb-2 first:mt-0"
            >
              {renderInline(line.slice(2), allDocs, currentDocId)}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-lg font-semibold text-foreground leading-snug mt-4 mb-1"
            >
              {renderInline(line.slice(3), allDocs, currentDocId)}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-base font-medium text-foreground leading-snug mt-3 mb-1"
            >
              {renderInline(line.slice(4), allDocs, currentDocId)}
            </h3>
          )
        }
        if (line.startsWith("- [ ] ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <div className="mt-1 h-3.5 w-3.5 rounded border border-border shrink-0" />
              <span className="text-sm text-foreground leading-relaxed">
                {renderInline(line.slice(6), allDocs, currentDocId)}
              </span>
            </div>
          )
        }
        if (line.startsWith("- [x] ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <div className="mt-1 h-3.5 w-3.5 rounded border border-accent bg-accent shrink-0 flex items-center justify-center">
                <svg
                  className="h-2.5 w-2.5 text-accent-foreground"
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
              <span className="text-sm text-muted-foreground line-through leading-relaxed">
                {renderInline(line.slice(6), allDocs, currentDocId)}
              </span>
            </div>
          )
        }
        if (line.match(/^\d+\.\s/)) {
          const text = line.replace(/^\d+\.\s/, "")
          const num = line.match(/^(\d+)\./)?.[1]
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="min-w-4 text-xs text-muted-foreground">
                {num}.
              </span>
              <span className="text-sm text-foreground leading-relaxed">
                {renderInline(text, allDocs, currentDocId)}
              </span>
            </div>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
              <span className="text-sm text-foreground leading-relaxed">
                {renderInline(line.slice(2), allDocs, currentDocId)}
              </span>
            </div>
          )
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />
        }
        return (
          <p key={i} className="text-sm text-foreground leading-relaxed">
            {renderInline(line, allDocs, currentDocId)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(
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

    const linkIdx = linkMatch?.index ?? Infinity
    const boldIdx = boldMatch?.index ?? Infinity

    if (linkIdx === Infinity && boldIdx === Infinity) {
      parts.push(<span key={keyIndex++}>{remaining}</span>)
      break
    }

    if (linkIdx < boldIdx && linkMatch) {
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
          <span key={keyIndex++} className="text-muted-foreground">
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

export function DocumentSheet() {
  const workspace = useWorkspace()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const sheetDoc = workspace.documents.find(
    (d) => d.id === workspace.sheetDocumentId,
  )

  const startEditing = useCallback(() => {
    if (sheetDoc) {
      setEditContent(sheetDoc.content)
      setEditTitle(sheetDoc.title)
      setIsEditing(true)
    }
  }, [sheetDoc])

  const saveAndExit = useCallback(() => {
    if (sheetDoc) {
      updateDocumentContent(sheetDoc.id, editContent)
      if (editTitle.trim() && editTitle !== sheetDoc.title) {
        updateDocumentTitle(sheetDoc.id, editTitle.trim())
      }
    }
    setIsEditing(false)
  }, [sheetDoc, editContent, editTitle])

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
  }, [workspace.sheetDocumentId])

  const handleOpenFull = () => {
    if (sheetDoc) {
      if (isEditing) saveAndExit()
      setActiveDocument(sheetDoc.id)
      closeDocumentSheet()
    }
  }

  return (
    <Sheet
      open={!!workspace.sheetDocumentId}
      onOpenChange={(open) => {
        if (!open) {
          if (isEditing) saveAndExit()
          closeDocumentSheet()
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-card border-border p-0"
      >
        {sheetDoc && (
          <>
            <SheetHeader className="border-b border-border px-5 py-3">
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-transparent text-sm font-medium text-foreground outline-none border-b border-dashed border-muted-foreground/30 focus:border-accent flex-1"
                    />
                  ) : (
                    <SheetTitle className="truncate text-sm font-medium">
                      {sheetDoc.title}
                    </SheetTitle>
                  )}
                </div>
                <div className="flex items-center gap-1">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleOpenFull}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Open full</span>
                  </Button>
                </div>
              </div>
              <SheetDescription className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last edited {formatDate(sheetDoc.updatedAt)}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-100px)] overflow-hidden">
              <div className="px-5 py-5">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[calc(100vh-200px)] w-full resize-none bg-transparent text-sm text-foreground leading-relaxed outline-none font-mono"
                    spellCheck={false}
                  />
                ) : (
                  <div
                    onDoubleClick={startEditing}
                    className="cursor-text"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startEditing()
                    }}
                  >
                    <SheetContentRenderer
                      content={sheetDoc.content}
                      allDocs={workspace.documents}
                      currentDocId={sheetDoc.id}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
