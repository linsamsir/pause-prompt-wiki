import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "./_parts";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=%2Fadmin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, display_name, username")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="section-title text-2xl">Forbidden</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          此頁僅限管理員。請聯絡維運者將 <code>profiles.is_admin</code> 設為 true。
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          已登入：{profile?.display_name ?? profile?.username ?? user.email}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block stamp stamp-filled"
        >
          回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
