"use client"

import type React from "react"
import { useMemo, useState } from "react"
import type { Page } from "../types"
import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      backgroundPosition: "0 12px",
      backgroundAttachment: "local"
    }),
    [],
  )

  if (isLoading) {
    return (
      <div className="relative rounded-lg border bg-white p-3 shadow-sm animate-pulse">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="rounded-md border h-[280px] bg-gray-50"></div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="relative rounded-lg border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-neutral-500">{label}</div>
        <Button
          variant="outline"
          onClick={onTear}
        >
          <Scissors />
          {t("tearPage")}
        </Button>
      </div>

      <div className="rounded-md border h-[280px]" aria-label={t("notePage")}>
        <textarea
          className="h-full w-full resize-none bg-transparent p-2 outline-none"
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

