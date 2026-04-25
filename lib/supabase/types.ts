import type { BuilderElementType } from "../constants";

export type Category = {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  description_zh: string | null;
  description_en: string | null;
  order: number;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  nsfw_opt_in: boolean;
  age_verified: boolean;
  birth_date: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Prompt = {
  id: string;
  slug: string;
  title_zh: string;
  title_en: string | null;
  description_zh: string | null;
  description_en: string | null;
  body: string;
  negative: string | null;
  parameters: string | null;
  model: string | null;
  tags: string[] | null;
  images: string[];
  category_id: string | null;
  author_id: string | null;
  is_nsfw: boolean;
  is_published: boolean;
  likes_count: number;
  favorites_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};

export type PromptWithRelations = Prompt & {
  category: Pick<Category, "id" | "slug" | "name_zh" | "name_en"> | null;
  author: Pick<Profile, "id" | "username" | "display_name" | "avatar_url"> | null;
};

export type BuilderElement = {
  id: string;
  type: BuilderElementType;
  label_zh: string;
  label_en: string | null;
  value: string;
  is_nsfw: boolean;
  weight: number;
  created_at: string;
};

export type Favorite = {
  user_id: string;
  prompt_id: string;
  created_at: string;
};

export type Like = {
  user_id: string;
  prompt_id: string;
  created_at: string;
};
