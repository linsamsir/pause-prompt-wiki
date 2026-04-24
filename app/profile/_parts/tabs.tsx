"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/provider";
import { PromptCard } from "@/components/prompt-card";
import type { PromptWithRelations } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export function ProfileTabs({
  myPrompts,
  favorites,
}: {
  myPrompts: PromptWithRelations[];
  favorites: PromptWithRelations[];
}) {
  const { t } = useLocale();
  const [tab, setTab] = useState<"prompts" | "favorites">("prompts");

  const active = tab === "prompts" ? myPrompts : favorites;
  const emptyMsg =
    tab === "prompts" ? t.profile.emptyPrompts : t.profile.emptyFavorites;

  return (
    <section>
      <div className="inline-flex border border-border">
        <button
          type="button"
          onClick={() => setTab("prompts")}
          className={cn(
            "px-4 py-1.5 text-sm font-serif-tc tracking-wider",
            tab === "prompts"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {t.profile.tabPrompts}
          <span className="ml-1 text-[10px] opacity-70">
            ({myPrompts.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab("favorites")}
          className={cn(
            "px-4 py-1.5 text-sm font-serif-tc tracking-wider border-l border-border",
            tab === "favorites"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {t.profile.tabFavorites}
          <span className="ml-1 text-[10px] opacity-70">
            ({favorites.length})
          </span>
        </button>
      </div>

      <div className="mt-4">
        {active.length === 0 ? (
          <div className="washi-card p-6 text-center text-sm text-muted-foreground">
            {emptyMsg}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {active.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
