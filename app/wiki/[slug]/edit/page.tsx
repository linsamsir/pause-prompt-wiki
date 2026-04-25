import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Prompt } from "@/lib/supabase/types";
import { EditForm } from "./_parts/edit-form";
import { EditHeader } from "./_parts/header";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit prompt" };

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  // Page dynamic params are not URL-decoded by Next.js 16 for non-ASCII
  // segments (route handlers decode, pages do not). Decode defensively.
  const slug = safeDecode(rawSlug);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/wiki/${slug}/edit`)}`,
    );
  }

  const [{ data: prompt }, { data: profile }, { data: categories }] =
    await Promise.all([
      supabase
        .from("prompts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle<Prompt>(),
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle<{ is_admin: boolean }>(),
      supabase
        .from("categories")
        .select("*")
        .order("order", { ascending: true }),
    ]);

  if (!prompt) notFound();

  const isAdmin = !!profile?.is_admin;
  const canEdit = prompt.author_id === user.id || isAdmin;
  if (!canEdit) redirect(`/wiki/${slug}`);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <EditHeader />
      <div className="mt-6">
        <EditForm
          prompt={prompt}
          categories={(categories ?? []) as Category[]}
          canTogglePublish={isAdmin}
        />
      </div>
    </div>
  );
}
