"use client";

import { useMemo, useState } from "react";
import { Shuffle, Eraser } from "lucide-react";
import {
  BUILDER_ELEMENT_LABELS,
  BUILDER_ELEMENT_TYPES,
  type BuilderElementType,
} from "@/lib/constants";
import type { BuilderElement } from "@/lib/supabase/types";
import { useNsfw } from "@/components/layout/nsfw-toggle";
import { useLocale } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Selected = Record<BuilderElementType, BuilderElement[]>;

function emptySelected(): Selected {
  return BUILDER_ELEMENT_TYPES.reduce((acc, k) => {
    acc[k] = [];
    return acc;
  }, {} as Selected);
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (a.length && out.length < n) {
    const i = Math.floor(Math.random() * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
}

export function BuilderForm({
  elements,
  showRoll = true,
}: {
  elements: BuilderElement[];
  showRoll?: boolean;
}) {
  const { t, locale } = useLocale();
  const [showNsfw] = useNsfw();
  const [selected, setSelected] = useState<Selected>(emptySelected());

  const pool = useMemo(
    () => elements.filter((e) => showNsfw || !e.is_nsfw),
    [elements, showNsfw],
  );

  const byType = useMemo(() => {
    const m = {} as Record<BuilderElementType, BuilderElement[]>;
    for (const t of BUILDER_ELEMENT_TYPES) m[t] = [];
    for (const e of pool) m[e.type]?.push(e);
    return m;
  }, [pool]);

  function toggle(type: BuilderElementType, el: BuilderElement) {
    setSelected((s) => {
      const arr = s[type];
      const exists = arr.find((x) => x.id === el.id);
      return {
        ...s,
        [type]: exists ? arr.filter((x) => x.id !== el.id) : [...arr, el],
      };
    });
  }

  function clear() {
    setSelected(emptySelected());
  }

  function roll() {
    const next = emptySelected();
    for (const type of BUILDER_ELEMENT_TYPES) {
      if (type === "negative") {
        next[type] = pickRandom(byType[type], 2);
      } else {
        next[type] = pickRandom(byType[type], 1);
      }
    }
    setSelected(next);
  }

  // Concatenate every type except `negative` (which is output in its own
  // field). Order follows BUILDER_ELEMENT_TYPES so the natural prompt-writing
  // flow shows up in the rendered text.
  const prompt = useMemo(() => {
    const parts: string[] = [];
    for (const k of BUILDER_ELEMENT_TYPES) {
      if (k === "negative") continue;
      const picks = selected[k].map((e) => e.value);
      if (picks.length) parts.push(picks.join(", "));
    }
    return parts.join(", ");
  }, [selected]);

  const negative = selected.negative.map((e) => e.value).join(", ");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        {BUILDER_ELEMENT_TYPES.map((type) => {
          const meta = BUILDER_ELEMENT_LABELS[type];
          const options = byType[type];
          // Hide sections with no visible options — this collapses NSFW-only
          // types like `anatomy` when the NSFW toggle is off, and keeps the
          // builder tidy for types the library doesn't yet cover.
          if (options.length === 0) return null;
          return (
            <section key={type} className="washi-card p-5">
              <header className="flex items-baseline justify-between gap-2">
                <div>
                  <h4 className="section-title text-sm">
                    {locale === "zh" ? meta.zh : meta.en}
                    <span className="ml-2 text-muted-foreground text-xs normal-case tracking-normal">
                      / {type}
                    </span>
                  </h4>
                  <p className="mt-1 pl-[0.9rem] text-xs text-muted-foreground">
                    {meta.hint}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {selected[type].length} / {options.length}
                </span>
              </header>

              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((el) => {
                    const on = !!selected[type].find((x) => x.id === el.id);
                    return (
                      <button
                        key={el.id}
                        type="button"
                        onClick={() => toggle(type, el)}
                        className={cn(
                          "border px-2.5 py-1 text-xs transition",
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary",
                        )}
                      >
                        <span className="font-medium">
                          {locale === "zh" ? el.label_zh : el.label_en ?? el.label_zh}
                        </span>
                        <span className="ml-1 text-[10px] opacity-70">
                          {el.value}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start space-y-3">
        <div className="washi-card p-5">
          <div className="flex items-center justify-between">
            <h4 className="section-title text-sm">{t.builder.preview}</h4>
            <div className="flex items-center gap-2">
              {showRoll && (
                <Button type="button" size="sm" variant="outline" onClick={roll}>
                  <Shuffle className="size-4" /> {t.random.roll}
                </Button>
              )}
              <Button type="button" size="sm" variant="ghost" onClick={clear}>
                <Eraser className="size-4" /> {t.builder.clear}
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <Label>prompt</Label>
            <Textarea
              readOnly
              value={prompt}
              rows={6}
              className="mt-1"
              placeholder="—"
            />
          </div>

          <div className="mt-3">
            <Label>negative</Label>
            <Textarea
              readOnly
              value={negative}
              rows={3}
              className="mt-1"
              placeholder="—"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={prompt}>{t.builder.copyPrompt}</CopyButton>
            {negative && (
              <CopyButton text={negative}>
                {t.wiki.detailNegative}
              </CopyButton>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
          {BUILDER_ELEMENT_TYPES.flatMap((k) =>
            selected[k].map((e) => (
              <Badge key={`${k}-${e.id}`} variant="secondary">
                {k}:{locale === "zh" ? e.label_zh : e.label_en ?? e.label_zh}
              </Badge>
            )),
          )}
        </div>
      </aside>
    </div>
  );
}
