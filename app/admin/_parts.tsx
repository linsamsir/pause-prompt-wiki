"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const { t } = useLocale();
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: t.admin.stats },
    { href: "/admin/prompts", label: t.admin.prompts },
    { href: "/admin/categories", label: t.admin.categories },
    { href: "/admin/elements", label: t.admin.elements },
  ];

  return (
    <header>
      <h1 className="section-title text-3xl md:text-4xl">{t.admin.title}</h1>
      <nav className="mt-4 flex flex-wrap gap-0 border border-border">
        {items.map((i, idx) => {
          const active =
            i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "px-4 py-2 text-sm font-serif-tc tracking-wider",
                idx > 0 && "border-l border-border",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
