import type React from "react"
import { useMemo } from "react"
import type { Page } from "../types"

interface NotebookPageProps {
  label: string
  page?: Page
  onEdit: (value: string) => void
  onTear: () => void
}

export function NotebookPage({ label, page, onEdit, onTear }: NotebookPageProps) {
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
      backgroundPosition: "0 12px",
      backgroundAttachment: "local"
    }),
    [],
  )

  return (
    <div className="relative rounded-lg border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-neutral-500">{label}</div>
        <div className="flex gap-2">
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-50"
            onClick={onTear}
            disabled={!page}
          >
            {"페이지 찢기"}
          </button>
        </div>
      </div>

      <div className="rounded-md border" aria-label="노트 페이지">
        {page ? (
          <textarea
            className="h-[280px] w-full resize-none bg-transparent p-2 outline-none"
            placeholder="여기에 직접 입력하세요..."
            value={page.content}
            onChange={(e) => onEdit(e.target.value)}
            style={{
              lineHeight: '24px',
              ...linedStyle
            }}
          />
        ) : (
          <div className="p-2 text-neutral-400">{"빈 페이지"}</div>
        )}
      </div>
    </div>
  )
}

