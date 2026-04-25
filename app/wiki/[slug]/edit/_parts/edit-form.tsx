"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { readAccessTokenFromCookie } from "@/lib/supabase/access-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/image-uploader";
import type { Category, Prompt } from "@/lib/supabase/types";

export function EditForm({
  prompt,
  categories,
  canTogglePublish,
}: {
  prompt: Prompt;
  categories: Category[];
  canTogglePublish: boolean;
}) {
  const { t, locale } = useLocale();
  const router = useRouter();

  const [titleZh, setTitleZh] = useState(prompt.title_zh);
  const [titleEn, setTitleEn] = useState(prompt.title_en ?? "");
  const [descZh, setDescZh] = useState(prompt.description_zh ?? "");
  const [descEn, setDescEn] = useState(prompt.description_en ?? "");
  const [body, setBody] = useState(prompt.body);
  const [negative, setNegative] = useState(prompt.negative ?? "");
  const [parameters, setParameters] = useState(prompt.parameters ?? "");
  const [model, setModel] = useState(prompt.model ?? "");
  const [tags, setTags] = useState((prompt.tags ?? []).join(", "));
  const [categoryId, setCategoryId] = useState(prompt.category_id ?? "");
  const [isNsfw, setIsNsfw] = useState(prompt.is_nsfw);
  const [isPublished, setIsPublished] = useState(prompt.is_published);
  const [images, setImages] = useState<string[]>(prompt.images ?? []);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function buildPayload() {
    const payload: Record<string, unknown> = {
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
      is_nsfw: isNsfw,
      images,
    };
    if (canTogglePublish) payload.is_published = isPublished;
    return payload;
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const token = readAccessTokenFromCookie();
      if (!token) throw new Error("no active session");

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15_000);

      const res = await fetch(
        `${url}/rest/v1/prompts?id=eq.${prompt.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(buildPayload()),
          signal: controller.signal,
        },
      );
      clearTimeout(tid);

      if (!res.ok) {
        const body: { message?: string; msg?: string; hint?: string } =
          await res.json().catch(() => ({}));
        throw new Error(
          body.message || body.msg || body.hint || `HTTP ${res.status}`,
        );
      }

      setSaving(false);
      setSavedAt(Date.now());
      router.refresh();
    } catch (e) {
      setSaving(false);
      const msg =
        e instanceof DOMException && e.name === "AbortError"
          ? "timeout after 15s"
          : e instanceof Error
            ? e.message
            : String(e);
      setError(t.edit.error + msg);
    }
  }

  async function onDelete() {
    if (!confirm(t.edit.deleteConfirm)) return;
    setError(null);
    setDeleting(true);

    try {
      const token = readAccessTokenFromCookie();
      if (!token) throw new Error("no active session");

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15_000);

      const res = await fetch(
        `${url}/rest/v1/prompts?id=eq.${prompt.id}`,
        {
          method: "DELETE",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );
      clearTimeout(tid);

      if (!res.ok) {
        const body: { message?: string; msg?: string } = await res
          .json()
          .catch(() => ({}));
        throw new Error(body.message || body.msg || `HTTP ${res.status}`);
      }

      router.replace("/profile");
      router.refresh();
    } catch (e) {
      setDeleting(false);
      const msg =
        e instanceof DOMException && e.name === "AbortError"
          ? "timeout after 15s"
          : e instanceof Error
            ? e.message
            : String(e);
      setError(t.edit.deleteError + msg);
    }
  }

  return (
    <form
      onSubmit={onSave}
      className="washi-card p-6 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="space-y-1 md:col-span-2 text-xs text-muted-foreground">
        <span>slug:</span> <code className="font-mono">{prompt.slug}</code>
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldTitleZh}</Label>
        <Input
          required
          maxLength={120}
          value={titleZh}
          onChange={(e) => setTitleZh(e.target.value)}
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldTitleEn}</Label>
        <Input
          maxLength={120}
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>{t.submit.fieldDescZh}</Label>
        <Textarea
          rows={3}
          value={descZh}
          onChange={(e) => setDescZh(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>{t.submit.fieldDescEn}</Label>
        <Textarea
          rows={3}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldBody}</Label>
        <Textarea
          required
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldNegative}</Label>
        <Textarea
          rows={2}
          value={negative}
          onChange={(e) => setNegative(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>{t.submit.fieldParameters}</Label>
        <Input
          value={parameters}
          onChange={(e) => setParameters(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>{t.submit.fieldModel}</Label>
        <Input value={model} onChange={(e) => setModel(e.target.value)} />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldTags}</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label>{t.submit.fieldCategory}</Label>
        <select
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

      {canTogglePublish && (
        <label className="inline-flex items-center gap-2 text-sm md:col-span-2 border border-border bg-secondary/40 p-3">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="size-4 accent-primary"
          />
          <span>
            {t.edit.publishLabel}
            <span className="ml-2 text-xs text-muted-foreground">
              {t.edit.publishHint}
            </span>
          </span>
        </label>
      )}

      {error && (
        <p className="md:col-span-2 text-sm text-destructive">{error}</p>
      )}
      {savedAt && !error && (
        <p className="md:col-span-2 text-sm text-primary">{t.edit.success}</p>
      )}

      <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={saving || deleting}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? t.edit.saving : t.edit.save}
        </Button>

        <Button
          type="button"
          variant="destructive"
          disabled={saving || deleting}
          onClick={onDelete}
          className="ml-auto"
        >
          {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          {deleting ? t.edit.deleting : t.edit.delete}
        </Button>
      </div>
    </form>
  );
}
