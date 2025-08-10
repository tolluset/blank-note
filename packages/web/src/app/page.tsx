"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type Page = { id: string; content: string }
type PositionedPage = { id: string; page: Page; x: number; y: number }

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

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
  const [view, setView] = useState<"note" | "list" | "trash">("note")

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

  // 리스트/휴지통 내 드래그 이동 (헤더에서만 시작)
  const useDrag = () => {
    const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null)

    const onMouseDown =
      (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.MouseEvent) => {
        const pos = getPos(id)
        if (!pos) return
        dragging.current = {
          id,
          offX: e.clientX - pos.x,
          offY: e.clientY - pos.y,
        }
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
      }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const { id, offX, offY } = dragging.current
      const x = e.clientX - offX
      const y = e.clientY - offY
      setLoosePages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
      setTrashPages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
    }

    const onMouseUp = () => {
      dragging.current = null
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    return { onMouseDown }
  }

  const drag = useDrag()

  // 표시용: 페이지 번호
  const pageNumber = useCallback((p: Page | undefined) => (p ? pages.findIndex((x) => x.id === p.id) + 1 : 0), [pages])

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <header className="mb-4 flex items-center justify-between">
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
        <section className="group relative rounded-lg border bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                className="rounded border px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                onClick={() => setSpread((s) => Math.max(0, s - 1))}
                disabled={spread === 0}
                aria-label="이전 펼침면"
              >
                {"← 이전"}
              </button>
              <div className="text-xs text-neutral-500">{`${spread + 1} / ${totalSpreads}`}</div>
              <button
                className="rounded border px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                onClick={() => setSpread((s) => Math.min(totalSpreads - 1, s + 1))}
                disabled={spread >= totalSpreads - 1}
                aria-label="다음 펼침면"
              >
                {"다음 →"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <NotebookPage
              label={`#${left ? pageNumber(left) : "-"}`}
              page={left}
              onEdit={(val) => left && updateContent(left.id, val)}
              onTear={() => left && tearPage(left.id)}
            />
            <NotebookPage
              label={`#${right ? pageNumber(right) : "-"}`}
              page={right}
              onEdit={(val) => right && updateContent(right.id, val)}
              onTear={() => right && tearPage(right.id)}
            />
          </div>

        </section>
      )}

      {view === "list" && (
        <section className="space-y-2">
          <div className="flex items-center justify-end">
            <div className="text-xs text-neutral-500">{`${loosePages.length}장`}</div>
          </div>
          <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
            <div className="absolute inset-0">
              {loosePages.map((pp) => (
                <FreePageCard key={pp.id} x={pp.x} y={pp.y}>
                  <MovableHeader
                    title={"페이지"}
                    onMouseDown={drag.onMouseDown(pp.id, (id) => loosePages.find((p) => p.id === id))}
                  />
                  <EditableArea
                    value={pp.page.content}
                    onChange={(v) => updateContent(pp.page.id, v)}
                    minHeightClass="min-h-[220px]"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      className="rounded border bg-white px-2 py-1 text-xs hover:bg-neutral-100"
                      onClick={() => discardFromList(pp.id)}
                    >
                      {"버리기"}
                    </button>
                  </div>
                </FreePageCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "trash" && (
        <section className="space-y-2">
          <div className="flex items-center justify-end">
            <div className="text-xs text-neutral-500">{`${trashPages.length}장`}</div>
          </div>
          <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
            <div className="absolute inset-0">
              {trashPages.map((pp) => (
                <FreePageCard key={pp.id} x={pp.x} y={pp.y}>
                  <MovableHeader
                    title={"휴지통"}
                    onMouseDown={drag.onMouseDown(pp.id, (id) => trashPages.find((p) => p.id === id))}
                  />
                  <EditableArea
                    value={pp.page.content}
                    onChange={(v) => updateContent(pp.page.id, v)}
                    minHeightClass="min-h-[220px]"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => deleteForever(pp.id)}
                    >
                      {"완전삭제"}
                    </button>
                  </div>
                </FreePageCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={`rounded px-3 py-1 text-sm ${active ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function NotebookPage({
  label,
  page,
  onEdit,
  onTear,
}: {
  label: string
  page?: Page
  onEdit: (value: string) => void
  onTear: () => void
}) {
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
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

      <div className="rounded-md border" style={linedStyle as React.CSSProperties} aria-label="노트 페이지">
        {page ? (
          <textarea
            className="h-[280px] w-full resize-none bg-transparent p-2 outline-none"
            placeholder="여기에 직접 입력하세요..."
            value={page.content}
            onChange={(e) => onEdit(e.target.value)}
          />
        ) : (
          <div className="p-2 text-neutral-400">{"빈 페이지"}</div>
        )}
      </div>
    </div>
  )
}

function EditableArea({
  value,
  onChange,
  minHeightClass = "min-h-[200px]",
}: {
  value: string
  onChange: (v: string) => void
  minHeightClass?: string
}) {
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
    }),
    [],
  )
  return (
    <div className={`rounded-md border bg-white ${minHeightClass}`} style={linedStyle as React.CSSProperties}>
      <textarea
        className="h-full min-h-[inherit] w-full resize-none bg-transparent p-2 outline-none"
        placeholder="여기에 직접 입력하세요..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function FreePageCard({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute w-[320px] rounded-lg border bg-white p-2 shadow-sm"
      style={{ left: x, top: y }}
      aria-label="자유 배치 페이지"
    >
      {children}
    </div>
  )
}

function MovableHeader({ title, onMouseDown }: { title: string; onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div
        className="cursor-move select-none rounded px-1 text-xs text-neutral-500"
        onMouseDown={onMouseDown}
        aria-label="끌어서 이동"
        title="끌어서 이동"
      >
        {title}
      </div>
      <div className="text-[10px] text-neutral-400">{"드래그로 이동"}</div>
    </div>
  )
}
