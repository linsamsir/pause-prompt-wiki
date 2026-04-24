import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const [prompts, cats, elements, likes, favs, users] = await Promise.all([
    supabase.from("prompts").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("builder_elements").select("id", { count: "exact", head: true }),
    supabase.from("likes").select("user_id", { count: "exact", head: true }),
    supabase.from("favorites").select("user_id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Prompts", value: prompts.count ?? 0 },
    { label: "Categories", value: cats.count ?? 0 },
    { label: "Builder elements", value: elements.count ?? 0 },
    { label: "Likes", value: likes.count ?? 0 },
    { label: "Favorites", value: favs.count ?? 0 },
    { label: "Users", value: users.count ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="washi-card p-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.label}
          </div>
          <div className="mt-2 font-serif-tc text-3xl font-semibold">
            {s.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
