import { createClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompt-card";
import { WikiFilters } from "@/components/wiki-filters";
import type { Category, PromptWithRelations } from "@/lib/supabase/types";
import { WikiHeader, WikiEmpty } from "./_parts";

export const dynamic = "force-dynamic";

type Search = { q?: string; category?: string; sort?: string };

export default async function WikiPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  let query = supabase
    .from("prompts")
    .select(
      "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
    )
    .eq("is_published", true);

  if (params.category && params.category !== "all") {
    const cat = categories?.find((c) => c.slug === params.category);
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (params.q) {
    const q = params.q.replace(/%/g, "");
    query = query.or(
      `title_zh.ilike.%${q}%,title_en.ilike.%${q}%,description_zh.ilike.%${q}%,description_en.ilike.%${q}%,body.ilike.%${q}%`,
    );
  }

  const sort = params.sort ?? "newest";
  if (sort === "likes") query = query.order("likes_count", { ascending: false });
  else if (sort === "favorites")
    query = query.order("favorites_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: prompts } = await query.limit(60);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <WikiHeader />

      <div className="mt-8">
        <WikiFilters categories={(categories ?? []) as Category[]} />
      </div>

      <div className="mt-8">
        {!prompts || prompts.length === 0 ? (
          <WikiEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(prompts as PromptWithRelations[]).map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
