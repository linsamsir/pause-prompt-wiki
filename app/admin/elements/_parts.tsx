"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BUILDER_ELEMENT_LABELS,
  BUILDER_ELEMENT_TYPES,
} from "@/lib/constants";
import type { BuilderElement } from "@/lib/supabase/types";

export function ElementCreateForm({
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
      <div>
        <Label htmlFor="type">type</Label>
        <select
          id="type"
          name="type"
          required
          className="mt-1 h-10 w-full border border-input bg-background px-3 text-sm"
        >
          {BUILDER_ELEMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {BUILDER_ELEMENT_LABELS[t].zh} · {t}
            </option>
          ))}
        </select>
      </div>
      <Field name="weight" label="權重 (高在前)" placeholder="0" />
      <Field name="label_zh" label="標籤 (中)" required />
      <Field name="label_en" label="Label (en)" />
      <div className="md:col-span-2">
        <Label htmlFor="value">value（會被串接進 prompt）</Label>
        <Input id="value" name="value" required className="mt-1" />
      </div>
      <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" name="is_nsfw" /> NSFW
      </label>
      <div className="md:col-span-2 pt-2">
        <Button disabled={pending}>{pending ? "建立中…" : "建立元素"}</Button>
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

export function ElementTable({
  elements,
  deleteElement,
}: {
  elements: BuilderElement[];
  deleteElement: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function doDelete(e: BuilderElement) {
    if (!confirm(`刪除「${e.label_zh}」？`)) return;
    setBusy(e.id);
    await deleteElement(e.id);
    setBusy(null);
  }

  if (elements.length === 0) {
    return (
      <div className="washi-card p-6 text-sm text-muted-foreground">尚無。</div>
    );
  }

  return (
    <div className="washi-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="p-3">Type</th>
            <th className="p-3">Label</th>
            <th className="p-3">Value</th>
            <th className="p-3">W.</th>
            <th className="p-3 text-right">Ops</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((e) => (
            <tr key={e.id} className="border-t border-border">
              <td className="p-3">
                <Badge variant="outline">{e.type}</Badge>
                {e.is_nsfw && (
                  <Badge variant="nsfw" className="ml-1">
                    NSFW
                  </Badge>
                )}
              </td>
              <td className="p-3 font-serif-tc">
                {e.label_zh}
                {e.label_en && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    / {e.label_en}
                  </span>
                )}
              </td>
              <td className="p-3 font-mono text-xs text-muted-foreground max-w-sm truncate">
                {e.value}
              </td>
              <td className="p-3 font-mono text-xs">{e.weight}</td>
              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy === e.id}
                  onClick={() => doDelete(e)}
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
