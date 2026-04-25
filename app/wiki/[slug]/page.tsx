import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { LikeButton, FavoriteButton } from "@/components/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditCta } from "./edit/_parts/edit-cta-label";
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

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  // Next.js 16 page dynamic params arrive URL-encoded for non-ASCII
  // characters (verified empirically — route handlers decode, pages do not).
  // Decode defensively so DB queries see the same UTF-8 we stored.
  const slug = safeDecode(rawSlug);
  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("prompts")
    .select(
      "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
    )
    .eq("slug", slug)
    // No is_published filter — RLS handles visibility (public sees only
    // published; authors see their own drafts; admins see all).
    .maybeSingle<PromptWithRelations>();

  if (!prompt) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialLiked = false;
  let initialFav = false;
  let canEdit = false;
  if (user) {
    const [{ data: likeRow }, { data: favRow }, { data: profile }] =
      await Promise.all([
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
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .maybeSingle<{ is_admin: boolean }>(),
      ]);
    canEdit = prompt.author_id === user.id || !!profile?.is_admin;
    initialLiked = !!likeRow;
    initialFav = !!favRow;
  }

  // Fire-and-forget view increment — never block or fail the page on this.
  try {
    await supabase.rpc("increment_views", { p_id: prompt.id });
  } catch {
    /* noop */
  }

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
          {!prompt.is_published && <Badge variant="muted">Draft</Badge>}
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
          {canEdit && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/wiki/${prompt.slug}/edit`}>
                <Pencil className="size-4" /> <EditCta />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {prompt.images && prompt.images.length > 0 && (
        <section className="mt-8">
          <div
            className={
              prompt.images.length === 1
                ? "grid grid-cols-1"
                : prompt.images.length === 2
                  ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                  : "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            }
          >
            {prompt.images.map((src, i) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="block border border-border bg-muted overflow-hidden hover:border-primary transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${prompt.title_zh} ${i + 1}`}
                  loading="lazy"
                  className="block w-full h-auto object-cover"
                />
              </a>
            ))}
          </div>
        </section>
      )}

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
