"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

type SessionState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  markAgeVerified: () => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (!supabaseRef.current) supabaseRef.current = createClient();
  const supabase = supabaseRef.current;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (uid: string | null) => {
      if (!uid) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle<Profile>();
      setProfile(data ?? null);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return;
      setUser(data.user ?? null);
      await fetchProfile(data.user?.id ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        await fetchProfile(u?.id ?? null);
      },
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile(user?.id ?? null);
  }, [fetchProfile, user?.id]);

  const markAgeVerified = useCallback(async () => {
    if (!user) return { ok: false, error: "not_authenticated" };
    const { error } = await supabase
      .from("profiles")
      .update({ age_verified: true })
      .eq("id", user.id);
    if (error) return { ok: false, error: error.message };
    await fetchProfile(user.id);
    return { ok: true };
  }, [supabase, user, fetchProfile]);

  const signOut = useCallback(async () => {
    // Kick the server revoke in the background with a timeout so the UI never
    // stalls on it. The local signOut clears cookies + storage immediately.
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (url && anonKey && token) {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 3000);
        // fire-and-forget
        fetch(`${url}/auth/v1/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: anonKey,
          },
          signal: ctrl.signal,
        }).catch(() => {});
      }
    } catch {
      /* noop */
    }
    // Local scope: just clear client state, never hits the network.
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      /* noop */
    }
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const value = useMemo<SessionState>(
    () => ({ user, profile, loading, refreshProfile, markAgeVerified, signOut }),
    [user, profile, loading, refreshProfile, markAgeVerified, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
