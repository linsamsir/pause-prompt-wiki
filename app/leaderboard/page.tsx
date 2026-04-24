import { createClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompt-card";
import type { PromptWithRelations } from "@/lib/supabase/types";
import { LeaderboardUI } from "./_parts";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ by?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const by = sp.by === "favorites" ? "favorites" : "likes";
  const column = by === "favorites" ? "favorites_count" : "likes_count";

  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select(
      "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
    )
    .eq("is_published", true)
    .order(column, { ascending: false })
    .limit(30);

  const prompts = (data ?? []) as PromptWithRelations[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <LeaderboardUI current={by} />

      <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((p, i) => (
          <li key={p.id}>
            <PromptCard prompt={p} rank={i + 1} />
          </li>
        ))}
      </ol>

      {prompts.length === 0 && (
        <div className="washi-card mt-8 p-10 text-center text-sm text-muted-foreground">
          尚無資料。
        </div>
      )}
    </div>
  );
}
