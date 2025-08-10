"use client"

import type React from "react"
import { NoteView, Navigation } from "./components"
import { usePages, useNoteView } from "./hooks"

export default function Page() {
  // 페이지 관리 훅
  const {
    pages,
    updateContent,
    tearPage,
  } = usePages()

  // 노트 뷰 관련 훅
  const { spread, totalSpreads, left, right, pageNumber, setSpread } = useNoteView(pages)

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <Navigation />
      
      <NoteView
        pages={pages}
        spread={spread}
        totalSpreads={totalSpreads}
        left={left}
        right={right}
        pageNumber={pageNumber}
        onSpreadChange={setSpread}
        onEdit={updateContent}
        onTear={tearPage}
      />
    </main>
  )
}
