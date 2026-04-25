"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 4;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const BUCKET = "prompt-images";

export function ImageUploader({
  value,
  onChange,
  className,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}) {
  const { t } = useLocale();
  const { user } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  async function uploadOne(file: File): Promise<string | string> {
    if (!user) return "";
    if (file.size > MAX_BYTES) {
      setErrs((e) => [...e, `${t.uploader.tooLarge}${file.name}`]);
      return "";
    }
    if (!ALLOWED.has(file.type)) {
      setErrs((e) => [...e, `${t.uploader.badType}${file.name}`]);
      return "";
    }

    const ext = file.name.split(".").pop() || "jpg";
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${user.id}/${stamp}-${rand}.${ext}`;

    const supabase = createClient();
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      setErrs((e) => [...e, `${t.uploader.uploadFailed}${error.message}`]);
      return "";
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function ingest(files: FileList | File[]) {
    if (!user) return;
    const arr = Array.from(files);
    const room = MAX_IMAGES - value.length;
    if (room <= 0) {
      setErrs((e) => [...e, t.uploader.maxReached]);
      return;
    }
    const queue = arr.slice(0, room);
    setErrs([]);
    setBusy(true);
    const uploaded: string[] = [];
    for (const f of queue) {
      const url = await uploadOne(f);
      if (url) uploaded.push(url);
    }
    setBusy(false);
    if (uploaded.length) onChange([...value, ...uploaded]);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-xs text-muted-foreground">
        {t.uploader.hint}
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-4",
          dragOver && "outline outline-primary outline-offset-2",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) ingest(e.dataTransfer.files);
        }}
      >
        {value.map((url, i) => (
          <figure
            key={url}
            className="relative aspect-square border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`upload ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={t.uploader.remove}
              className="absolute right-1 top-1 inline-flex size-6 items-center justify-center bg-background/90 border border-border text-muted-foreground hover:text-primary hover:border-primary"
            >
              <X className="size-3.5" />
            </button>
          </figure>
        ))}

        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy || !user}
            className={cn(
              "aspect-square flex flex-col items-center justify-center gap-1 border border-dashed border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
            <span className="text-[11px] font-serif-tc tracking-wider">
              {busy ? t.uploader.uploading : t.uploader.addImage}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) ingest(e.target.files);
          e.target.value = "";
        }}
      />

      {errs.length > 0 && (
        <ul className="space-y-0.5 text-xs text-destructive">
          {errs.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
