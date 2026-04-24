"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/";
  try {
    const d = decodeURIComponent(raw);
    if (d.startsWith("/") && !d.startsWith("//")) return d;
  } catch {}
  return "/";
}

export function RegisterForm() {
  const { t } = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const redirect = sanitizeRedirect(search.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t.register.passwordTooShort);
      return;
    }
    if (password !== confirm) {
      setError(t.register.passwordMismatch);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
      redirect,
    )}`;

    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo },
    });
    setSubmitting(false);

    if (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered")) {
        setError(t.register.emailInUse);
      } else {
        setError(t.register.error + (err.message ? ` (${err.message})` : ""));
      }
      return;
    }

    // Persist birth_date into profile if the trigger-created profile exists.
    // In Supabase default, signUp returns a user even before email confirmation.
    if (birthDate && data.user) {
      await supabase
        .from("profiles")
        .update({ birth_date: birthDate })
        .eq("id", data.user.id);
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-primary">{t.register.success}</p>
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="inline-block stamp stamp-filled"
        >
          {t.register.loginCta}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t.register.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t.register.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
        <p className="text-xs text-muted-foreground">{t.register.passwordHint}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">{t.register.confirmLabel}</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth">{t.register.birthDateLabel}</Label>
        <Input
          id="birth"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          disabled={submitting}
        />
        <p className="text-xs text-muted-foreground">{t.register.birthDateHint}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {submitting ? t.register.submitting : t.register.cta}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t.register.haveAccount}{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-primary hover:underline"
          onClick={() => router.prefetch("/login")}
        >
          {t.register.loginCta}
        </Link>
      </p>
    </form>
  );
}
