"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { Page, PositionedPage, View } from "./types"
import { uid } from "./utils"
import { useDrag } from "./hooks/useDrag"
import { TabButton, NoteView, ListView, TrashView } from "./components"

export default function Page() {
  // 노트북 내부 페이지(순서 유지)
  const [pages, setPages] = useState<Page[]>(() => [
    { id: uid(), content: "" },
    { id: uid(), content: "" },
    { id: uid(), content: "" },
    { id: uid(), content: "" },
  ])
  // 찢은 페이지(자유 배치)
  const [loosePages, setLoosePages] = useState<PositionedPage[]>([])
  // 휴지통(자유 배치)
  const [trashPages, setTrashPages] = useState<PositionedPage[]>([])

  // 뷰 탭: note | list | trash
  const [view, setView] = useState<View>("note")

  // 노트에서 현재 펼침면 인덱스
  const [spread, setSpread] = useState(0)

  // 펼침면 개수(파생)
  const totalSpreads = useMemo(() => Math.max(1, Math.ceil(pages.length / 2)), [pages.length])

  // 페이지 수 변동 시 spread 범위 보정 (렌더 중 setState 방지)
  useEffect(() => {
    setSpread((s) => Math.min(s, totalSpreads - 1))
  }, [totalSpreads])

  // 현재 펼침면 좌/우 페이지
  const left = pages[spread * 2]
  const right = pages[spread * 2 + 1]

  // 공통 유틸: 특정 페이지 내용 업데이트(현재 위치에 따라 pages/loose/trash 중 해당하는 곳에서 반영)
  const updateContent = useCallback((pageId: string, content: string) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, content } : p)))
    setLoosePages((prev) => prev.map((pp) => (pp.page.id === pageId ? { ...pp, page: { ...pp.page, content } } : pp)))
    setTrashPages((prev) => prev.map((pp) => (pp.page.id === pageId ? { ...pp, page: { ...pp.page, content } } : pp)))
  }, [])

  // 찢기: 노트 → 페이지 리스트로 이동
  const tearPage = useCallback((pageId: string) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === pageId)
      if (idx === -1) return prev
      const page = prev[idx]
      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)]
      setLoosePages((loose) => [
        ...loose,
        {
          id: uid(),
          page,
          x: 40 + Math.random() * 120,
          y: 40 + Math.random() * 80,
        },
      ])
      return next
    })
  }, [])

  // 페이지 리스트 → 휴지통
  const discardFromList = useCallback((pid: string) => {
    setLoosePages((prev) => {
      const idx = prev.findIndex((p) => p.id === pid)
      if (idx === -1) return prev
      const item = prev[idx]
      setTrashPages((trash) => [...trash, { ...item, id: uid(), x: 60, y: 60 }])
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }, [])

  // 휴지통 완전 삭제
  const deleteForever = useCallback((pid: string) => {
    setTrashPages((prev) => prev.filter((p) => p.id !== pid))
  }, [])

  // 드래그 관련 훅
  const drag = useDrag()

  // 드래그 콜백 설정
  useEffect(() => {
    window.dragCallbacks = {
      updatePosition: (id: string, x: number, y: number) => {
        setLoosePages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
        setTrashPages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
      },
    }
    return () => {
      delete window.dragCallbacks
    }
  }, [])

  // 표시용: 페이지 번호
  const pageNumber = useCallback((p: Page | undefined) => (p ? pages.findIndex((x) => x.id === p.id) + 1 : 0), [pages])

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
