import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { LikeButton, FavoriteButton } from "@/components/action-buttons";
import { Badge } from "@/components/ui/badge";
import type { PromptWithRelations } from "@/lib/supabase/types";
import {
  Back,
  Title,
  Desc,
  CategoryName,
  AuthorLabel,
  CategoryLabel,
  TagsLabel,
  ModelLabel,
  NegativeLabel,
  ParamsLabel,
  CreatedLabel,
  UsePrompt,
} from "./_parts";

export const dynamic = "force-dynamic";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("prompts")
    .select(
      "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle<PromptWithRelations>();

  if (!prompt) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialLiked = false;
  let initialFav = false;
  if (user) {
    const [{ data: likeRow }, { data: favRow }] = await Promise.all([
      supabase
        .from("likes")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .maybeSingle(),
      supabase
        .from("favorites")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .maybeSingle(),
    ]);
    initialLiked = !!likeRow;
    initialFav = !!favRow;
  }

  // Fire-and-forget view increment
  await supabase.rpc("increment_views", { p_id: prompt.id }).throwOnError().then(
    () => {},
    () => {},
  );

  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/wiki"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3" /> <Back />
      </Link>

      <header className="mt-4 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {prompt.category && (
            <Badge variant="outline">
              <CategoryName
                zh={prompt.category.name_zh}
                en={prompt.category.name_en}
              />
            </Badge>
          )}
          {prompt.is_nsfw && <Badge variant="nsfw">NSFW</Badge>}
          {prompt.model && <Badge variant="secondary">{prompt.model}</Badge>}
        </div>
        <h1 className="mt-3 font-serif-tc text-3xl font-semibold leading-tight md:text-4xl">
          <Title zh={prompt.title_zh} en={prompt.title_en} />
        </h1>
        {(prompt.description_zh || prompt.description_en) && (
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            <Desc
              zh={prompt.description_zh}
              en={prompt.description_en}
            />
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <LikeButton
            promptId={prompt.id}
            initialCount={prompt.likes_count}
            initialLiked={initialLiked}
          />
          <FavoriteButton
            promptId={prompt.id}
            initialCount={prompt.favorites_count}
            initialFavorited={initialFav}
          />
          <CopyButton text={prompt.body}>
            <UsePrompt />
          </CopyButton>
        </div>
      </header>

      <section className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <div>
            <h2 className="section-title text-sm">prompt</h2>
            <pre className="mt-2 washi-card p-4 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {prompt.body}
            </pre>
          </div>

          {prompt.negative && (
            <div>
              <h2 className="section-title text-sm">
                <NegativeLabel />
              </h2>
              <pre className="mt-2 washi-card p-4 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-muted-foreground">
                {prompt.negative}
              </pre>
            </div>
          )}

          {prompt.parameters && (
            <div>
              <h2 className="section-title text-sm">
                <ParamsLabel />
              </h2>
              <pre className="mt-2 washi-card p-4 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
                {prompt.parameters}
              </pre>
            </div>
          )}
        </div>

        <aside className="space-y-5 text-sm">
          <Meta label={<AuthorLabel />}>
            {prompt.author?.display_name ||
              prompt.author?.username ||
              "—"}
          </Meta>
          {prompt.category && (
            <Meta label={<CategoryLabel />}>
              <CategoryName
                zh={prompt.category.name_zh}
                en={prompt.category.name_en}
              />
            </Meta>
          )}
          {prompt.model && (
            <Meta label={<ModelLabel />}>{prompt.model}</Meta>
          )}
          {prompt.tags?.length ? (
            <Meta label={<TagsLabel />}>
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Meta>
          ) : null}
          <Meta label={<CreatedLabel />}>
            {new Date(prompt.created_at).toLocaleDateString()}
          </Meta>
        </aside>
      </section>
    </article>
  );
}

function Meta({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-serif-tc">{children}</div>
    </div>
  );
}
