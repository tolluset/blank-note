import type React from "react"
import { useRef } from "react"

export function useDrag() {
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
    // 이 함수들은 외부에서 주입받아야 하므로 콜백으로 처리
    if (window.dragCallbacks) {
      window.dragCallbacks.updatePosition(id, x, y)
    }
  }

  const onMouseUp = () => {
    dragging.current = null
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", onMouseUp)
  }

  return { onMouseDown }
}

// 전역 타입 확장
declare global {
  interface Window {
    dragCallbacks?: {
      updatePosition: (id: string, x: number, y: number) => void
    }
  }
} 