"use client"

import type React from "react"
import { NoteView, Navigation } from "./components"
import { usePages, useNoteView } from "./hooks"

export default function Page() {
  // 페이지 관리 훅
  const {
    pages,
    loading,
    updateContent,
    tearPage,
    add100Notes,
  } = usePages()

  // 노트 뷰 관련 훅
  const { spread, totalSpreads, left, right, pageNumber, setSpread } = useNoteView(pages)

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <Navigation />

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
    </main>
  )
}
