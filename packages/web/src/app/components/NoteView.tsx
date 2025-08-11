import type React from "react"
import type { Page } from "../types"
import { NotebookPage } from "./NotebookPage"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"

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
  const { t } = useLanguage()
  // 페이지가 없을 때 (로딩 중이 아니고, 실제로 페이지가 0개일 때만)
  const hasNoPages = !isLoading && pagesCount === 0

  return (
    <section className="group relative rounded-lg border bg-white p-3 shadow-sm">
      {hasNoPages ? (
        // 페이지 없을 때: 100개 노트 추가 버튼 표시
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-neutral-500 text-center">
            <div className="text-lg mb-2">{t("noNotes")}</div>
            <div className="text-sm">{t("startWithEmptyPages")}</div>
          </div>
          <Button
            onClick={onAdd100Notes}
            disabled={isLoading}
            className="px-6 py-2"
          >
            {t("startWith100Pages")}
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
                aria-label={t("previousSpread")}
              >
                {t("previous")}
              </Button>
              <div className="text-xs text-neutral-500">{`${spread + 1} / ${totalSpreads}`}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSpreadChange(Math.min(totalSpreads - 1, spread + 1))}
                disabled={spread >= totalSpreads - 1}
                aria-label={t("nextSpread")}
              >
                {t("next")}
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
            ) : isLoading ? (
              // 로딩 중일 때 스켈레톤 표시
              <div className="relative rounded-lg border bg-white p-3 shadow-sm animate-pulse">
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="rounded-md border h-[280px] bg-gray-50"></div>
              </div>
            ) : (
              // right 페이지가 없을 때 100개로 채우기 버튼 표시
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 min-h-[400px]">
                <div className="text-neutral-500 text-center mb-4">
                  <div className="text-sm mb-2">{t("expandTo100Question")}</div>
                </div>
                <Button
                  onClick={onAdd100Notes}
                  disabled={isLoading}
                  size="sm"
                  className="text-xs px-4 py-2"
                >
                  {t("expandTo100")}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
} 
