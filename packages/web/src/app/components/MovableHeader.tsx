import type React from "react"

interface MovableHeaderProps {
  title: string
  onMouseDown: (e: React.MouseEvent) => void
}

export function MovableHeader({ title, onMouseDown }: MovableHeaderProps) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div
        className="select-none rounded px-1 text-xs text-muted-foreground"
        onMouseDown={onMouseDown}
        aria-label="끌어서 이동"
        title="끌어서 이동"
      >
        {title}
      </div>
      <div className="text-[10px] text-muted-foreground/60">{"드래그로 이동"}</div>
    </div>
  )
} 
