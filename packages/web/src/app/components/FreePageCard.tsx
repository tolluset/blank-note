import type React from "react"
import { Card } from "@/components/ui/card"

interface FreePageCardProps {
  x: number
  y: number
  children: React.ReactNode
  onMouseDown?: (e: React.MouseEvent) => void
}

export function FreePageCard({ x, y, children, onMouseDown }: FreePageCardProps) {
  return (
    <Card
      className="absolute w-[320px] p-2"
      style={{ left: x, top: y }}
      aria-label="자유 배치 페이지"
      onMouseDown={onMouseDown}
    >
      {children}
    </Card>
  )
} 