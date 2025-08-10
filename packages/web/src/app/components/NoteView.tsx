import type React from "react"
import type { Page } from "../types"
import { NotebookPage } from "./NotebookPage"
import { Button } from "@/components/ui/button"

interface NoteViewProps {
  spread: number
  totalSpreads: number
  left?: Page
  right?: Page
  isLoading?: boolean
  pageNumber: (p: Page | undefined) => number
  onSpreadChange: (spread: number) => void
  onEdit: (pageId: string, content: string) => void
  onTear: (pageId: string) => void
}

export function NoteView({
  spread,
  totalSpreads,
  left,
  right,
  isLoading,
  pageNumber,
  onSpreadChange,
  onEdit,
  onTear,
}: NoteViewProps) {
  return (
    <section className="group relative rounded-lg border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSpreadChange(Math.max(0, spread - 1))}
            disabled={spread === 0}
            aria-label="이전 펼침면"
          >
            {"← 이전"}
          </Button>
          <div className="text-xs text-neutral-500">{`${spread + 1} / ${totalSpreads}`}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSpreadChange(Math.min(totalSpreads - 1, spread + 1))}
            disabled={spread >= totalSpreads - 1}
            aria-label="다음 펼침면"
          >
            {"다음 →"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NotebookPage
          label={`#${left ? pageNumber(left) : "-"}`}
          page={left}
          isLoading={isLoading}
          onEdit={(val) => left && onEdit(left.id, val)}
          onTear={() => left && onTear(left.id)}
        />
        <NotebookPage
          label={`#${right ? pageNumber(right) : "-"}`}
          page={right}
          isLoading={isLoading}
          onEdit={(val) => right && onEdit(right.id, val)}
          onTear={() => right && onTear(right.id)}
        />
      </div>
    </section>
  )
} 
