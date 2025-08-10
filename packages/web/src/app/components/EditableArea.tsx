import type React from "react"
import { useMemo } from "react"

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
    <div className={`rounded-md border bg-white ${minHeightClass}`} style={linedStyle as React.CSSProperties}>
      <textarea
        className="h-full min-h-[inherit] w-full resize-none bg-transparent p-2 outline-none"
        placeholder="여기에 직접 입력하세요..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
} 