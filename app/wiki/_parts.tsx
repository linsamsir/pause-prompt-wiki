"use client";

import { useLocale } from "@/lib/i18n/provider";

export function WikiHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">{t.wiki.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        {t.wiki.subtitle}
      </p>
    </header>
  );
}

export function WikiEmpty() {
  const { t } = useLocale();
  return (
    <div className="washi-card p-10 text-center text-sm text-muted-foreground">
      {t.wiki.noResults}
    </div>
  );
}
