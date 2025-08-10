import { useCallback, useEffect, useState, useRef } from "react"
import type { Page, PositionedPage } from "../types"
import { uid } from "../utils"
import { notesAPI } from "../api"

export function usePages() {
  // 노트북 내부 페이지(순서 유지)
  const [pages, setPages] = useState<Page[]>([])
  // 찢은 페이지(자유 배치)
  const [loosePages, setLoosePages] = useState<PositionedPage[]>([])
  // 휴지통(자유 배치)
  const [trashPages, setTrashPages] = useState<PositionedPage[]>([])
  const [loading, setLoading] = useState(true)

  // 데이터 초기 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        const [notesData, tornData, trashedData] = await Promise.all([
          notesAPI.getNotes(),
          notesAPI.getTornNotes(),
          notesAPI.getTrashedNotes(),
        ])

        setPages(notesData || [])
        setLoosePages(tornData || [])
        setTrashPages(trashedData || [])
      } catch (error) {
        console.error('Failed to load notes:', error)
        // 에러 시 기본 데이터로 초기화
        setPages([
          { id: uid(), content: "" },
          { id: uid(), content: "" },
          { id: uid(), content: "" },
          { id: uid(), content: "" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // debounce를 위한 ref
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // 공통 유틸: 특정 페이지 내용 업데이트(현재 위치에 따라 pages/loose/trash 중 해당하는 곳에서 반영)
  const updateContent = useCallback(async (pageId: string, content: string) => {
    // 로컬 상태 즉시 업데이트
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, content } : p)))
    setLoosePages((prev) => prev.map((pp) => (pp.id === pageId ? { ...pp, page: { ...pp.page, content } } : pp)))
    setTrashPages((prev) => prev.map((pp) => (pp.id === pageId ? { ...pp, page: { ...pp.page, content } } : pp)))

    // 기존 타이머 제거
    const existingTimer = debounceTimers.current.get(pageId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // 새로운 debounced 서버 업데이트
    const timer = setTimeout(async () => {
      try {
        await notesAPI.updateNote(pageId, { content })
      } catch (error) {
        console.error('Failed to update note:', error)
      } finally {
        debounceTimers.current.delete(pageId)
      }
    }, 500)

    debounceTimers.current.set(pageId, timer)
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
    loading,
    updateContent,
    tearPage,
    discardFromList,
    deleteForever,
    updatePagePosition,
  }
} 
