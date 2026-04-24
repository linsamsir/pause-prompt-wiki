"use client";

import { useState } from "react";
import { CheckCircle2, Shield } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { AgeGateModal } from "@/components/auth/age-gate-modal";
import { Button } from "@/components/ui/button";

export function ContentPrefs() {
  const { t } = useLocale();
  const { profile, refreshProfile } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <section className="washi-card p-5 space-y-4">
      <h2 className="section-title text-base">{t.profile.contentPrefs}</h2>

      <div className="flex items-start gap-2">
        <Shield className="mt-0.5 size-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium">NSFW</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {t.profile.nsfwDesc}
          </p>
        </div>
      </div>

      {profile?.age_verified ? (
        <div className="inline-flex items-center gap-1 text-xs text-primary border border-primary px-2 py-1">
          <CheckCircle2 className="size-3.5" /> {t.profile.nsfwVerified}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          {t.profile.nsfwVerifyCta}
        </Button>
      )}

      <AgeGateModal
        open={open}
        onOpenChange={setOpen}
        onConfirmed={async () => {
          await refreshProfile();
        }}
      />
    </section>
  );
}
