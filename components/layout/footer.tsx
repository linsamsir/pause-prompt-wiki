"use client";

import { Coffee } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/provider";

export function Footer() {
  const { locale, t } = useLocale();
  return (
    <footer className="mt-16 border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="font-serif-tc text-lg tracking-wide">
            {SITE.nameJa} <span className="text-muted-foreground">·</span>{" "}
            <span className="text-muted-foreground">{SITE.nameEn}</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            {locale === "zh"
              ? "一期一會的 AI 提示詞資料庫。收錄、組裝、再創造。"
              : "An ever-curated library of AI prompts — gather, assemble, remix."}
          </p>
          <a
            href={SITE.kofi}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-max items-center gap-2 border border-primary px-3 py-1.5 text-xs tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Coffee className="size-3.5" />
            <span className="font-serif-tc">{t.common.supportUs}</span>
          </a>
        </div>
        <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground md:items-end">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary uppercase tracking-widest"
          >
            GitHub ↗
          </a>
          <span>© {new Date().getFullYear()} {SITE.name}</span>
        </div>
      </div>
    </footer>
  );
}
