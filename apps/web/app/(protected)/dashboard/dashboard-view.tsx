"use client";

import type { DashboardData } from "@anden/db";
import type { WeeklyOperatingBrief } from "@anden/reports";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Handshake,
  Scale,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "../shell/locale-context";

const toneClass = {
  blue: "bg-[var(--anden-blue)] text-white",
  lime: "bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]",
  orange: "bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]",
  sky: "bg-[var(--anden-sky)] text-[var(--anden-brown-dark)]",
  periwinkle: "bg-[var(--anden-periwinkle)] text-white",
  brown: "bg-[var(--color-ink)] text-[var(--anden-cream-light)]"
} as const;

const aiSpendToneClass = {
  normal:
    "border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-muted)]",
  warning:
    "border-transparent bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]",
  blocked:
    "border-transparent bg-[var(--color-ink)] text-[var(--anden-cream-light)]"
} as const;

export function DashboardView({
  data,
  dataModeLabel
}: {
  data: DashboardData;
  dataModeLabel: string;
}) {
  const { locale } = useLocale();
  const isSpanish = locale === "es";
  const [brief, setBrief] = useState<WeeklyOperatingBrief | undefined>();
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefError, setBriefError] = useState<string | undefined>();

  async function generateBrief() {
    setIsGeneratingBrief(true);
    setBriefError(undefined);

    try {
      const response = await fetch("/api/reports/weekly", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale })
      });
      const payload = (await response.json()) as {
        ok: boolean;
        report?: WeeklyOperatingBrief;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.report) {
        throw new Error(payload.error ?? "Weekly brief generation failed");
      }

      setBrief(payload.report);
    } catch (error) {
      setBriefError(
        error instanceof Error ? error.message : "Weekly brief generation failed"
      );
    } finally {
      setIsGeneratingBrief(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {isSpanish ? "Pulso operativo" : "Operating pulse"}
          </p>
          <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
            {isSpanish ? "Panel ejecutivo" : "Executive dashboard"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            {isSpanish
              ? "Vista ejecutiva del pipeline institucional, documentos, workflows, consultas AI, alertas y métricas operativas."
              : "Executive view of institutional pipeline, documents, workflows, AI queries, alerts, and operating metrics."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <span className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2 text-xs font-bold text-[var(--color-muted)]">
            {dataModeLabel}
          </span>
          <span
            className={`rounded-lg border px-3 py-2 text-xs font-bold ${aiSpendToneClass[data.aiSpendStatus.state]}`}
          >
            {isSpanish ? "Gasto AI" : "AI spend"}{" "}
            {formatUsd(data.aiSpendStatus.totalCostUsd)} /{" "}
            {formatUsd(data.aiSpendStatus.maxCostUsd)}
          </span>
          <button
            type="button"
            onClick={() => void generateBrief()}
            disabled={isGeneratingBrief}
            className="inline-flex h-11 items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--anden-lime)] px-4 text-sm font-semibold text-[var(--anden-brown-dark)]"
          >
            <span>
              {isGeneratingBrief
                ? isSpanish
                  ? "Generando brief..."
                  : "Generating brief..."
                : isSpanish
                ? "Generar brief operativo semanal"
                : "Generate Weekly Operating Brief"}
            </span>
            <ArrowRight size={17} aria-hidden />
          </button>
        </div>
      </div>

      {briefError ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--anden-orange)] p-4 text-sm font-semibold text-[var(--anden-brown-dark)]">
          {briefError}
        </div>
      ) : null}

      {brief ? (
        <GeneratedBriefPanel brief={brief} isSpanish={isSpanish} />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {data.metrics.map((metric) => (
          <article
            key={metric.label.en}
            className="min-h-28 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4"
          >
            <div
              className={`mb-4 inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${toneClass[metric.tone]}`}
            >
              {metric.value} {metric.label[locale]}
            </div>
            <p className="text-3xl font-semibold text-[var(--color-ink)]">
              {metric.value}
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--color-muted)]">
              {metric.label[locale]}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <SectionHeader
            icon={<Sparkles size={18} aria-hidden />}
            title={isSpanish ? "Pulso operativo AI" : "AI Operating Pulse"}
            description={
              isSpanish
                ? "Resumen mock de señales operativas listas para ser reemplazadas por datos persistidos."
                : "Mock signal summary ready to be replaced by persisted operating data."
            }
          />
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <PulseCard
              icon={<Building2 size={16} aria-hidden />}
              title="Pipeline"
              body={
                isSpanish
                  ? "3 cuentas de alta prioridad necesitan próximo paso esta semana."
                  : "3 high-priority accounts need a next step this week."
              }
            />
            <PulseCard
              icon={<Scale size={16} aria-hidden />}
              title={
                isSpanish ? "Requiere revision legal" : "Legal review required"
              }
              body={
                isSpanish
                  ? "Checklist fintech y memo ARCA marcados para revisión."
                  : "Fintech checklist and ARCA memo are flagged for review."
              }
            />
            <PulseCard
              icon={<Bot size={16} aria-hidden />}
              title={
                isSpanish
                  ? `Presupuesto AI ${data.aiSpendStatus.state}`
                  : `AI budget ${data.aiSpendStatus.state}`
              }
              body={
                isSpanish
                  ? `${Math.round(data.aiSpendStatus.percentUsed * 100)}% del presupuesto usado; hard-stop en ${formatUsd(data.aiSpendStatus.maxCostUsd)}.`
                  : `${Math.round(data.aiSpendStatus.percentUsed * 100)}% of budget used; hard stop at ${formatUsd(data.aiSpendStatus.maxCostUsd)}.`
              }
            />
          </div>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <SectionHeader
            icon={<AlertTriangle size={18} aria-hidden />}
            title={isSpanish ? "Alertas" : "Alerts"}
            description={
              isSpanish
                ? "Bloqueos y puntos de revisión para mantener la demo operativa."
                : "Blockers and review points that keep the demo operational."
            }
          />
          <div className="mt-5 space-y-3">
            {data.alerts.map((alert) => (
              <div
                key={alert}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm font-medium text-[var(--color-ink)]"
              >
                {alert}
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <SectionHeader
            icon={<Handshake size={18} aria-hidden />}
            title={isSpanish ? "Pipeline prioritario" : "Priority Pipeline"}
            description={
              isSpanish
                ? "Empresas mockeadas con siguiente acción recomendada por AI."
                : "Mock companies with AI-recommended next actions."
            }
          />
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)]">
            {data.pipeline.map((company) => (
              <div
                key={company.company}
                className="grid gap-3 border-b border-[var(--color-border)] bg-[var(--color-canvas)] p-4 last:border-b-0 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--color-ink)]">
                      {company.company}
                    </h3>
                    <span className="rounded-lg bg-[var(--anden-lime)] px-2 py-1 text-xs font-bold text-[var(--anden-brown-dark)]">
                      {company.priority}
                    </span>
                    <span className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-semibold text-[var(--color-muted)]">
                      {company.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {company.sector} · {company.nextAction}
                  </p>
                </div>
                <div className="min-w-36">
                  <p className="text-right text-sm font-semibold text-[var(--color-ink)]">
                    {company.readiness}%{" "}
                    {isSpanish ? "preparacion" : "readiness"}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--anden-blue)]"
                      style={{ width: `${company.readiness}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
            <SectionHeader
              icon={<Bot size={18} aria-hidden />}
              title={isSpanish ? "Consultas AI recientes" : "Recent AI queries"}
              description={
                isSpanish
                  ? "Preguntas usadas para validar el golden path del assistant."
                  : "Questions used to validate the assistant golden path."
              }
            />
            <div className="mt-5 space-y-3">
              {data.recentQueries.map((query) => (
                <p
                  key={query}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm leading-6 text-[var(--color-ink)]"
                >
                  {query}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
            <SectionHeader
              icon={<Clock3 size={18} aria-hidden />}
              title={isSpanish ? "Workflows activos" : "Active workflows"}
              description={
                isSpanish
                  ? "Estado visible de procesos simulados para la demo."
                  : "Visible state of simulated demo processes."
              }
            />
            <div className="mt-5 space-y-4">
              {data.workflows.map((workflow) => (
                <div key={workflow.name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {workflow.name}
                    </span>
                    <span className="text-[var(--color-muted)]">
                      {workflow.state}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--anden-orange)]"
                      style={{ width: `${workflow.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function GeneratedBriefPanel({
  brief,
  isSpanish
}: {
  brief: WeeklyOperatingBrief;
  isSpanish: boolean;
}) {
  const briefLabels = {
    progress: isSpanish ? "Avances" : "Progress",
    risks: isSpanish ? "Riesgos clave" : "Key risks",
    opportunities: isSpanish ? "Oportunidades" : "Opportunities",
    blockers: isSpanish ? "Bloqueos" : "Blockers",
    nextActions: isSpanish
      ? "Proximas acciones recomendadas"
      : "Recommended next actions",
    legalItems: isSpanish
      ? "Items para revision legal"
      : "Legal review items",
    sources: isSpanish ? "Citas de fuentes" : "Source citations"
  };

  return (
    <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {isSpanish ? "Brief generado" : "Generated Weekly Operating Brief"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
            {brief.title}
          </h2>
          <p className="mt-2 text-sm font-medium text-[var(--color-muted)]">
            {brief.provider}/{brief.model} · {formatUsd(brief.estimatedCostUsd)}
          </p>
        </div>
        {brief.legalReviewRequired ? (
          <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--anden-orange)] px-3 py-2 text-sm font-bold text-[var(--anden-brown-dark)]">
            <Scale size={16} aria-hidden />
            {isSpanish ? "Revisión de Legal" : "Legal review items"}
          </div>
        ) : null}
      </div>

      <p className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm leading-6 text-[var(--color-ink)]">
        {brief.content.executiveSummary}
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <BriefList title={briefLabels.progress} items={brief.content.progress} />
        <BriefList title={briefLabels.risks} items={brief.content.keyRisks} />
        <BriefList
          title={briefLabels.opportunities}
          items={brief.content.opportunities}
        />
        <BriefList title={briefLabels.blockers} items={brief.content.blockers} />
        <BriefList
          title={briefLabels.nextActions}
          items={brief.content.recommendedNextActions}
        />
        <BriefList
          title={briefLabels.legalItems}
          items={brief.content.legalReviewItems}
        />
      </div>

      <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
        <h3 className="text-sm font-bold text-[var(--color-ink)]">
          {briefLabels.sources}
        </h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {brief.citations.map((citation) => (
            <div
              key={citation.chunkId}
              className="rounded-xl border border-[var(--color-border)] p-3"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {citation.documentTitle}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">
                {citation.section} · {Math.round(citation.confidence * 100)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function BriefList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
      <h3 className="text-sm font-bold text-[var(--color-ink)]">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[var(--color-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--anden-cream-light)]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function PulseCard({
  icon,
  title,
  body
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
        <CheckCircle2 size={16} className="text-[var(--anden-lime)]" aria-hidden />
        {icon}
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{body}</p>
    </div>
  );
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
