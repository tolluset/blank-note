import type React from "react"
import { useRef } from "react"

export function useDrag(updatePosition: (id: string, x: number, y: number) => void) {
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
    updatePosition(id, x, y)
  }

  const onMouseUp = () => {
    dragging.current = null
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", onMouseUp)
  }

  return { onMouseDown }
} 