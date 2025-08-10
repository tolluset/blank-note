"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="mb-4 flex items-center justify-end">
      <Tabs value={pathname}>
        <TabsList>
          <Link href="/">
            <TabsTrigger value="/" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              노트
            </TabsTrigger>
          </Link>
          <Link href="/list">
            <TabsTrigger value="/list" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              리스트
            </TabsTrigger>
          </Link>
          <Link href="/trash">
            <TabsTrigger value="/trash" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              휴지통
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </header>
  )
}