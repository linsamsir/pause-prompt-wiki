import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";
import { SubmitHeader } from "./_parts/header";
import { SubmitForm } from "./_parts/submit-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submit" };

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=%2Fsubmit");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <SubmitHeader />
      <div className="mt-6">
        <SubmitForm categories={(categories ?? []) as Category[]} />
      </div>
    </div>
  );
}
