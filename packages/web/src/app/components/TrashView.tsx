import type React from "react"
import type { PositionedPage } from "../types"
import { EditableArea, FreePageCard, MovableHeader } from "./"
import { Button } from "@/components/ui/button"

interface TrashViewProps {
  trashPages: PositionedPage[]
  onEdit: (pageId: string, content: string) => void
  onDeleteForever: (pid: string) => void
  onMouseDown: (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.MouseEvent) => void
}

export function TrashView({ trashPages, onEdit, onDeleteForever, onMouseDown }: TrashViewProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-end">
        <div className="text-xs text-neutral-500">{`${trashPages.length}장`}</div>
      </div>
      <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
        <div className="absolute inset-0">
          {trashPages.map((pp) => (
            <FreePageCard key={pp.id} x={pp.x} y={pp.y}>
              <MovableHeader
                title={"휴지통"}
                onMouseDown={onMouseDown(pp.id, (id) => trashPages.find((p) => p.id === id))}
              />
              <EditableArea
                value={pp.content}
                onChange={(v) => onEdit(pp.id, v)}
                minHeightClass="min-h-[220px]"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteForever(pp.id)}
                >
                  {"완전삭제"}
                </Button>
              </div>
            </FreePageCard>
          ))}
        </div>
      </div>
    </section>
  )
} 
