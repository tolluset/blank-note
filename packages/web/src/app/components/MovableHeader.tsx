import type React from "react"
import { useLanguage } from "../contexts/LanguageContext"

interface MovableHeaderProps {
  title: string
  onPointerDown?: (e: React.PointerEvent) => void
}

export function MovableHeader({ title, onPointerDown }: MovableHeaderProps) {
  const { t } = useLanguage()
  return (
    <div className="mb-2 flex items-center justify-between">
      <div
        className="select-none rounded px-1 text-xs text-muted-foreground"
        onPointerDown={onPointerDown}
        aria-label={t("dragToMove")}
        title={t("dragToMove")}
      >
        {title}
      </div>
      <div className="text-[10px] text-muted-foreground/60">{t("dragToMove")}</div>
    </div>
  )
} 
