import type React from "react"
import { Card } from "@/components/ui/card"

interface FreePageCardProps {
  x: number
  y: number
  children: React.ReactNode
}

export function FreePageCard({ x, y, children }: FreePageCardProps) {
  return (
    <Card
      className="absolute w-[320px] p-2"
      style={{ left: x, top: y }}
      aria-label="자유 배치 페이지"
    >
      {children}
    </Card>
  )
} 