"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn, LogOut, Moon, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authAPI } from "../api"

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authAPI.isLoggedIn()) {
        try {
          const userData = await authAPI.getMe()
          setUser(userData)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          authAPI.logout()
          setIsLoggedIn(false)
          setUser(null)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkAuthStatus()
  }, [])

  const handleLogout = () => {
    authAPI.logout()
    setIsLoggedIn(false)
    setUser(null)
    router.push('/login')
  }

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
              {isLoggedIn && user?.avatar ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name || user.email} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ''} alt={user.name || user.email} />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name || '사용자'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Link>
              </DropdownMenuItem>
            )}
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
