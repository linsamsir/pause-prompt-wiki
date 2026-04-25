import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PromptAdminTable, PromptCreateForm } from "./_parts";
import type { Category, Prompt } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminPromptsPage() {
  const supabase = await createClient();

  const [{ data: prompts }, { data: categories }] = await Promise.all([
    supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("order", { ascending: true }),
  ]);

  async function createPrompt(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const payload = {
      slug: (formData.get("slug") as string).trim(),
      title_zh: (formData.get("title_zh") as string).trim(),
      title_en: (formData.get("title_en") as string)?.trim() || null,
      description_zh: (formData.get("description_zh") as string)?.trim() || null,
      description_en: (formData.get("description_en") as string)?.trim() || null,
      body: (formData.get("body") as string).trim(),
      negative: (formData.get("negative") as string)?.trim() || null,
      parameters: (formData.get("parameters") as string)?.trim() || null,
      model: (formData.get("model") as string)?.trim() || null,
      tags:
        (formData.get("tags") as string)
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean) ?? [],
      images: (() => {
        try {
          const raw = formData.get("images") as string | null;
          if (!raw) return [] as string[];
          const arr = JSON.parse(raw);
          return Array.isArray(arr)
            ? arr.filter((s) => typeof s === "string")
            : [];
        } catch {
          return [] as string[];
        }
      })(),
      category_id: (formData.get("category_id") as string) || null,
      is_nsfw: formData.get("is_nsfw") === "on",
      is_published: formData.get("is_published") === "on",
    };
    await supabase.from("prompts").insert(payload);
    revalidatePath("/admin/prompts");
    revalidatePath("/wiki");
    revalidatePath("/");
  }

  async function togglePublish(id: string, next: boolean) {
    "use server";
    const supabase = await createClient();
    await supabase.from("prompts").update({ is_published: next }).eq("id", id);
    revalidatePath("/admin/prompts");
    revalidatePath("/wiki");
    revalidatePath("/");
  }

  async function deletePrompt(id: string) {
    "use server";
    const supabase = await createClient();
    await supabase.from("prompts").delete().eq("id", id);
    revalidatePath("/admin/prompts");
    revalidatePath("/wiki");
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="section-title text-lg">新增 Prompt</h2>
        <div className="washi-card mt-3 p-5">
          <PromptCreateForm
            categories={(categories ?? []) as Category[]}
            action={createPrompt}
          />
        </div>
      </section>

      <section>
        <h2 className="section-title text-lg">所有 Prompt</h2>
        <div className="mt-3">
          <PromptAdminTable
            prompts={(prompts ?? []) as Prompt[]}
            togglePublish={togglePublish}
            deletePrompt={deletePrompt}
          />
        </div>
      </section>
    </div>
  );
}
