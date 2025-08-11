import type React from "react"
import { useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "../contexts/LanguageContext"

interface EditableAreaProps {
  value: string
  onChange: (v: string) => void
  minHeightClass?: string
  onPointerDown?: (e: React.PointerEvent) => void
}

export function EditableArea({ value, onChange, minHeightClass = "min-h-[200px]", onPointerDown }: EditableAreaProps) {
  const { t } = useLanguage()
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
    }),
    [],
  )
  return (
    <div className={`rounded-md ${minHeightClass} cursor-text`} style={linedStyle} onPointerDown={onPointerDown}>
      <Textarea
        className="h-full min-h-[inherit] w-full resize-none bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
        placeholder={t("writeHereDirectly")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
} 
