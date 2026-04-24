"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LeaderboardUI({ current }: { current: "likes" | "favorites" }) {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">
        {t.leaderboard.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        {t.leaderboard.subtitle}
      </p>

      <div className="mt-6 inline-flex border border-border">
        <Link
          href="/leaderboard?by=likes"
          className={cn(
            "px-4 py-1.5 text-sm tracking-wider font-serif-tc",
            current === "likes"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {t.leaderboard.byLikes}
        </Link>
        <Link
          href="/leaderboard?by=favorites"
          className={cn(
            "border-l border-border px-4 py-1.5 text-sm tracking-wider font-serif-tc",
            current === "favorites"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {t.leaderboard.byFavorites}
        </Link>
      </div>
    </header>
  );
}
