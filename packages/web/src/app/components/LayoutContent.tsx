"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./Navigation"
import { ReactNode } from "react"

interface LayoutContentProps {
  children: ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  
  // 로그인 페이지에서는 Navigation을 보여주지 않음
  const showNavigation = pathname !== '/login'
  
  if (!showNavigation) {
    return <>{children}</>
  }
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <Navigation />
      {children}
    </div>
  )
}