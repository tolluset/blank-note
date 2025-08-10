import type React from "react"
import { useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"

interface EditableAreaProps {
  value: string
  onChange: (v: string) => void
  minHeightClass?: string
}

export function EditableArea({ value, onChange, minHeightClass = "min-h-[200px]" }: EditableAreaProps) {
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
    }),
    [],
  )
  return (
    <div className={`rounded-md ${minHeightClass}`} style={linedStyle as React.CSSProperties}>
      <Textarea
        className="h-full min-h-[inherit] w-full resize-none bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
        placeholder="여기에 직접 입력하세요..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
} 