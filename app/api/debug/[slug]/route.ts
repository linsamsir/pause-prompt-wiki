import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Temporary diagnostic route. Visit /api/debug/<some-slug> to inspect what the
// server sees vs what the DB stores. Delete this once the slug matching issue
// is resolved.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();

  const enc = new TextEncoder();
  const bytes = enc.encode(slug);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  const { data, error } = await supabase
    .from("prompts")
    .select("slug,title_zh,is_published,author_id")
    .eq("slug", slug)
    .maybeSingle();

  // Also try a wildcard ilike to see if the slug is "near" but not exact
  const fuzzy = await supabase
    .from("prompts")
    .select("slug,title_zh")
    .ilike("slug", "%" + slug.replace(/-[a-z0-9]{4}$/, "") + "%")
    .limit(3);

  return NextResponse.json({
    slug,
    slugCharLen: slug.length,
    slugByteLen: bytes.length,
    slugHex: hex,
    exact: { data, error: error?.message ?? null },
    fuzzyMatches: { data: fuzzy.data, error: fuzzy.error?.message ?? null },
  });
}
