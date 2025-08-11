import type React from "react"
import { Card } from "@/components/ui/card"

interface FreePageCardProps {
  x: number
  y: number
  children: React.ReactNode
  onPointerDown?: (e: React.PointerEvent) => void
}

export function FreePageCard({ x, y, children, onPointerDown }: FreePageCardProps) {
  return (
    <Card
      className="absolute w-[320px] p-2 cursor-move touch-none"
      style={{ left: x, top: y }}
      aria-label="자유 배치 페이지"
      onPointerDown={onPointerDown}
    >
      {children}
    </Card>
  )
} 
