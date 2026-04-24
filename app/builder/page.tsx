import { createClient } from "@/lib/supabase/server";
import { BuilderForm } from "@/components/builder-form";
import type { BuilderElement } from "@/lib/supabase/types";
import { BuilderHeader } from "./_parts";

export const dynamic = "force-dynamic";

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("builder_elements")
    .select("*")
    .order("weight", { ascending: false });

  const elements = (data ?? []) as BuilderElement[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <BuilderHeader />
      <div className="mt-8">
        <BuilderForm elements={elements} />
      </div>
    </div>
  );
}
