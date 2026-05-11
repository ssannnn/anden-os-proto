"use client";

import { ArrowRight, CircleCheck, Clock3, FileText } from "lucide-react";
import { routeCopy, RouteKey } from "./page-copy";
import { useLocale } from "../shell/locale-context";

type PlaceholderPageProps = {
  routeKey: RouteKey;
};

const metrics = [
  ["12", "companies tracked", "empresas registradas"],
  ["4", "institutional partners", "partners institucionales"],
  ["37", "documents indexed", "documentos indexados"],
  ["8", "pending workflows", "workflows pendientes"],
  ["92%", "AI retrieval confidence", "confianza de retrieval AI"],
  ["14h", "saved this week", "ahorradas esta semana"]
];

export function PlaceholderPage({ routeKey }: PlaceholderPageProps) {
  const { locale } = useLocale();
  const page = routeCopy[routeKey];

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {page.eyebrow[locale]}
          </p>
          <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
            {page.title[locale]}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            {page.description[locale]}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--anden-lime)] px-4 text-sm font-semibold text-[var(--anden-brown-dark)]"
        >
          <span>
            {routeKey === "dashboard"
              ? locale === "en"
                ? "Generate Weekly Operating Brief"
                : "Generar brief operativo semanal"
              : locale === "en"
                ? "Open module"
                : "Abrir módulo"}
          </span>
          <ArrowRight size={17} aria-hidden />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {metrics.map(([value, enLabel, esLabel]) => (
          <article
            key={enLabel}
            className="min-h-28 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4"
          >
            <p className="text-3xl font-semibold text-[var(--color-ink)]">
              {value}
            </p>
            <p className="mt-2 text-sm leading-5 text-[var(--color-muted)]">
              {locale === "en" ? enLabel : esLabel}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--anden-blue)] text-white">
              <CircleCheck size={18} aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                {locale === "en" ? "AI Operating Pulse" : "Pulso operativo AI"}
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                {locale === "en"
                  ? "Demo data is mocked; source-backed AI arrives in the RAG slice."
                  : "Los datos demo son mock; la AI con fuentes llega en el slice de RAG."}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["AtlasPay", "GovTech Brief", "Legal Review"].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {item}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {index === 0
                    ? locale === "en"
                      ? "Schedule regulatory onboarding call."
                      : "Agendar llamada de onboarding regulatorio."
                    : index === 1
                      ? locale === "en"
                        ? "Prepare stakeholder talking points."
                        : "Preparar talking points institucionales."
                      : locale === "en"
                        ? "Flagged items ready for review."
                        : "Puntos marcados listos para revisión."}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]">
              <Clock3 size={18} aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                {locale === "en" ? "Next slice ready" : "Próximo slice listo"}
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                {locale === "en"
                  ? "Dashboard data and richer cards land next."
                  : "Datos de dashboard y tarjetas más ricas llegan después."}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
              <FileText size={16} aria-hidden />
              Issue #3
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {locale === "en"
                ? "Build dashboard shell with mocked operational data."
                : "Construir dashboard con datos operativos mockeados."}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
