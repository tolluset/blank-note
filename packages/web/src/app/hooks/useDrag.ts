import type React from "react"
import { useRef } from "react"

export function useDrag(updatePosition: (id: string, x: number, y: number) => void) {
  const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null)

  const onPointerDown =
    (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.PointerEvent) => {
      e.preventDefault()
      const pos = getPos(id)
      if (!pos) return
      dragging.current = {
        id,
        offX: e.clientX - pos.x,
        offY: e.clientY - pos.y,
      }
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp)
    }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging.current) return
    const { id, offX, offY } = dragging.current
    const x = e.clientX - offX
    const y = e.clientY - offY
    updatePosition(id, x, y)
  }

  const onPointerUp = () => {
    dragging.current = null
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
  }

  return { onPointerDown }
} 