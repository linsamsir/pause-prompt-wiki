"use client";

import { useLocale } from "@/lib/i18n/provider";

export function Back() {
  const { t } = useLocale();
  return <>{t.common.back}</>;
}

export function Title({ zh, en }: { zh: string; en: string | null }) {
  const { locale } = useLocale();
  return <>{locale === "zh" ? zh : en || zh}</>;
}

export function Desc({ zh, en }: { zh: string | null; en: string | null }) {
  const { locale } = useLocale();
  return <>{locale === "zh" ? zh : en || zh}</>;
}

export function CategoryName({ zh, en }: { zh: string; en: string }) {
  const { locale } = useLocale();
  return <>{locale === "zh" ? zh : en}</>;
}

export function AuthorLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailAuthor}</>;
}

export function CategoryLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailCategory}</>;
}

export function TagsLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailTags}</>;
}

export function ModelLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailModel}</>;
}

export function NegativeLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailNegative}</>;
}

export function ParamsLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailParameters}</>;
}

export function CreatedLabel() {
  const { t } = useLocale();
  return <>{t.wiki.detailCreated}</>;
}

export function UsePrompt() {
  const { t } = useLocale();
  return <>{t.wiki.usePrompt}</>;
}
