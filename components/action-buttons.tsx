"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function useLoginRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  return (reason: string) => {
    const redirect = encodeURIComponent(pathname || "/");
    router.push(`/login?redirect=${redirect}&reason=${reason}`);
  };
}

export function LikeButton({
  promptId,
  initialCount,
  initialLiked,
}: {
  promptId: string;
  initialCount: number;
  initialLiked: boolean;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { user } = useSession();
  const toLogin = useLoginRedirect();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  async function toggle() {
    if (!user) {
      toLogin("like");
      return;
    }
    const supabase = createClient();
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      if (next) {
        await supabase
          .from("likes")
          .upsert({ user_id: user.id, prompt_id: promptId });
      } else {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", promptId);
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={pending}
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      {t.common.like} · {count}
    </Button>
  );
}

export function FavoriteButton({
  promptId,
  initialCount,
  initialFavorited,
}: {
  promptId: string;
  initialCount: number;
  initialFavorited: boolean;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { user } = useSession();
  const toLogin = useLoginRedirect();
  const [fav, setFav] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  async function toggle() {
    if (!user) {
      toLogin("favorite");
      return;
    }
    const supabase = createClient();
    const next = !fav;
    setFav(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      if (next) {
        await supabase
          .from("favorites")
          .upsert({ user_id: user.id, prompt_id: promptId });
      } else {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", promptId);
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={fav ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={pending}
    >
      <Star className={cn("size-4", fav && "fill-current")} />
      {t.common.favorite} · {count}
    </Button>
  );
}
