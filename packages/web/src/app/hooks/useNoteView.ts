import { useCallback, useEffect, useMemo, useState } from "react"
import type { Page } from "../types"

export function useNoteView(pages: Page[]) {
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

  // 표시용: 페이지 번호
  const pageNumber = useCallback((p: Page | undefined) => (p ? pages.findIndex((x) => x.id === p.id) + 1 : 0), [pages])

  return {
    spread,
    totalSpreads,
    left,
    right,
    pageNumber,
    setSpread,
  }
} 