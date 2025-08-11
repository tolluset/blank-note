"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn, Moon, Sun, Languages, CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="mb-4 flex items-center justify-between">
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

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <LogIn className="mr-2 h-4 w-4" />
              로그인
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Moon className="mr-2 h-4 w-4" />
              다크 모드
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Languages className="mr-2 h-4 w-4" />
              언어 설정
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
