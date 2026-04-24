"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { updateAuthUser } from "@/lib/supabase/auth-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetForm() {
  const { t } = useLocale();
  const router = useRouter();
  const { user, loading } = useSession();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pwd.length < 6) return setError(t.reset.tooShort);
    if (pwd !== confirm) return setError(t.reset.mismatch);

    setStatus("saving");
    const { error: err } = await updateAuthUser({ password: pwd });
    if (err) {
      setStatus("error");
      setError(t.reset.error + err);
      return;
    }
    setStatus("success");
    setTimeout(() => {
      router.replace("/profile");
      router.refresh();
    }, 1200);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> …
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-destructive">{t.reset.noSession}</p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pwd">{t.reset.newPassword}</Label>
        <Input
          id="pwd"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          disabled={status === "saving"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">{t.reset.confirmPassword}</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={status === "saving"}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-primary">{t.reset.success}</p>
      )}

      <Button type="submit" disabled={status === "saving"} className="w-full">
        {status === "saving" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" />
        )}
        {status === "saving" ? t.reset.submitting : t.reset.cta}
      </Button>
    </form>
  );
}
