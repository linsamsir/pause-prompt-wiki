"use client";

import Link from "next/link";
import { Heart, Star, Eye } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useNsfw } from "@/components/layout/nsfw-toggle";
import { formatNumber, truncate } from "@/lib/utils";
import type { PromptWithRelations } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";

export function PromptCard({
  prompt,
  rank,
}: {
  prompt: PromptWithRelations;
  rank?: number;
}) {
  const { locale, t } = useLocale();
  const [showNsfw] = useNsfw();

  const title =
    locale === "zh"
      ? prompt.title_zh
      : prompt.title_en || prompt.title_zh;
  const desc =
    (locale === "zh"
      ? prompt.description_zh
      : prompt.description_en || prompt.description_zh) ?? "";
  const catName = prompt.category
    ? locale === "zh"
      ? prompt.category.name_zh
      : prompt.category.name_en
    : null;

  const hide = prompt.is_nsfw && !showNsfw;

  return (
    <Link
      href={`/wiki/${prompt.slug}`}
      className="group washi-card block h-full focus:outline-none focus-visible:border-primary"
    >
      <article className="flex h-full flex-col p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {typeof rank === "number" && (
              <span className="font-serif-tc text-2xl leading-none text-primary">
                {String(rank).padStart(2, "0")}
              </span>
            )}
            {catName && (
              <Badge variant="outline" className="shrink-0">
                {catName}
              </Badge>
            )}
          </div>
          {prompt.is_nsfw && <Badge variant="nsfw">{t.common.nsfw}</Badge>}
        </header>

        <h3 className="mt-3 font-serif-tc text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {hide ? "— —" : title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {hide
            ? locale === "zh"
              ? "（NSFW 已隱藏，開啟右上角開關以顯示）"
              : "(NSFW hidden — toggle in top bar)"
            : truncate(desc || prompt.body, 88)}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5" /> {formatNumber(prompt.likes_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5" />{" "}
              {formatNumber(prompt.favorites_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" /> {formatNumber(prompt.views_count)}
            </span>
          </div>
          {prompt.author?.display_name && (
            <span className="truncate max-w-[40%]">
              @{prompt.author.display_name}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
