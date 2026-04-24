"use client";

import { useLocale } from "@/lib/i18n/provider";

export function RegisterHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-2xl">{t.register.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.register.subtitle}</p>
    </header>
  );
}
