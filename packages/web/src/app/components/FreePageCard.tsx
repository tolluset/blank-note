import type React from "react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "../contexts/LanguageContext"

interface FreePageCardProps {
  x: number
  y: number
  children: React.ReactNode
  onPointerDown?: (e: React.PointerEvent) => void
}

export function FreePageCard({ x, y, children, onPointerDown }: FreePageCardProps) {
  const { t } = useLanguage()
  return (
    <Card
      className="absolute w-[320px] p-2 cursor-move touch-none"
      style={{ left: x, top: y }}
      aria-label={t("freeFloatingPage")}
      onPointerDown={onPointerDown}
    >
      {children}
    </Card>
  )
} 
