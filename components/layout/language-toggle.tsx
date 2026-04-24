"use client";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={cn(
        "inline-flex border border-border text-[11px] tracking-[0.2em] uppercase",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("zh")}
        aria-pressed={locale === "zh"}
        className={cn(
          "px-2 py-1 font-serif-tc",
          locale === "zh"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground",
        )}
      >
        繁
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "px-2 py-1 border-l border-border",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
    </div>
  );
}
