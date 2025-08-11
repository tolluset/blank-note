"use client"

import type React from "react"
import { ListView } from "../components"
import { usePages, useDrag } from "../hooks"

export default function ListPage() {
  // 페이지 관리 훅
  const {
    loosePages,
    updateContent,
    discardFromList,
    updatePagePosition,
  } = usePages()

  // 드래그 관련 훅
  const drag = useDrag(updatePagePosition)

  return (
    <ListView
      loosePages={loosePages}
      onEdit={updateContent}
      onDiscard={discardFromList}
      onPointerDown={drag.onPointerDown}
    />
  )
}
