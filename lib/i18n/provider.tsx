"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dict, DEFAULT_LOCALE, LOCALES, type Locale } from "./dictionary";

type Ctx = {
  locale: Locale;
  t: (typeof dict)[Locale];
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

const COOKIE = "ppw-locale";
const MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${COOKIE}=([^;]+)`));
  if (!m) return null;
  const v = decodeURIComponent(m[2]);
  return (LOCALES as readonly string[]).includes(v) ? (v as Locale) : null;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? DEFAULT_LOCALE,
  );

  useEffect(() => {
    const fromCookie = readCookie();
    if (fromCookie && fromCookie !== locale) setLocaleState(fromCookie);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE}=${l}; path=/; max-age=${MAX_AGE}; samesite=lax`;
      document.documentElement.lang = l === "zh" ? "zh-Hant" : "en";
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ locale, t: dict[locale], setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

export function pickText<T extends { zh?: string | null; en?: string | null }>(
  obj: T,
  locale: Locale,
  fallbackKey: "zh" | "en" = "zh",
) {
  return obj[locale] ?? obj[fallbackKey] ?? "";
}
