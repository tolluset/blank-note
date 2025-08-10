import type { Page, PositionedPage } from "../types"
import { uid } from "../utils"

const STORAGE_KEYS = {
  NOTES: 'blank-note-pages',
  TORN_NOTES: 'blank-note-loose-pages',
  TRASHED_NOTES: 'blank-note-trash-pages',
}

export const localStorageAPI = {
  // 기본 노트 페이지들 가져오기
  getNotes(): Page[] {
    if (typeof window === 'undefined') return []

    const stored = localStorage.getItem(STORAGE_KEYS.NOTES)
    if (!stored) {
      // 기본 데이터로 초기화
      const defaultPages = Array.from({ length: 100 }, () => ({ id: uid(), content: "" }));

      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(defaultPages))
      return defaultPages
    }

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  },

  // 찢은 페이지들 가져오기
  getTornNotes(): PositionedPage[] {
    if (typeof window === 'undefined') return []

    const stored = localStorage.getItem(STORAGE_KEYS.TORN_NOTES)
    if (!stored) return []

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  },

  // 휴지통 페이지들 가져오기
  getTrashedNotes(): PositionedPage[] {
    if (typeof window === 'undefined') return []

    const stored = localStorage.getItem(STORAGE_KEYS.TRASHED_NOTES)
    if (!stored) return []

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  },

  // 노트 내용 업데이트
  updateNote(pageId: string, content: string) {
    if (typeof window === 'undefined') return

    // 기본 노트에서 찾아서 업데이트
    const notes = this.getNotes()
    const noteIndex = notes.findIndex(n => n.id === pageId)
    if (noteIndex !== -1) {
      notes[noteIndex].content = content
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
      return
    }

    // 찢은 페이지에서 찾아서 업데이트
    const tornNotes = this.getTornNotes()
    const tornIndex = tornNotes.findIndex(n => n.id === pageId)
    if (tornIndex !== -1) {
      tornNotes[tornIndex].page.content = content
      localStorage.setItem(STORAGE_KEYS.TORN_NOTES, JSON.stringify(tornNotes))
      return
    }

    // 휴지통에서 찾아서 업데이트
    const trashedNotes = this.getTrashedNotes()
    const trashedIndex = trashedNotes.findIndex(n => n.id === pageId)
    if (trashedIndex !== -1) {
      trashedNotes[trashedIndex].page.content = content
      localStorage.setItem(STORAGE_KEYS.TRASHED_NOTES, JSON.stringify(trashedNotes))
    }
  },

  // 데이터 저장 (전체 덮어쓰기)
  saveNotes(pages: Page[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(pages))
  },

  saveTornNotes(pages: PositionedPage[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.TORN_NOTES, JSON.stringify(pages))
  },

  saveTrashedNotes(pages: PositionedPage[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.TRASHED_NOTES, JSON.stringify(pages))
  },
}
