import type React from "react"
import { useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "../contexts/LanguageContext"

interface EditableAreaProps {
  value: string
  onChange: (v: string) => void
  minHeightClass?: string
  onPointerDown?: (e: React.PointerEvent) => void
  variant?: 'notebook' | 'card'
}

export function EditableArea({ value, onChange, minHeightClass = "min-h-[200px]", onPointerDown, variant = 'card' }: EditableAreaProps) {
  const { t } = useLanguage()
  
  const linedStyle = useMemo(
    () => {
      if (variant === 'notebook') {
        return {
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
          backgroundPosition: "8px 12px",
          backgroundSize: "calc(100% - 16px) 100%",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "local"
        }
      } else {
        return {
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 24px)",
          backgroundPosition: "0px 12px",
          backgroundAttachment: "local"
        }
      }
    },
    [variant],
  )

  const containerClasses = `rounded-md border bg-background ${minHeightClass}`

  const textareaClasses = variant === 'notebook'
    ? "h-full w-full resize-none bg-transparent p-2 pt-1.5 outline-none border-0"
    : "h-full min-h-[inherit] w-full resize-none bg-transparent p-2 pt-1.5 outline-none border-0"

  const textareaStyle = { 
    lineHeight: '24px',
    ...linedStyle
  }
  
  return (
    <div className={containerClasses} onPointerDown={onPointerDown}>
      <Textarea
        className={textareaClasses}
        placeholder={t("writeHereDirectly")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={textareaStyle}
      />
    </div>
  )
} 
