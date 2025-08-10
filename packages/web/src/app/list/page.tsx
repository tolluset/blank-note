"use client"

import type React from "react"
import { ListView, Navigation } from "../components"
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
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <Navigation />
      
      <ListView
        loosePages={loosePages}
        onEdit={updateContent}
        onDiscard={discardFromList}
        onMouseDown={drag.onMouseDown}
      />
    </main>
  )
}