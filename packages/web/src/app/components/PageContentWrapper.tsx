"use client"

import { NoteView } from "."
import { usePages, useNoteView } from "../hooks"

interface PageContentWrapperProps {
  initialSpread?: string
}

export function PageContentWrapper({ initialSpread }: PageContentWrapperProps) {
  // 페이지 관리 훅
  const {
    pages,
    loading,
    updateContent,
    tearPage,
    add100Notes,
  } = usePages()

  // 노트 뷰 관련 훅 - 초기 spread 값을 props로 전달
  const { spread, totalSpreads, left, right, pageNumber, setSpread } = useNoteView(pages, initialSpread)

  return (
    <NoteView
      spread={spread}
      totalSpreads={totalSpreads}
      left={left}
      right={right}
      isLoading={loading}
      pageNumber={pageNumber}
      onSpreadChange={setSpread}
      onEdit={updateContent}
      onTear={tearPage}
      onAdd100Notes={add100Notes}
      pagesCount={pages.length}
    />
  )
}
