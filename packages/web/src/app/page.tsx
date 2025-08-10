"use client"

import type React from "react"
import { TabButton, NoteView, ListView, TrashView } from "./components"
import { usePages, useNoteView, useDrag, useView } from "./hooks"

export default function Page() {
  // 페이지 관리 훅
  const {
    pages,
    loosePages,
    trashPages,
    updateContent,
    tearPage,
    discardFromList,
    deleteForever,
    updatePagePosition,
  } = usePages()

  // 뷰 상태 관리 훅
  const { view, setView } = useView()

  // 노트 뷰 관련 훅
  const { spread, totalSpreads, left, right, pageNumber, setSpread } = useNoteView(pages)

  // 드래그 관련 훅
  const drag = useDrag(updatePagePosition)

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <header className="mb-4 flex items-center justify-end">
        <div className="flex gap-1 rounded-lg border p-1">
          <TabButton active={view === "note"} onClick={() => setView("note")}>
            노트
          </TabButton>
          <TabButton active={view === "list"} onClick={() => setView("list")}>
            페이지 리스트
          </TabButton>
          <TabButton active={view === "trash"} onClick={() => setView("trash")}>
            휴지통
          </TabButton>
        </div>
      </header>

      {view === "note" && (
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
      )}

      {view === "list" && (
        <ListView
          loosePages={loosePages}
          onEdit={updateContent}
          onDiscard={discardFromList}
          onMouseDown={drag.onMouseDown}
        />
      )}

      {view === "trash" && (
        <TrashView
          trashPages={trashPages}
          onEdit={updateContent}
          onDeleteForever={deleteForever}
          onMouseDown={drag.onMouseDown}
        />
      )}
    </main>
  )
}
