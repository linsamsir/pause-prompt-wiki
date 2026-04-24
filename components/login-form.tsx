"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Loader2 } from "lucide-react";
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

type Mode = "password" | "magic";

export function LoginForm() {
  const { t } = useLocale();
  const search = useSearchParams();
  const router = useRouter();
  const { user } = useSession();
  const redirect = sanitizeRedirect(search.get("redirect"));
  const reason = search.get("reason");

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error" | "invalid" | "unconfirmed"
  >("idle");

  useEffect(() => {
    if (user && redirect !== "/login") {
      router.replace(redirect);
    }
  }, [user, redirect, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const supabase = createClient();
    setStatus("sending");

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (!error) {
        setStatus("idle");
        router.replace(redirect);
        router.refresh();
        return;
      }
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid") || msg.includes("credentials")) {
        setStatus("invalid");
      } else if (msg.includes("confirm")) {
        setStatus("unconfirmed");
      } else {
        setStatus("error");
      }
      return;
    }

    // magic link
    const origin = typeof window !== "undefined" ? window.location.origin : "";
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
        <Label htmlFor="email">{t.login.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t.login.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
      </div>

      {mode === "password" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.login.passwordLabel}</Label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-muted-foreground hover:text-primary"
            >
              {t.login.forgotPassword}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder={t.login.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "sending"}
          />
        </div>
      )}

      <Button type="submit" disabled={status === "sending"} className="w-full">
        {status === "sending" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : mode === "password" ? (
          <LogIn className="size-4" />
        ) : (
          <Mail className="size-4" />
        )}
        {status === "sending"
          ? t.login.signingIn
          : mode === "password"
            ? t.login.loginCta
            : t.login.sendLink}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-primary">{t.login.checkEmail}</p>
      )}
      {status === "invalid" && (
        <p className="text-sm text-destructive">{t.login.invalidCredentials}</p>
      )}
      {status === "unconfirmed" && (
        <p className="text-sm text-destructive">{t.login.needsConfirmation}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{t.login.error}</p>
      )}

      <div className="flex items-center gap-3 text-xs">
        <span className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground uppercase tracking-widest">
          {t.login.or}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "password" ? "magic" : "password"));
          setStatus("idle");
        }}
        className="w-full text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
      >
        {mode === "password"
          ? t.login.useMagicLinkInstead
          : t.login.usePasswordInstead}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        {t.login.noAccount}{" "}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirect)}`}
          className="text-primary hover:underline"
        >
          {t.login.registerCta}
        </Link>
      </p>
    </form>
  );
}
