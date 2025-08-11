"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogIn, LogOut, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { LoginModal } from "./LoginModal";

export function Navigation() {
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading, imageLoaded, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // 아바타 렌더링 최적화를 위한 메모이제이션
  const avatarContent = useMemo(() => {
    if (isLoading) {
      return <User />;
    }

    if (isLoggedIn && user?.avatar && imageLoaded) {
      return (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar} alt={user.name || user.email} />
          <AvatarFallback>
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      );
    }

    if (isLoggedIn && user && !user.avatar) {
      return (
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      );
    }

    return <User />;
  }, [isLoading, isLoggedIn, user, imageLoaded]);

  return (
    <header className="mb-4 flex items-center justify-between">
      <Tabs value={pathname}>
        <TabsList>
          <Link href="/">
            <TabsTrigger
              value="/"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {t("notes")}
            </TabsTrigger>
          </Link>
          <Link href="/list">
            <TabsTrigger
              value="/list"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {t("list")}
            </TabsTrigger>
          </Link>
          <Link href="/trash">
            <TabsTrigger
              value="/trash"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {t("trash")}
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
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name || user.email}
                      />
                    ) : null}
                    <AvatarFallback>
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.name || t("user")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                {t("login")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem>
                  <Languages className="mr-2 h-4 w-4" />
                  {t("language")}
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-accent" : ""}
                >
                  {t("english")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ko")}
                  className={language === "ko" ? "bg-accent" : ""}
                >
                  {t("korean")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ja")}
                  className={language === "ja" ? "bg-accent" : ""}
                >
                  {t("japanese")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
