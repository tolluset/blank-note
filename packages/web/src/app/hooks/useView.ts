import { useState } from "react"
import type { View } from "../types"

export function useView() {
  const [view, setView] = useState<View>("note")

  return {
    view,
    setView,
  }
} 