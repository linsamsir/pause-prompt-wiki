"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotForm() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/auth/callback?next=%2Freset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t.forgot.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
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
        {status === "sending" ? t.forgot.submitting : t.forgot.cta}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-primary">{t.forgot.sent}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{t.forgot.error}</p>
      )}

      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3" /> {t.forgot.backToLogin}
      </Link>
    </form>
  );
}
