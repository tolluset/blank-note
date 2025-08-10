import type React from "react"

interface TabButtonProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`rounded px-3 py-1 text-sm ${active ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
} 