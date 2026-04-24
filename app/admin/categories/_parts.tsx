"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/supabase/types";

export function CategoryCreateForm({
  action,
}: {
  action: (f: FormData) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      await action(fd);
      form.reset();
    });
  }
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field name="slug" label="slug" required />
      <Field name="order" label="排序" placeholder="0" />
      <Field name="name_zh" label="名稱 (中)" required />
      <Field name="name_en" label="Name (en)" required />
      <Field name="description_zh" label="描述 (中)" />
      <Field name="description_en" label="Description (en)" />
      <div className="md:col-span-2 pt-2">
        <Button disabled={pending}>{pending ? "建立中…" : "建立分類"}</Button>
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

export function CategoryTable({
  categories,
  deleteCategory,
}: {
  categories: Category[];
  deleteCategory: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  async function doDelete(c: Category) {
    if (!confirm(`刪除「${c.name_zh}」？`)) return;
    setBusy(c.id);
    await deleteCategory(c.id);
    setBusy(null);
  }
  if (categories.length === 0) {
    return (
      <div className="washi-card p-6 text-sm text-muted-foreground">尚無。</div>
    );
  }
  return (
    <div className="washi-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="p-3">順序</th>
            <th className="p-3">Slug</th>
            <th className="p-3">名稱</th>
            <th className="p-3 text-right">Ops</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="p-3 font-mono text-xs">{c.order}</td>
              <td className="p-3 font-mono text-xs">{c.slug}</td>
              <td className="p-3 font-serif-tc">
                {c.name_zh}{" "}
                <span className="text-xs text-muted-foreground">
                  / {c.name_en}
                </span>
              </td>
              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy === c.id}
                  onClick={() => doDelete(c)}
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
