"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/i18n/provider";
import type { Category } from "@/lib/supabase/types";

export function WikiFilters({ categories }: { categories: Category[] }) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const [, start] = useTransition();

  const current = {
    q: search.get("q") ?? "",
    category: search.get("category") ?? "all",
    sort: search.get("sort") ?? "newest",
  };

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(search.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v === "all" || v === "") next.delete(k);
      else next.set(k, v);
    });
    start(() => router.push(`/wiki?${next.toString()}`));
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_180px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={current.q}
          placeholder={t.wiki.searchPlaceholder}
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update({ q: (e.target as HTMLInputElement).value });
            }
          }}
        />
      </div>

      <Select
        value={current.category}
        onValueChange={(v) => update({ category: v })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all}</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.slug}>
              {locale === "zh" ? c.name_zh : c.name_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={current.sort} onValueChange={(v) => update({ sort: v })}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t.common.newest}</SelectItem>
          <SelectItem value="likes">{t.common.mostLiked}</SelectItem>
          <SelectItem value="favorites">{t.common.mostFavorited}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
