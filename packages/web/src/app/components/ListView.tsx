import type React from "react"
import type { PositionedPage } from "../types"
import { EditableArea, FreePageCard, MovableHeader } from "./"
import { Button } from "@/components/ui/button"

interface ListViewProps {
  loosePages: PositionedPage[]
  onEdit: (pageId: string, content: string) => void
  onDiscard: (pid: string) => void
  onMouseDown: (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.MouseEvent) => void
}

export function ListView({ loosePages, onEdit, onDiscard, onMouseDown }: ListViewProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-end">
        <div className="text-xs text-neutral-500">{`${loosePages.length}장`}</div>
      </div>
      <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
        <div className="absolute inset-0">
          {loosePages.map((pp) => (
            <FreePageCard key={pp.id} x={pp.x} y={pp.y}>
              <MovableHeader
                title={"페이지"}
                onMouseDown={onMouseDown(pp.id, (id) => loosePages.find((p) => p.id === id))}
              />
              <EditableArea
                value={pp.page.content}
                onChange={(v) => onEdit(pp.page.id, v)}
                minHeightClass="min-h-[220px]"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDiscard(pp.id)}
                >
                  {"버리기"}
                </Button>
              </div>
            </FreePageCard>
          ))}
        </div>
      </div>
    </section>
  )
} 