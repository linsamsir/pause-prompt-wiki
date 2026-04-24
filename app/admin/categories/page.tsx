import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CategoryCreateForm, CategoryTable } from "./_parts";
import type { Category } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  async function createCategory(fd: FormData) {
    "use server";
    const supabase = await createClient();
    await supabase.from("categories").insert({
      slug: (fd.get("slug") as string).trim(),
      name_zh: (fd.get("name_zh") as string).trim(),
      name_en: (fd.get("name_en") as string).trim(),
      description_zh: (fd.get("description_zh") as string)?.trim() || null,
      description_en: (fd.get("description_en") as string)?.trim() || null,
      order: Number(fd.get("order") ?? 0),
    });
    revalidatePath("/admin/categories");
    revalidatePath("/wiki");
    revalidatePath("/");
  }

  async function deleteCategory(id: string) {
    "use server";
    const supabase = await createClient();
    await supabase.from("categories").delete().eq("id", id);
    revalidatePath("/admin/categories");
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="section-title text-lg">新增分類</h2>
        <div className="washi-card mt-3 p-5">
          <CategoryCreateForm action={createCategory} />
        </div>
      </section>
      <section>
        <h2 className="section-title text-lg">所有分類</h2>
        <div className="mt-3">
          <CategoryTable
            categories={(data ?? []) as Category[]}
            deleteCategory={deleteCategory}
          />
        </div>
      </section>
    </div>
  );
}
