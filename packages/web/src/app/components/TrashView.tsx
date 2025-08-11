import type React from "react"
import type { PositionedPage } from "../types"
import { EditableArea, FreePageCard, MovableHeader } from "./"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"

interface TrashViewProps {
  trashPages: PositionedPage[]
  onEdit: (pageId: string, content: string) => void
  onDeleteForever: (pid: string) => void
  onRestore?: (pid: string) => void
  onPointerDown: (id: string, getPos: (id: string) => { x: number; y: number } | undefined) => (e: React.PointerEvent) => void
}

export function TrashView({ trashPages, onEdit, onDeleteForever, onRestore, onPointerDown }: TrashViewProps) {
  const { t } = useLanguage()
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-end">
        <div className="text-xs text-neutral-500">{`${trashPages.length}${t("pages")}`}</div>
      </div>
      <div className="relative h-[560px] w-full overflow-auto rounded-lg border bg-neutral-50">
        <div className="absolute inset-0">
          {trashPages.map((pp) => (
            <FreePageCard
              key={pp.id}
              x={pp.x}
              y={pp.y}
              onPointerDown={onPointerDown(pp.id, (id) => {
                const page = trashPages.find((p) => p.id === id)
                return page ? { x: page.x, y: page.y } : undefined
              })}
            >
              <MovableHeader
                title={t("trash")}
              />
              <EditableArea
                value={pp.content}
                minHeightClass="min-h-[220px]"
                onChange={(v) => onEdit(pp.id, v)}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <div className="mt-2 flex justify-between gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onDeleteForever(pp.id)}
                >
                  {t("deleteForever")}
                </Button>

                {onRestore && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(pp.id)}
                  >
                    {t("restoreToList")}
                  </Button>
                )}

              </div>
            </FreePageCard>
          ))}
        </div>
      </div>
    </section>
  )
} 
