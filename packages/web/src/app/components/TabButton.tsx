import type React from "react"
import { Button } from "@/components/ui/button"

interface TabButtonProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className="rounded px-3 py-1 text-sm"
    >
      {children}
    </Button>
  )
} 