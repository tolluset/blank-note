import type React from "react";
import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "../contexts/LanguageContext";

interface EditableAreaProps {
  value: string;
  onChange: (v: string) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
}

export function EditableArea({
  value,
  onChange,
  onPointerDown,
}: EditableAreaProps) {
  const { t } = useLanguage();

  const linedStyle = useMemo(() => {
    return {
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 23px, var(--line-color) 24px)",
      backgroundPosition: "8px 12px",
      backgroundSize: "calc(100% - 16px) 100%",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "local",
    };
  }, []);

  return (
    <div
      className={"rounded-md border bg-background h-70"}
      onPointerDown={onPointerDown}
    >
      <Textarea
        className="scrollbar h-full w-full resize-none bg-transparent p-2 pt-1.5 outline-none border-0"
        placeholder={t("writeHereDirectly")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={linedStyle}
      />
    </div>
  );
}
