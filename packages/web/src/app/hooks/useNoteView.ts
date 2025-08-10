import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Page } from "../types"

export function useNoteView(pages: Page[]) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 펼침면 개수(파생)
  const totalSpreads = useMemo(() => Math.max(1, Math.ceil(pages.length / 2)), [pages.length])

  // URL에서 spread 값을 가져와서 범위 보정까지 한 번에 처리
  const urlSpreadParam = Number(searchParams.get('spread')) || 1
  const urlSpreadRaw = Math.max(1, urlSpreadParam) - 1 // 내부적으로는 0-based로 변환
  const urlSpread = Math.min(urlSpreadRaw, totalSpreads - 1) // 범위 보정
  
  const [spread, setSpreadState] = useState(urlSpread)

  // spread 변경 시 URL 업데이트
  const setSpread = useCallback((newSpread: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const displaySpread = newSpread + 1 // 1-based로 변환
    if (displaySpread === 1) {
      params.delete('spread')
    } else {
      params.set('spread', displaySpread.toString())
    }
    const queryString = params.toString()
    const newUrl = queryString ? `/?${queryString}` : '/'
    router.push(newUrl, { scroll: false })
    setSpreadState(newSpread)
  }, [router, searchParams])

  // URL 변경 시 내부 상태 동기화
  useEffect(() => {
    setSpreadState(urlSpread)
  }, [urlSpread])

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