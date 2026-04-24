"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "@/components/auth/session-provider";
import { useLocale } from "@/lib/i18n/provider";
import { createClient } from "@/lib/supabase/client";
import { updateAuthUser } from "@/lib/supabase/auth-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BasicInfoForm() {
  const { t } = useLocale();
  const { user, profile, refreshProfile } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setUsername(profile.username ?? "");
      setBirthDate(profile.birth_date ?? "");
    }
  }, [profile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    const supabase = createClient();
    const updates: {
      display_name: string | null;
      username: string | null;
      birth_date: string | null;
    } = {
      display_name: displayName.trim() || null,
      username: username.trim().toLowerCase() || null,
      birth_date: birthDate || null,
    };
    const { error: err } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (err) {
      setSaving(false);
      if (err.message?.toLowerCase().includes("unique")) {
        setError(t.profile.usernameTaken);
      } else {
        setError(t.profile.saveError + err.message);
      }
      return;
    }

    // Also mirror display_name into auth.users.raw_user_meta_data so the
    // Supabase Auth Dashboard (and any OAuth identity providers) see the same
    // name we show in the app. Non-fatal — we still report overall success
    // if only this part fails.
    await updateAuthUser({
      data: {
        display_name: updates.display_name,
        name: updates.display_name,
        username: updates.username,
      },
    });

    setSaving(false);
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <section className="washi-card p-5 space-y-5">
      <h2 className="section-title text-base">{t.profile.basicInfo}</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t.profile.emailLabel}</Label>
          <Input id="email" value={user?.email ?? ""} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">{t.profile.displayNameLabel}</Label>
          <Input
            id="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">{t.profile.usernameLabel}</Label>
          <div className="flex items-center">
            <span className="inline-flex h-10 items-center border border-r-0 border-border bg-secondary px-3 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))
              }
              maxLength={30}
              className="border-l-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">{t.profile.birthDateLabel}</Label>
          <Input
            id="birth_date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? t.profile.saving : t.profile.save}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-primary">
              <CheckCircle2 className="size-4" /> {t.profile.saved}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
