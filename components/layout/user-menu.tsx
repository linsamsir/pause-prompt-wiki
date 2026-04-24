"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LogOut, Shield, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { t } = useLocale();
  const { user, profile, loading, signOut } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  if (loading) {
    return (
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center border border-border"
      />
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(pathname || "/");
    return (
      <Link
        href={`/login?redirect=${redirect}`}
        className="hidden sm:inline stamp stamp-filled hover:bg-[var(--color-beni-dark)] hover:border-[var(--color-beni-dark)] transition"
      >
        {t.nav.login}
      </Link>
    );
  }

  const initial =
    profile?.display_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "·";

  function onSignOut() {
    start(async () => {
      await signOut();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-8 items-center gap-2 border border-border bg-background px-1.5",
          "hover:border-primary focus-visible:outline-none focus-visible:border-primary",
        )}
        aria-label={t.account.menuTitle}
      >
        <span className="inline-flex size-6 items-center justify-center bg-primary text-primary-foreground font-serif-tc text-xs">
          {initial}
        </span>
        <span className="hidden md:inline max-w-[140px] truncate text-xs text-muted-foreground">
          {profile?.display_name || user.email}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-52">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          {t.account.menuTitle}
          <div className="mt-0.5 truncate font-serif-tc text-sm text-foreground">
            {user.email}
          </div>
          {profile?.age_verified && (
            <div className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary">
              <Shield className="size-3" /> 18+
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {profile?.is_admin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex w-full items-center gap-2">
              <UserIcon className="size-4" /> {t.account.admin}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onSignOut();
          }}
          disabled={pending}
          className="flex items-center gap-2 text-destructive"
        >
          <LogOut className="size-4" />{" "}
          {pending ? t.account.signingOut : t.account.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
