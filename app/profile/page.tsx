import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  PromptWithRelations,
} from "@/lib/supabase/types";
import { ProfileHeader } from "./_parts/header";
import { BasicInfoForm } from "./_parts/basic-info-form";
import { ContentPrefs } from "./_parts/content-prefs";
import { DangerZone } from "./_parts/danger-zone";
import { ProfileTabs } from "./_parts/tabs";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=%2Fprofile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const [{ data: myPrompts }, { data: favRows }] = await Promise.all([
    supabase
      .from("prompts")
      .select(
        "*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url)",
      )
      .eq("author_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("favorites")
      .select(
        "prompt_id, created_at, prompt:prompts!prompt_id(*, category:categories!category_id(id, slug, name_zh, name_en), author:profiles!author_id(id, username, display_name, avatar_url))",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const favorites = (
    (favRows ?? []) as unknown as Array<{ prompt: PromptWithRelations | null }>
  )
    .map((r) => r.prompt)
    .filter((p): p is PromptWithRelations => p != null);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <ProfileHeader
        email={user.email ?? ""}
        isAdmin={!!profile?.is_admin}
        ageVerified={!!profile?.age_verified}
      />

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <BasicInfoForm />
          <ProfileTabs
            myPrompts={(myPrompts ?? []) as PromptWithRelations[]}
            favorites={favorites}
          />
        </div>
        <aside className="space-y-6">
          <ContentPrefs />
          <DangerZone email={user.email ?? ""} />
        </aside>
      </div>
    </div>
  );
}
