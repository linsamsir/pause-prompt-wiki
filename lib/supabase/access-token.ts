"use client";

/**
 * Read the current Supabase access token directly from cookies, bypassing
 * `supabase.auth.getSession()` entirely.
 *
 * Why: getSession() in this project has hung indefinitely in some sessions
 * (same family of bugs as the auth-js navigator-lock issues that took down
 * updateUser, signOut, .from().insert(), and .storage.upload()). Every fix
 * has been "skip the SDK, talk to the REST endpoint directly" — but those
 * fixes still called getSession() to fetch the bearer token, recreating
 * the same hang risk one level down. This helper closes that gap.
 *
 * @supabase/ssr stores the session in cookies named
 *   `sb-{project_ref}-auth-token`
 * potentially chunked across `.0`, `.1`, `.2` ... when the value exceeds
 * 4KB. The reassembled value is either plain JSON or `base64-{...}`.
 *
 * Returns null if no readable session is present.
 */
export function readAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  const ref = url.replace(/^https?:\/\//, "").split(".")[0];
  if (!ref) return null;
  const prefix = `sb-${ref}-auth-token`;

  const map: Record<string, string> = {};
  for (const raw of document.cookie.split(";")) {
    const c = raw.trim();
    if (!c) continue;
    const eq = c.indexOf("=");
    if (eq < 0) continue;
    const name = c.slice(0, eq);
    const val = c.slice(eq + 1);
    if (name === prefix || name.startsWith(prefix + ".")) {
      try {
        map[name] = decodeURIComponent(val);
      } catch {
        map[name] = val;
      }
    }
  }

  let combined: string | null = null;
  if (map[prefix]) {
    combined = map[prefix];
  } else {
    const chunkKeys = Object.keys(map)
      .filter((k) => k.startsWith(prefix + "."))
      .sort((a, b) => {
        const ai = parseInt(a.slice(prefix.length + 1), 10);
        const bi = parseInt(b.slice(prefix.length + 1), 10);
        return (isNaN(ai) ? 0 : ai) - (isNaN(bi) ? 0 : bi);
      });
    if (chunkKeys.length) combined = chunkKeys.map((k) => map[k]).join("");
  }

  if (!combined) return null;

  if (combined.startsWith("base64-")) {
    try {
      combined = atob(combined.slice("base64-".length));
    } catch {
      return null;
    }
  }

  try {
    const parsed = JSON.parse(combined);
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.access_token === "string") return parsed.access_token;
      if (
        parsed.currentSession &&
        typeof parsed.currentSession.access_token === "string"
      ) {
        return parsed.currentSession.access_token;
      }
    }
    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch {
    /* not JSON */
  }

  return null;
}
