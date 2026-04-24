"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { AgeGateModal } from "@/components/auth/age-gate-modal";

const KEY = "ppw-nsfw";

/**
 * Returns [enabled, setEnabled]. `enabled` is gated by the session — even if
 * localStorage says NSFW is on, we only expose it when the viewer is signed in
 * AND has age_verified. Setting to true without going through NsfwToggle is a
 * no-op for viewers who don't qualify, because the next render re-gates.
 */
export function useNsfw(): readonly [boolean, (v: boolean) => void] {
  const { user, profile, loading } = useSession();
  const [raw, setRaw] = useState(false);

  useEffect(() => {
    try {
      setRaw(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  const allowed = !loading && !!user && !!profile?.age_verified;

  // Clear stale localStorage state once session resolves and the viewer no
  // longer qualifies (e.g. signed out since last visit).
  useEffect(() => {
    if (!loading && raw && !allowed) {
      try {
        localStorage.setItem(KEY, "0");
      } catch {}
      setRaw(false);
    }
  }, [raw, allowed, loading]);

  const set = useCallback((v: boolean) => {
    setRaw(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {}
  }, []);

  return [raw && allowed, set] as const;
}

export function NsfwToggle() {
  const { t } = useLocale();
  const { user, profile, loading } = useSession();
  const [on, setOn] = useNsfw();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function handleToggle(next: boolean) {
    if (!next) {
      setOn(false);
      return;
    }
    if (loading) return;
    if (!user) {
      const redirect = encodeURIComponent(pathname || "/");
      router.push(`/login?redirect=${redirect}&reason=nsfw`);
      return;
    }
    if (!profile?.age_verified) {
      setModalOpen(true);
      return;
    }
    setOn(true);
  }

  return (
    <>
      <label className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Switch
          checked={on}
          onCheckedChange={handleToggle}
          aria-label="Toggle NSFW"
        />
        <span>{t.common.showNsfw}</span>
      </label>
      <AgeGateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirmed={() => setOn(true)}
      />
    </>
  );
}
