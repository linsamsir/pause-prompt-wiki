"use client";

import { useLocale } from "@/lib/i18n/provider";

export function SubmitHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">{t.submit.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        {t.submit.subtitle}
      </p>
      <p className="mt-2 inline-block border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
        {t.submit.draftNotice}
      </p>
    </header>
  );
}
