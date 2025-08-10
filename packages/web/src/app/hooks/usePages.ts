import { useCallback, useMemo, useState } from "react"
import type { Page, PositionedPage } from "../types"
import { uid } from "../utils"

export function usePages() {
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

  // 페이지 위치 업데이트 (드래그용)
  const updatePagePosition = useCallback((id: string, x: number, y: number) => {
    setLoosePages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
    setTrashPages((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
  }, [])

  return {
    pages,
    loosePages,
    trashPages,
    updateContent,
    tearPage,
    discardFromList,
    deleteForever,
    updatePagePosition,
  }
} 