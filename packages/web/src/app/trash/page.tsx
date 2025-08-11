"use client"

import type React from "react"
import { TrashView } from "../components"
import { usePages, useDrag } from "../hooks"

export default function TrashPage() {
  // 페이지 관리 훅
  const {
    trashPages,
    updateContent,
    deleteForever,
    restoreToList,
    updatePagePosition,
  } = usePages()

  // 드래그 관련 훅
  const drag = useDrag(updatePagePosition)

  return (
    <TrashView
      trashPages={trashPages}
      onEdit={updateContent}
      onDeleteForever={deleteForever}
      onRestore={restoreToList}
      onPointerDown={drag.onPointerDown}
    />
  )
}
