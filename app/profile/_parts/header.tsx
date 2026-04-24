"use client";

import { Shield, UserCog } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Badge } from "@/components/ui/badge";

export function ProfileHeader({
  email,
  isAdmin,
  ageVerified,
}: {
  email: string;
  isAdmin: boolean;
  ageVerified: boolean;
}) {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">{t.profile.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        {t.profile.subtitle}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{email}</span>
        {isAdmin && (
          <Badge>
            <UserCog className="mr-1 size-3" /> {t.profile.adminBadge}
          </Badge>
        )}
        {ageVerified && (
          <Badge variant="outline">
            <Shield className="mr-1 size-3" /> {t.profile.verifiedBadge}
          </Badge>
        )}
      </div>
    </header>
  );
}
