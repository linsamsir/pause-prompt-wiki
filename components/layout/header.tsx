"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./language-toggle";
import { NsfwToggle } from "./nsfw-toggle";
import { UserMenu } from "./user-menu";
import { SITE } from "@/lib/constants";
import { useSession } from "@/components/auth/session-provider";

export function Header() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { user } = useSession();

  const nav = [
    { href: "/wiki", label: t.nav.wiki },
    { href: "/builder", label: t.nav.builder },
    { href: "/random", label: t.nav.random },
    { href: "/leaderboard", label: t.nav.leaderboard },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-serif-tc text-xl font-semibold tracking-wide">
            一時停止
          </span>
          <span className="hidden sm:inline text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {SITE.nameEn}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-serif-tc tracking-wider">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "hover:text-primary transition-colors",
                pathname.startsWith(n.href)
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <NsfwToggle />
          <LanguageToggle />
          <a
            href={SITE.kofi}
            target="_blank"
            rel="noreferrer"
            title={t.common.supportUs}
            aria-label={t.common.supportUs}
            className="inline-flex size-7 items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <Coffee className="size-3.5" />
          </a>
          <UserMenu />
        </div>
      </div>
      <div className="md:hidden border-t border-border">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-6 py-2 text-xs font-serif-tc tracking-wider">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "shrink-0 hover:text-primary",
                pathname.startsWith(n.href)
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
          {!user && (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/")}`}
              className="shrink-0 ml-auto text-primary"
            >
              {t.nav.login}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
