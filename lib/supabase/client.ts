"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Returns a singleton browser Supabase client.
 *
 * Why the no-op lock: @supabase/auth-js uses navigator.locks by default to
 * serialize auth operations across tabs. In practice that lock can deadlock
 * (auth.updateUser hangs forever) when there are multiple client instances or
 * when the lock-holding tab is slow to release. For a single-tab web app the
 * lock gives us little and costs reliability, so we replace it with a
 * pass-through that just runs the callback.
 */
export function createClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  cached = createBrowserClient(url, key, {
    auth: {
      lock: async (_name, _acquireTimeout, fn) => fn(),
    },
  });
  return cached;
}
