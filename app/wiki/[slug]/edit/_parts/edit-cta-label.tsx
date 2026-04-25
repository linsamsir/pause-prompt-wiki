"use client";

import { useLocale } from "@/lib/i18n/provider";

export function EditCta() {
  const { t } = useLocale();
  return <>{t.edit.cta}</>;
}
