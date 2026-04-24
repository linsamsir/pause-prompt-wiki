"use client";

import { useLocale } from "@/lib/i18n/provider";

export function HeroTitle() {
  const { t } = useLocale();
  return (
    <h1 className="font-serif-tc text-3xl font-semibold leading-[1.2] tracking-wide text-balance [word-break:keep-all] [overflow-wrap:break-word] sm:text-4xl md:text-5xl">
      {t.home.heroTitle}
    </h1>
  );
}

export function HeroSubtitle() {
  const { t } = useLocale();
  return (
    <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed text-balance [word-break:keep-all] md:text-lg">
      {t.home.heroSubtitle}
    </p>
  );
}

export function HeroCta() {
  const { t } = useLocale();
  return <span>{t.home.heroCta}</span>;
}

export function HeroCtaBuilder() {
  const { t } = useLocale();
  return <span>{t.home.heroCtaBuilder}</span>;
}

export function RandomLabel() {
  const { t } = useLocale();
  return <span>{t.home.heroCtaRandom}</span>;
}

export function HotPrompts() {
  const { t } = useLocale();
  return <span>{t.home.hotPrompts}</span>;
}

export function HotPromptsSub() {
  const { t } = useLocale();
  return (
    <span className="text-sm text-muted-foreground">{t.home.hotPromptsSub}</span>
  );
}

export function Categories() {
  const { t } = useLocale();
  return <span>{t.home.categories}</span>;
}

export function ViewAll() {
  const { locale } = useLocale();
  return <span>{locale === "zh" ? "全部" : "View all"}</span>;
}

export function TotalPrompts() {
  const { t } = useLocale();
  return <>{t.home.totalPrompts}</>;
}

export function TotalUsers() {
  const { t } = useLocale();
  return <>{t.home.totalUsers}</>;
}

export function TotalLikes() {
  const { t } = useLocale();
  return <>{t.home.totalLikes}</>;
}

export function LeaderboardCta() {
  const { t } = useLocale();
  return <>{t.home.leaderboardCta}</>;
}

export function LeaderboardSub() {
  const { t } = useLocale();
  return <>{t.home.leaderboardSub}</>;
}

export function LeaderboardGo() {
  const { t } = useLocale();
  return <span>{t.nav.leaderboard}</span>;
}
