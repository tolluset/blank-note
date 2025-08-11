"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "../contexts/AuthContext"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn, isLoading, imageLoaded, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // 아바타 렌더링 최적화를 위한 메모이제이션
  const avatarContent = useMemo(() => {
    if (isLoading) {
      return <User />
    }

    if (isLoggedIn && user?.avatar && imageLoaded) {
      return (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar} alt={user.name || user.email} />
          <AvatarFallback>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    }

    if (isLoggedIn && user && !user.avatar) {
      return (
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    }

    return <User />
  }, [isLoading, isLoggedIn, user, imageLoaded])

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
              {avatarContent}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    {user.avatar && imageLoaded ? (
                      <AvatarImage src={user.avatar} alt={user.name || user.email} />
                    ) : null}
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
            {/* @TODO: dark-mode, intl settings */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem> */}
            {/*   <Moon className="mr-2 h-4 w-4" /> */}
            {/*   다크 모드 */}
            {/* </DropdownMenuItem> */}
            {/* <DropdownMenuItem> */}
            {/*   <Languages className="mr-2 h-4 w-4" /> */}
            {/*   언어 설정 */}
            {/* </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
