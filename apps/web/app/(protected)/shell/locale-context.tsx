"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useContext,
  useMemo,
  useSyncExternalStore
} from "react";

export type Locale = "en" | "es";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const localeChangeEvent = "anden-locale-change";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    readStoredLocale,
    getDefaultLocale
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = "light";
    window.localStorage.removeItem("anden-theme");
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale(nextLocale) {
        window.localStorage.setItem("anden-locale", nextLocale);
        document.documentElement.lang = nextLocale;
        document.documentElement.dataset.theme = "light";
        window.dispatchEvent(new Event(localeChangeEvent));
      }
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}

function subscribeToLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(localeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(localeChangeEvent, onStoreChange);
  };
}

function readStoredLocale(): Locale {
  return window.localStorage.getItem("anden-locale") === "es" ? "es" : "en";
}

function getDefaultLocale(): Locale {
  return "en";
}
