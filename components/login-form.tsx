"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/";
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {}
  return "/";
}

export function LoginForm() {
  const { t } = useLocale();
  const search = useSearchParams();
  const router = useRouter();
  const { user } = useSession();
  const redirect = sanitizeRedirect(search.get("redirect"));
  const reason = search.get("reason");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  // If already logged in, bounce straight to destination.
  useEffect(() => {
    if (user && redirect !== "/login") {
      router.replace(redirect);
    }
  }, [user, redirect, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    const supabase = createClient();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
      redirect,
    )}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo },
    });
    setStatus(error ? "error" : "sent");
  }

  const hint =
    reason === "nsfw"
      ? t.login.ageNotice
      : redirect !== "/"
        ? t.login.redirectNotice
        : null;

  return (
    <form onSubmit={submit} className="space-y-4">
      {hint && (
        <p className="border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder={t.login.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
      </div>

      <Button type="submit" disabled={status === "sending"} className="w-full">
        {status === "sending" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mail className="size-4" />
        )}
        {t.login.sendLink}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-primary">{t.login.checkEmail}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{t.login.error}</p>
      )}
    </form>
  );
}
