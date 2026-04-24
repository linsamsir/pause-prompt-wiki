import { createClient } from "@/lib/supabase/server";
import { RandomRoller } from "@/components/random-roller";
import type { BuilderElement } from "@/lib/supabase/types";
import { RandomHeader } from "./_parts";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("builder_elements").select("*");
  const elements = (data ?? []) as BuilderElement[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <RandomHeader />
      <div className="mt-8">
        <RandomRoller elements={elements} />
      </div>
    </div>
  );
}
