"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";
import type { Category, Prompt } from "@/lib/supabase/types";

export function PromptCreateForm({
  categories,
  action,
}: {
  categories: Category[];
  action: (f: FormData) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const [images, setImages] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("images", JSON.stringify(images));
    start(async () => {
      await action(fd);
      form.reset();
      setImages([]);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field name="slug" label="slug" required placeholder="my-new-prompt" />
      <Field name="model" label="model" placeholder="SDXL / Flux / Midjourney" />
      <Field name="title_zh" label="標題 (中)" required />
      <Field name="title_en" label="Title (en)" />
      <Field name="description_zh" label="描述 (中)" />
      <Field name="description_en" label="Description (en)" />
      <div className="md:col-span-2">
        <Label>body</Label>
        <Textarea name="body" required rows={4} />
      </div>
      <div className="md:col-span-2">
        <Label>negative</Label>
        <Textarea name="negative" rows={2} />
      </div>
      <div className="md:col-span-2">
        <Label>parameters</Label>
        <Textarea name="parameters" rows={2} placeholder="--ar 3:2 --cfg 7" />
      </div>
      <Field name="tags" label="tags (以逗號分隔)" placeholder="japan, anime, moody" />
      <div>
        <Label>category</Label>
        <select
          name="category_id"
          defaultValue=""
          className="mt-1 h-10 w-full border border-input bg-background px-3 text-sm"
        >
          <option value="">— 無 —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_zh} / {c.name_en}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <Label>成果圖（選填，最多 4 張）</Label>
        <div className="mt-1">
          <ImageUploader value={images} onChange={setImages} />
        </div>
      </div>

      <div className="md:col-span-2 flex items-center gap-6 pt-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_nsfw" /> NSFW
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_published" defaultChecked /> 發佈
        </label>
      </div>
      <div className="md:col-span-2 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "建立中…" : "建立 Prompt"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

export function PromptAdminTable({
  prompts,
  togglePublish,
  deletePrompt,
}: {
  prompts: Prompt[];
  togglePublish: (id: string, next: boolean) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function doToggle(p: Prompt) {
    setBusy(p.id);
    await togglePublish(p.id, !p.is_published);
    setBusy(null);
  }

  async function doDelete(p: Prompt) {
    if (!confirm(`確定刪除「${p.title_zh}」？`)) return;
    setBusy(p.id);
    await deletePrompt(p.id);
    setBusy(null);
  }

  if (prompts.length === 0) {
    return (
      <div className="washi-card p-6 text-sm text-muted-foreground">尚無。</div>
    );
  }

  return (
    <div className="washi-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Slug</th>
            <th className="p-3">NSFW</th>
            <th className="p-3">Pub.</th>
            <th className="p-3 text-right">Ops</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3">
                <div className="font-serif-tc font-semibold">{p.title_zh}</div>
                {p.title_en && (
                  <div className="text-xs text-muted-foreground">
                    {p.title_en}
                  </div>
                )}
              </td>
              <td className="p-3 font-mono text-xs">{p.slug}</td>
              <td className="p-3">
                {p.is_nsfw ? <Badge variant="nsfw">NSFW</Badge> : "—"}
              </td>
              <td className="p-3">
                {p.is_published ? (
                  <Badge>已發佈</Badge>
                ) : (
                  <Badge variant="muted">草稿</Badge>
                )}
              </td>
              <td className="p-3 text-right space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/wiki/${p.slug}/edit`}>編輯</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === p.id}
                  onClick={() => doToggle(p)}
                >
                  {p.is_published ? "下架" : "發佈"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy === p.id}
                  onClick={() => doDelete(p)}
                >
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
