import Link from "next/link";
import { ArrowRight, Shuffle, Sparkles, Trophy } from "lucide-react";
import {
  HeroTitle,
  HeroSubtitle,
  HeroCta,
  HeroCtaBuilder,
  RandomLabel,
  HotPrompts,
  HotPromptsSub,
  Categories,
  ViewAll,
  TotalPrompts,
  TotalUsers,
  TotalLikes,
  LeaderboardCta,
  LeaderboardSub,
  LeaderboardGo,
} from "./_parts/home-strings";
import { createClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompt-card";
import { Button } from "@/components/ui/button";
import type {
  Category,
  PromptWithRelations,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

async function loadData() {
  const supabase = await createClient();

  const [{ data: hot }, { data: cats }, { count: promptsCount }, { count: usersCount }] =
    await Promise.all([
      supabase
        .from("prompts")
        .select(
          "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
        )
        .eq("is_published", true)
        .order("likes_count", { ascending: false })
        .limit(6),
      supabase.from("categories").select("*").order("order", { ascending: true }),
      supabase
        .from("prompts")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

  const likesAgg = await supabase
    .from("prompts")
    .select("likes_count");
  const totalLikes =
    likesAgg.data?.reduce((s, r) => s + (r.likes_count ?? 0), 0) ?? 0;

  return {
    hot: (hot ?? []) as PromptWithRelations[],
    categories: (cats ?? []) as Category[],
    stats: {
      prompts: promptsCount ?? 0,
      users: usersCount ?? 0,
      likes: totalLikes,
    },
  };
}

export default async function HomePage() {
  const { hot, categories, stats } = await loadData();

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border bg-[linear-gradient(180deg,var(--background)_0%,#f3ecdd_100%)]">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="stamp">一時停止</span>
                <span className="stamp stamp-filled">Prompt Wiki</span>
              </div>
              <HeroTitle />
              <HeroSubtitle />
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/wiki">
                    <HeroCta /> <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/builder">
                    <Sparkles className="size-4" />
                    <HeroCtaBuilder />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/random">
                    <Shuffle className="size-4" />
                    <RandomLabel />
                  </Link>
                </Button>
              </div>
            </div>

            {/* 日系直書裝飾 */}
            <div
              className="hidden md:block text-muted-foreground font-serif-tc text-xs tracking-[0.5em]"
              style={{ writingMode: "vertical-rl" as const }}
            >
              一 期 一 會
              <span className="inline-block mx-2 text-primary">·</span>
              凝 視 一 個 Prompt 的 重 量
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border">
          <Stat label={<TotalPrompts />} value={stats.prompts} />
          <Stat label={<TotalUsers />} value={stats.users} />
          <Stat label={<TotalLikes />} value={stats.likes} />
        </div>
      </section>

      {/* Hot prompts */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title text-2xl">
              <HotPrompts />
            </h2>
            <p className="mt-2 pl-[0.9rem] text-sm text-muted-foreground">
              <HotPromptsSub />
            </p>
          </div>
          <Link
            href="/wiki?sort=likes"
            className="shrink-0 text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          >
            <ViewAll /> <ArrowRight className="size-3" />
          </Link>
        </div>

        {hot.length === 0 ? (
          <EmptyHint />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hot.map((p, i) => (
              <PromptCard key={p.id} prompt={p} rank={i + 1} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="section-title text-2xl">
              <Categories />
            </h2>
            <Link
              href="/wiki"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              <ViewAll /> <ArrowRight className="size-3" />
            </Link>
          </div>

          {categories.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/wiki?category=${c.slug}`}
                  className="washi-card flex flex-col items-center justify-center p-5 text-center"
                >
                  <span className="font-serif-tc text-base font-semibold">
                    {c.name_zh}
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.name_en}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard callout */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="washi-card flex flex-col items-start gap-3 p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="size-8 text-primary" />
            <div>
              <h3 className="font-serif-tc text-xl font-semibold">
                <LeaderboardCta />
              </h3>
              <p className="text-sm text-muted-foreground">
                <LeaderboardSub />
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/leaderboard">
              <LeaderboardGo /> <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: React.ReactNode; value: number }) {
  return (
    <div className="px-6 py-6 text-center md:py-8">
      <div className="font-serif-tc text-3xl font-semibold md:text-4xl">
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="washi-card p-8 text-center text-sm text-muted-foreground">
      尚無資料，請先執行 <code className="text-primary">supabase/seed.sql</code>。
    </div>
  );
}
