"use client";

import {
  AlertTriangle,
  BarChart3,
  Bot,
  Building2,
  FileText,
  Handshake,
  Lock,
  PlayCircle,
  ScrollText
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { LocaleProvider, useLocale } from "./locale-context";
import { LocaleToggle } from "./locale-toggle";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/assistant", label: "Assistant", icon: Bot },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/partners", label: "Partners", icon: Handshake },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/workflows", label: "Workflows", icon: PlayCircle },
  { href: "/reports", label: "Reports", icon: ScrollText }
];

const copy = {
  en: {
    product: "Andén OS",
    subtitle: "AI backoffice demo",
    aiSpend: "Estimated AI spend",
    protected: "Demo protected",
    lock: "Lock demo"
  },
  es: {
    product: "Andén OS",
    subtitle: "Demo de backoffice AI",
    aiSpend: "Gasto AI estimado",
    protected: "Demo protegido",
    lock: "Bloquear demo"
  }
};

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ShellFrame>{children}</ShellFrame>
    </LocaleProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const t = copy[locale];

  async function lockDemo() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen px-3 py-3 text-[var(--color-body)] md:px-4 md:py-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-ink)] p-4 text-[var(--anden-cream-light)] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/dashboard" className="block">
              <p className="brand-heading text-3xl font-semibold leading-none text-[var(--anden-cream-light)]">
                {t.product}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--anden-lime)]">
                {t.subtitle}
              </p>
            </Link>
            <div className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 lg:mt-8">
              {t.protected}
            </div>
          </div>
          <nav
            aria-label="Primary"
            className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:mt-10 lg:grid-cols-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[var(--anden-lime)] bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]"
                      : "border-white/10 bg-white/5 text-white/76 hover:bg-white/10"
                  }`}
                >
                  <Icon size={17} aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3 lg:px-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-xl bg-[var(--anden-blue)] px-3 py-2 font-semibold text-white">
                {t.aiSpend}: $0.00 / $5.00
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-muted)]">
                <AlertTriangle size={15} aria-hidden />
                Legal review ready
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LocaleToggle />
              <ThemeToggle />
              <button
                type="button"
                onClick={lockDemo}
                aria-label="Lock demo"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                <Lock size={16} aria-hidden />
                <span className="hidden sm:inline">{t.lock}</span>
              </button>
            </div>
          </header>
          <main className="min-w-0 flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
