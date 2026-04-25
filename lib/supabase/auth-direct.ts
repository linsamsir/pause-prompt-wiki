"use client";

import { readAccessTokenFromCookie } from "./access-token";

/**
 * Directly call Supabase's GoTrue `PUT /auth/v1/user` endpoint with the caller's
 * access token. Bypasses `supabase.auth.updateUser()`, which in this project
 * has hung on us (internal session-refresh queue stalls). Supports both
 * password changes and user_metadata patches.
 *
 * Reads the bearer token straight from cookies — supabase.auth.getSession()
 * itself has been observed to hang in some browsers, so we don't trust it.
 *
 * Always resolves — never throws — so callers can check `{ error }` plainly.
 */
export async function updateAuthUser(
  patch: Record<string, unknown>,
  { timeoutMs = 15_000 }: { timeoutMs?: number } = {},
): Promise<{ error: string | null }> {
  try {
    const accessToken = readAccessTokenFromCookie();
    if (!accessToken) {
      return {
        error: "No active session — please sign in again.",
      };
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${url}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
      },
      body: JSON.stringify(patch),
      signal: controller.signal,
    });
    clearTimeout(tid);

    if (!res.ok) {
      const body: {
        msg?: string;
        message?: string;
        error_description?: string;
      } = await res.json().catch(() => ({}));
      return {
        error:
          body.msg ||
          body.message ||
          body.error_description ||
          `HTTP ${res.status}`,
      };
    }
    return { error: null };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { error: "timeout" };
    }
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
