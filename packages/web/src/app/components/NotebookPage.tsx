"use client"

import type React from "react"
import { useMemo, useState } from "react"
import type { Page } from "../types"
import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "../contexts/LanguageContext"

interface NotebookPageProps {
  label: string
  page?: Page
  isLoading?: boolean
  onEdit: (value: string) => void
  onTear: () => void
}

export function NotebookPage({ label, page, isLoading, onEdit, onTear }: NotebookPageProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useLanguage();
  
  const linedStyle = useMemo(
    () => ({
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
      backgroundPosition: "8px 12px",
      backgroundSize: "calc(100% - 32px) 100%",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "local"
    }),
    [],
  )

  if (isLoading) {
    return (
      <div className="relative rounded-lg border bg-card p-3 shadow-sm animate-pulse">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-3 w-16 bg-muted rounded"></div>
          <div className="h-8 w-20 bg-muted rounded"></div>
        </div>
        <div className="rounded-md border h-[280px] bg-muted/50"></div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="relative rounded-lg border bg-card p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Button
          variant="outline"
          onClick={onTear}
        >
          <Scissors />
          {t("tearPage")}
        </Button>
      </div>

      <div className="h-[280px] rounded-md border bg-background" aria-label={t("notePage")}>
        <Textarea
          className="h-full w-full resize-none bg-transparent p-2 outline-none border-0"
          placeholder={isFocused ? t("writeHereDirectly") : ""}
          value={page.content}
          onChange={(e) => onEdit(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            lineHeight: '24px',
            ...linedStyle
          }}
        />
      </div>
    </div>
  )
}

