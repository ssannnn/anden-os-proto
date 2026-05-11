"use client";

import { Languages } from "lucide-react";
import { useLocale } from "./locale-context";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const nextLocale = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={
        locale === "en" ? "Switch to Spanish" : "Switch to English"
      }
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-ink)]"
    >
      <Languages size={16} aria-hidden />
      {locale.toUpperCase()}
    </button>
  );
}
