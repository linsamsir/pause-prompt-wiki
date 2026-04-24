"use client";

import { useLocale } from "@/lib/i18n/provider";

export function ForgotHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-2xl">{t.forgot.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.forgot.subtitle}</p>
    </header>
  );
}
