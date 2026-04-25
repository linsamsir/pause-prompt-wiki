"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { readAccessTokenFromCookie } from "@/lib/supabase/access-token";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/image-uploader";
import type { Category } from "@/lib/supabase/types";

export function SubmitForm({ categories }: { categories: Category[] }) {
  const { t, locale } = useLocale();
  const { user } = useSession();
  const router = useRouter();

  const [titleZh, setTitleZh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descZh, setDescZh] = useState("");
  const [descEn, setDescEn] = useState("");
  const [body, setBody] = useState("");
  const [negative, setNegative] = useState("");
  const [parameters, setParameters] = useState("");
  const [model, setModel] = useState("");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [slug, setSlug] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);

    // Slug fallback: slugify title_zh + short random suffix so collisions
    // between submissions with the same title don't blow up the unique index.
    const baseSlug = slug.trim() || slugify(titleZh);
    const finalSlug =
      baseSlug +
      "-" +
      Math.random().toString(36).slice(2, 6);

    const payload = {
      slug: finalSlug,
      title_zh: titleZh.trim(),
      title_en: titleEn.trim() || null,
      description_zh: descZh.trim() || null,
      description_en: descEn.trim() || null,
      body: body.trim(),
      negative: negative.trim() || null,
      parameters: parameters.trim() || null,
      model: model.trim() || null,
      tags:
        tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? [],
      category_id: categoryId || null,
      author_id: user.id,
      is_nsfw: isNsfw,
      is_published: false,
      images,
    };

    // Direct PostgREST insert. Read access token directly from cookies —
    // supabase.from().insert() and supabase.auth.getSession() have both
    // hung in this session before; cookie + fetch + AbortController is the
    // only path that has consistently resolved.
    let errMsg: string | null = null;
    try {
      const token = readAccessTokenFromCookie();
      if (!token) throw new Error("no active session (cookie read failed)");

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15_000);

      const res = await fetch(`${url}/rest/v1/prompts`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(tid);

      if (!res.ok) {
        const body: { message?: string; msg?: string; hint?: string } =
          await res.json().catch(() => ({}));
        errMsg =
          body.message || body.msg || body.hint || `HTTP ${res.status}`;
      }
    } catch (e) {
      errMsg =
        e instanceof DOMException && e.name === "AbortError"
          ? "timeout after 15s"
          : e instanceof Error
            ? e.message
            : String(e);
    }

    setSubmitting(false);
    if (errMsg) {
      setError(t.submit.error + errMsg);
      return;
    }

    setSuccessSlug(finalSlug);
    // clear form
    setTitleZh("");
    setTitleEn("");
    setDescZh("");
    setDescEn("");
    setBody("");
    setNegative("");
    setParameters("");
    setModel("");
    setTags("");
    setCategoryId("");
    setSlug("");
    setIsNsfw(false);
    setImages([]);
    router.refresh();
  }

  if (successSlug) {
    return (
      <div className="washi-card p-6 space-y-4">
        <p className="text-sm text-primary">{t.submit.success}</p>
        <div className="border border-border bg-secondary/40 p-3 text-xs">
          <span className="text-muted-foreground">URL:</span>{" "}
          <Link
            href={`/wiki/${successSlug}`}
            className="font-mono text-primary hover:underline break-all"
          >
            /wiki/{successSlug}
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/wiki/${successSlug}`}>{t.wiki.usePrompt}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profile">{t.account.profile}</Link>
          </Button>
          <Button variant="ghost" onClick={() => setSuccessSlug(null)}>
            {t.common.create}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="washi-card p-6 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="title_zh">{t.submit.fieldTitleZh}</Label>
        <Input
          id="title_zh"
          required
          maxLength={120}
          value={titleZh}
          onChange={(e) => setTitleZh(e.target.value)}
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="title_en">{t.submit.fieldTitleEn}</Label>
        <Input
          id="title_en"
          maxLength={120}
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="desc_zh">{t.submit.fieldDescZh}</Label>
        <Textarea
          id="desc_zh"
          rows={3}
          value={descZh}
          onChange={(e) => setDescZh(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="desc_en">{t.submit.fieldDescEn}</Label>
        <Textarea
          id="desc_en"
          rows={3}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="body">{t.submit.fieldBody}</Label>
        <Textarea
          id="body"
          required
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t.submit.fieldBodyHint}</p>
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="negative">{t.submit.fieldNegative}</Label>
        <Textarea
          id="negative"
          rows={2}
          value={negative}
          onChange={(e) => setNegative(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="parameters">{t.submit.fieldParameters}</Label>
        <Input
          id="parameters"
          value={parameters}
          onChange={(e) => setParameters(e.target.value)}
          placeholder="--ar 3:2 --cfg 7"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="model">{t.submit.fieldModel}</Label>
        <Input
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="tags">{t.submit.fieldTags}</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder={t.submit.fieldTagsHint}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">{t.submit.fieldCategory}</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-10 w-full border border-input bg-background px-3 text-sm"
        >
          <option value="">{t.submit.fieldCategoryNone}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "zh" ? c.name_zh : c.name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">{t.submit.fieldSlug}</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto"
        />
        <p className="text-xs text-muted-foreground">{t.submit.fieldSlugHint}</p>
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.uploader.label}</Label>
        <ImageUploader value={images} onChange={setImages} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
        <input
          type="checkbox"
          checked={isNsfw}
          onChange={(e) => setIsNsfw(e.target.checked)}
          className="size-4 accent-primary"
        />
        <span>
          {t.submit.fieldNsfw}
          <span className="ml-2 text-xs text-muted-foreground">
            {t.submit.fieldNsfwHint}
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}

      <div className="md:col-span-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {submitting ? t.submit.submitting : t.submit.cta}
        </Button>
      </div>
    </form>
  );
}
