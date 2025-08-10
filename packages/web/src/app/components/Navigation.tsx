"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TabButton } from "./TabButton"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="mb-4 flex items-center justify-end">
      <div className="flex gap-1 rounded-lg border p-1">
        <Link href="/">
          <TabButton active={pathname === "/"}>
            노트
          </TabButton>
        </Link>
        <Link href="/list">
          <TabButton active={pathname === "/list"}>
            리스트
          </TabButton>
        </Link>
        <Link href="/trash">
          <TabButton active={pathname === "/trash"}>
            휴지통
          </TabButton>
        </Link>
      </div>
    </header>
  )
}