"use client";

import { useLocale } from "@/lib/i18n/provider";

export function EditHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">{t.edit.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        {t.edit.subtitle}
      </p>
    </header>
  );
}
