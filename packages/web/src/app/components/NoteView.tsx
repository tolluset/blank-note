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
  onAdd100Notes: () => void
  pagesCount: number
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
  onAdd100Notes,
  pagesCount,
}: NoteViewProps) {
  // 페이지가 없을 때 (로딩 중이 아니고, 실제로 페이지가 0개일 때만)
  const hasNoPages = !isLoading && pagesCount === 0

  return (
    <section className="group relative rounded-lg border bg-white p-3 shadow-sm">
      {hasNoPages ? (
        // 페이지 없을 때: 100개 노트 추가 버튼 표시
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-neutral-500 text-center">
            <div className="text-lg mb-2">노트가 없습니다</div>
            <div className="text-sm">100개의 빈 페이지로 시작하세요</div>
          </div>
          <Button
            onClick={onAdd100Notes}
            disabled={isLoading}
            className="px-6 py-2"
          >
            100페이지로 시작하기
          </Button>
        </div>
      ) : (
        // 페이지 있을 때: 기존 노트뷰 표시
        <>
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
            {right ? (
              <NotebookPage
                label={`#${pageNumber(right)}`}
                page={right}
                isLoading={isLoading}
                onEdit={(val) => onEdit(right.id, val)}
                onTear={() => onTear(right.id)}
              />
            ) : (
              // right 페이지가 없을 때 100개로 채우기 버튼 표시
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 min-h-[400px]">
                <div className="text-neutral-500 text-center mb-4">
                  <div className="text-sm mb-2">페이지를 100개까지 늘릴까요?</div>
                </div>
                <Button
                  onClick={onAdd100Notes}
                  disabled={isLoading}
                  size="sm"
                  className="text-xs px-4 py-2"
                >
                  100개로 채우기
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
} 
