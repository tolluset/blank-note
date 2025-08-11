import type React from "react"
import type { PositionedPage } from "../types"
import { EditableArea, FreePageCard, MovableHeader } from "./"
import { Button } from "@/components/ui/button"

interface ListViewProps {
  loosePages: PositionedPage[]
  onEdit: (pageId: string, content: string) => void
  onDiscard: (pid: string) => void
  onPointerDown: (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.PointerEvent) => void
}

export function ListView({ loosePages, onEdit, onDiscard, onPointerDown }: ListViewProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-end">
        <div className="text-xs text-neutral-500">{`${loosePages.length}장`}</div>
      </div>
      <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
        <div className="absolute inset-0">
          {loosePages.map((pp) => (
            <FreePageCard
              key={pp.id}
              x={pp.x}
              y={pp.y}
              onPointerDown={onPointerDown(pp.id, (id) => {
                const page = loosePages.find((p) => p.id === id)
                return page ? { x: page.x, y: page.y } : undefined
              })}
            >
              <MovableHeader
                title={"페이지"}
              />
              <EditableArea
                value={pp.content}
                onChange={(v) => onEdit(pp.id, v)}
                minHeightClass="min-h-[220px]"
                onPointerDown={(e) => e.stopPropagation()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDiscard(pp.id)}
                className="mt-2"
              >
                {"버리기"}
              </Button>
            </FreePageCard>
          ))}
        </div>
      </div>
    </section>
  )
} 
