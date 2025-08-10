import type React from "react"

interface FreePageCardProps {
  x: number
  y: number
  children: React.ReactNode
}

export function FreePageCard({ x, y, children }: FreePageCardProps) {
  return (
    <div
      className="absolute w-[320px] rounded-lg border bg-white p-2 shadow-sm"
      style={{ left: x, top: y }}
      aria-label="자유 배치 페이지"
    >
      {children}
    </div>
  )
} 