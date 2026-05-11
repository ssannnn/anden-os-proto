"use client";

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
import { useLocale } from "../shell/locale-context";

const metrics = [
  {
    value: "12",
    label: { en: "companies tracked", es: "empresas registradas" },
    tone: "blue"
  },
  {
    value: "4",
    label: { en: "institutional partners", es: "partners institucionales" },
    tone: "lime"
  },
  {
    value: "37",
    label: { en: "documents indexed", es: "documentos indexados" },
    tone: "orange"
  },
  {
    value: "8",
    label: { en: "pending workflows", es: "workflows pendientes" },
    tone: "sky"
  },
  {
    value: "92%",
    label: { en: "AI retrieval confidence", es: "confianza de retrieval AI" },
    tone: "periwinkle"
  },
  {
    value: "14",
    label: { en: "hours saved this week", es: "horas ahorradas esta semana" },
    tone: "brown"
  }
] as const;

const pipeline = [
  {
    company: "AtlasPay",
    sector: "Fintech",
    status: "Interested",
    priority: "High",
    nextAction: "Schedule regulatory onboarding call",
    readiness: 84
  },
  {
    company: "Civitas Cloud",
    sector: "GovTech",
    status: "Briefing",
    priority: "Medium",
    nextAction: "Send digital zone benefits memo",
    readiness: 72
  },
  {
    company: "LedgerGrid",
    sector: "Infrastructure",
    status: "Qualification",
    priority: "High",
    nextAction: "Validate Knowledge Economy fit",
    readiness: 68
  }
];

const alerts = [
  "Legal review required for fintech onboarding checklist",
  "ARCA Free Zone source pack needs final citation check",
  "Government stakeholder briefing due tomorrow"
];

const recentQueries = [
  "What documents should we request from a new fintech company?",
  "Which partners are most relevant for fintech companies?",
  "Summarize requirements for Argentina digital zone readiness."
];

const workflows = [
  { name: "Company onboarding", state: "Waiting documents", progress: 64 },
  { name: "Prepare meeting", state: "Brief draft ready", progress: 82 },
  { name: "Publish institutional content", state: "Outline generated", progress: 46 }
];

const toneClass = {
  blue: "bg-[var(--anden-blue)] text-white",
  lime: "bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]",
  orange: "bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]",
  sky: "bg-[var(--anden-sky)] text-[var(--anden-brown-dark)]",
  periwinkle: "bg-[var(--anden-periwinkle)] text-white",
  brown: "bg-[var(--color-ink)] text-[var(--anden-cream-light)]"
} as const;

export function DashboardView() {
  const { locale } = useLocale();
  const isSpanish = locale === "es";

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
        <button
          type="button"
          className="inline-flex h-11 items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--anden-lime)] px-4 text-sm font-semibold text-[var(--anden-brown-dark)]"
        >
          <span>
            {isSpanish
              ? "Generar brief operativo semanal"
              : "Generate Weekly Operating Brief"}
          </span>
          <ArrowRight size={17} aria-hidden />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
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
              title="Legal review required"
              body={
                isSpanish
                  ? "Checklist fintech y memo ARCA marcados para revisión."
                  : "Fintech checklist and ARCA memo are flagged for review."
              }
            />
            <PulseCard
              icon={<Bot size={16} aria-hidden />}
              title="AI retrieval"
              body={
                isSpanish
                  ? "Confianza promedio 92% en consultas internas recientes."
                  : "Average 92% confidence across recent internal queries."
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
            {alerts.map((alert) => (
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
            {pipeline.map((company) => (
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
                    {company.readiness}% readiness
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
              {recentQueries.map((query) => (
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
              {workflows.map((workflow) => (
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
