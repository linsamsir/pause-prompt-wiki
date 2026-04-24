"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import {
  BUILDER_ELEMENT_LABELS,
  BUILDER_ELEMENT_TYPES,
  type BuilderElementType,
} from "@/lib/constants";
import type { BuilderElement } from "@/lib/supabase/types";
import { useNsfw } from "@/components/layout/nsfw-toggle";
import { useLocale } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

function pick<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function RandomRoller({ elements }: { elements: BuilderElement[] }) {
  const { t, locale } = useLocale();
  const [showNsfw] = useNsfw();
  const [seed, setSeed] = useState(0);

  const rolled = useMemo(() => {
    void seed;
    const pool = elements.filter((e) => showNsfw || !e.is_nsfw);
    const byType = {} as Record<BuilderElementType, BuilderElement[]>;
    for (const ty of BUILDER_ELEMENT_TYPES) byType[ty] = [];
    for (const e of pool) byType[e.type].push(e);

    const result: Record<BuilderElementType, BuilderElement | null> = {
      subject: pick(byType.subject),
      scene: pick(byType.scene),
      lighting: pick(byType.lighting),
      camera: pick(byType.camera),
      style: pick(byType.style),
      quality: pick(byType.quality),
      negative: pick(byType.negative),
    };
    return result;
  }, [elements, showNsfw, seed]);

  const prompt = useMemo(() => {
    return (
      ["subject", "scene", "lighting", "camera", "style", "quality"] as const
    )
      .map((k) => rolled[k]?.value)
      .filter(Boolean)
      .join(", ");
  }, [rolled]);

  const negative = rolled.negative?.value ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t.random.rerollHint}</p>
        <Button type="button" onClick={() => setSeed((s) => s + 1)} size="lg">
          <Shuffle className="size-4" /> {t.random.roll}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {BUILDER_ELEMENT_TYPES.filter((k) => k !== "negative").map((ty) => {
          const el = rolled[ty];
          const meta = BUILDER_ELEMENT_LABELS[ty];
          return (
            <div key={ty} className="washi-card p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {locale === "zh" ? meta.zh : meta.en}
              </div>
              <div className="mt-2 font-serif-tc text-base font-semibold leading-tight">
                {el ? (locale === "zh" ? el.label_zh : el.label_en ?? el.label_zh) : "—"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {el?.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="washi-card p-5">
        <div className="flex items-center justify-between">
          <h4 className="section-title text-sm">prompt</h4>
          <CopyButton text={prompt} />
        </div>
        <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
          {prompt || "—"}
        </pre>
        {negative && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="section-title text-sm">negative</h4>
              <CopyButton text={negative} />
            </div>
            <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-muted-foreground">
              {negative}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
