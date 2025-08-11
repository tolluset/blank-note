import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Page } from "../types"

export function useNoteView(pages: Page[], initialSpreadParam?: string) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 펼침면 개수(파생)
  const totalSpreads = useMemo(() => Math.max(1, Math.ceil(pages.length / 2)), [pages.length])

  // 초기값 결정: props 우선, 없으면 localStorage
  const getInitialSpread = useCallback(() => {
    if (typeof window === 'undefined') return 0
    
    // props로 받은 초기 파라미터 확인
    if (initialSpreadParam) {
      const urlSpreadParam = Number(initialSpreadParam)
      if (urlSpreadParam > 0) {
        const urlSpread = Math.max(1, urlSpreadParam) - 1 // 0-based로 변환
        return Math.min(urlSpread, totalSpreads - 1)
      }
    }
    
    // localStorage에서 가져오기
    const stored = localStorage.getItem('noteSpread')
    const parsed = stored ? parseInt(stored, 10) : 0
    return Math.max(0, Math.min(parsed, totalSpreads - 1))
  }, [initialSpreadParam, totalSpreads])

  const [spread, setSpreadState] = useState(() => getInitialSpread())

  // spread 변경 시 URL과 localStorage 모두 업데이트
  const setSpread = useCallback((newSpread: number) => {
    const validSpread = Math.max(0, Math.min(newSpread, totalSpreads - 1))
    setSpreadState(validSpread)
    
    if (typeof window !== 'undefined') {
      // localStorage 업데이트
      localStorage.setItem('noteSpread', validSpread.toString())
      
      // URL 업데이트
      const params = new URLSearchParams(searchParams.toString())
      const displaySpread = validSpread + 1 // 1-based로 변환
      if (displaySpread === 1) {
        params.delete('spread')
      } else {
        params.set('spread', displaySpread.toString())
      }
      const queryString = params.toString()
      const newUrl = queryString ? `/?${queryString}` : '/'
      router.push(newUrl, { scroll: false })
    }
  }, [totalSpreads, router, searchParams])

  // URL 파라미터 변경 시 상태 동기화 (브라우저 뒤로가기/앞으로가기 대응)
  useEffect(() => {
    const urlSpreadParam = Number(searchParams.get('spread'))
    
    if (urlSpreadParam > 0) {
      // URL에 spread 파라미터가 있으면 그걸 사용
      const urlSpread = Math.max(1, urlSpreadParam) - 1
      const validSpread = Math.min(urlSpread, totalSpreads - 1)
      setSpreadState(validSpread)
      if (typeof window !== 'undefined') {
        localStorage.setItem('noteSpread', validSpread.toString())
      }
    } else if (!searchParams.has('spread')) {
      // URL에 spread 파라미터가 없으면 spread=0 (첫 페이지)으로 설정
      setSpreadState(0)
      if (typeof window !== 'undefined') {
        localStorage.setItem('noteSpread', '0')
      }
    }
  }, [searchParams, totalSpreads])

  // totalSpreads 변경 시 spread 범위 재조정
  useEffect(() => {
    if (spread >= totalSpreads) {
      setSpread(Math.max(0, totalSpreads - 1))
    }
  }, [totalSpreads, spread, setSpread])

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