import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BUILDER_ELEMENT_TYPES } from "@/lib/constants";
import { ElementCreateForm, ElementTable } from "./_parts";
import type { BuilderElement } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminElementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("builder_elements")
    .select("*")
    .order("type", { ascending: true })
    .order("weight", { ascending: false });

  async function createElement(fd: FormData) {
    "use server";
    const supabase = await createClient();
    const type = fd.get("type") as string;
    if (!(BUILDER_ELEMENT_TYPES as readonly string[]).includes(type)) return;
    await supabase.from("builder_elements").insert({
      type,
      label_zh: (fd.get("label_zh") as string).trim(),
      label_en: (fd.get("label_en") as string)?.trim() || null,
      value: (fd.get("value") as string).trim(),
      is_nsfw: fd.get("is_nsfw") === "on",
      weight: Number(fd.get("weight") ?? 0),
    });
    revalidatePath("/admin/elements");
    revalidatePath("/builder");
    revalidatePath("/random");
  }

  async function deleteElement(id: string) {
    "use server";
    const supabase = await createClient();
    await supabase.from("builder_elements").delete().eq("id", id);
    revalidatePath("/admin/elements");
    revalidatePath("/builder");
    revalidatePath("/random");
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="section-title text-lg">新增元素</h2>
        <div className="washi-card mt-3 p-5">
          <ElementCreateForm action={createElement} />
        </div>
      </section>
      <section>
        <h2 className="section-title text-lg">所有元素</h2>
        <div className="mt-3">
          <ElementTable
            elements={(data ?? []) as BuilderElement[]}
            deleteElement={deleteElement}
          />
        </div>
      </section>
    </div>
  );
}
