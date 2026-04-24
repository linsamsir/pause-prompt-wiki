"use client";

import { useLocale } from "@/lib/i18n/provider";

export function ResetHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-2xl">{t.reset.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.reset.subtitle}</p>
    </header>
  );
}
