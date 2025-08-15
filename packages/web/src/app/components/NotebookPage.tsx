"use client"

import type React from "react"
import type { Page } from "../types"
import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"
import { EditableArea } from "./EditableArea"

interface NotebookPageProps {
  label: string
  page?: Page
  isLoading?: boolean
  onEdit: (value: string) => void
  onTear: () => void
}

export function NotebookPage({ label, page, isLoading, onEdit, onTear }: NotebookPageProps) {
  const { t } = useLanguage();

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

      <EditableArea
        value={page.content}
        onChange={onEdit}
        minHeightClass="h-[280px]"
        variant="notebook"
      />
    </div>
  )
}

