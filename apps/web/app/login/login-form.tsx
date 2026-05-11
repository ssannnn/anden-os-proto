"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Invalid access code");
      return;
    }

    router.replace(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden bg-[var(--color-ink)] p-8 text-[var(--anden-cream-light)] sm:p-10 lg:p-12">
            <div className="absolute inset-0 opacity-25">
              <div className="absolute left-8 top-12 h-20 w-40 rounded-[24px] border border-[var(--anden-lime)]" />
              <div className="absolute bottom-16 right-10 h-28 w-52 rounded-[28px] border border-[var(--anden-sky)]" />
              <div className="absolute left-20 top-36 h-px w-72 bg-[var(--anden-orange)]" />
              <div className="absolute bottom-28 left-16 h-px w-64 bg-[var(--anden-lime)]" />
            </div>
            <div className="relative z-10 flex min-h-[360px] flex-col justify-between">
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white/80">
                <ShieldCheck size={16} aria-hidden />
                Demo protected
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--anden-lime)]">
                  Internal AI backoffice
                </p>
                <h1 className="brand-heading max-w-xl text-5xl font-semibold leading-[0.95] text-[var(--anden-cream-light)] sm:text-6xl">
                  Andén OS
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/74">
                  A private operating layer for knowledge, companies, partners,
                  documents, workflows, and executive decisions.
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={submit}
            className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-12"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Access
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                Enter demo access code
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                This shared demo is protected so Andén stakeholders can review
                the product without account setup.
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="demo-access-code"
                className="text-sm font-medium text-[var(--color-ink)]"
              >
                Demo access code
              </label>
              <input
                id="demo-access-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="h-12 w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-canvas)] px-4 text-[var(--color-ink)] outline-none ring-[var(--anden-lime)] transition focus:border-[var(--color-ink)] focus:ring-2"
                autoComplete="off"
              />
              {error ? (
                <p className="text-sm font-medium text-[var(--anden-orange)]">
                  {error}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--anden-lime)] px-4 text-sm font-semibold text-[var(--anden-brown-dark)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isSubmitting ? "Checking..." : "Unlock demo"}</span>
              <ArrowRight size={18} aria-hidden />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
