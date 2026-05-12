"use client";

import type { ReportRecord } from "@anden/db";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  FileText,
  Scale,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "../shell/locale-context";

type ReportsViewProps = {
  reports: ReportRecord[];
  dataModeLabel: string;
};

const copy = {
  en: {
    eyebrow: "Executive memory",
    title: "Reports",
    description:
      "Review generated weekly operating briefs with citations, legal review items, and estimated AI cost.",
    data: "Data",
    period: "Period",
    locale: "Locale",
    generated: "Generated",
    cost: "Estimated cost",
    legal: "Legal review required",
    noLegal: "Legal review not required",
    emptyTitle: "No weekly operating briefs yet",
    emptyBody:
      "Generate the first weekly operating brief from the dashboard to create report history.",
    open: "Open report",
    back: "Back to reports",
    executiveSummary: "Executive summary",
    progress: "Progress",
    keyRisks: "Key risks",
    opportunities: "Opportunities",
    blockers: "Blockers",
    recommendedNextActions: "Recommended next actions",
    legalReviewItems: "Legal review items",
    aiRecommendations: "AI recommendations",
    sourceCitations: "Source citations",
    copyReport: "Copy report text",
    copied: "Copied",
    downloadReport: "Download report text"
  },
  es: {
    eyebrow: "Memoria ejecutiva",
    title: "Reportes",
    description:
      "Revisa briefs operativos semanales con citas, revision legal y costo AI estimado.",
    data: "Datos",
    period: "Periodo",
    locale: "Idioma",
    generated: "Generado",
    cost: "Costo estimado",
    legal: "Requiere revision de Legal",
    noLegal: "No requiere revision de Legal",
    emptyTitle: "Todavia no hay briefs operativos",
    emptyBody:
      "Genera el primer brief operativo semanal desde el dashboard para crear historial.",
    open: "Abrir reporte",
    back: "Volver a reportes",
    executiveSummary: "Resumen ejecutivo",
    progress: "Avances",
    keyRisks: "Riesgos clave",
    opportunities: "Oportunidades",
    blockers: "Bloqueos",
    recommendedNextActions: "Proximas acciones recomendadas",
    legalReviewItems: "Items para Legal",
    aiRecommendations: "Recomendaciones AI",
    sourceCitations: "Citas de fuentes",
    copyReport: "Copiar texto del reporte",
    copied: "Copiado",
    downloadReport: "Descargar texto del reporte"
  }
} as const;

export function ReportsView({ reports, dataModeLabel }: ReportsViewProps) {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {t.eyebrow}
          </p>
          <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
            {t.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            {t.description}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 text-sm font-bold text-[var(--color-muted)]">
          {t.data}: {dataModeLabel}
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyReports title={t.emptyTitle} body={t.emptyBody} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {reports.map((report) => (
            <article
              key={report.slug}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <Link
                    href={`/reports/${report.slug}`}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--anden-blue)]"
                  >
                    {report.title}
                    <ArrowRight size={17} aria-hidden />
                  </Link>
                  <p className="mt-3 text-sm font-medium text-[var(--color-muted)]">
                    {t.period}: {formatDate(report.periodStart, locale)} -{" "}
                    {formatDate(report.periodEnd, locale)}
                  </p>
                </div>
                <StatusBadge
                  label={report.legalReviewRequired ? t.legal : t.noLegal}
                  tone={report.legalReviewRequired ? "orange" : "lime"}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetaItem label={t.locale} value={report.locale.toUpperCase()} />
                <MetaItem label={t.generated} value={formatDateTime(report.generatedAt)} />
                <MetaItem
                  label="Model"
                  value={`${report.provider ?? "unknown"}/${report.model ?? "unknown"}`}
                />
                <MetaItem label={t.cost} value={formatUsd(report.estimatedCostUsd)} />
              </div>

              <p className="mt-5 line-clamp-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm leading-6 text-[var(--color-ink)]">
                {summaryFor(report)}
              </p>

              <Link
                href={`/reports/${report.slug}`}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-white"
              >
                {t.open}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function ReportDetailView({
  report,
  dataModeLabel
}: {
  report: ReportRecord;
  dataModeLabel: string;
}) {
  const { locale } = useLocale();
  const t = copy[locale];
  const [copied, setCopied] = useState(false);
  const sections = reportSections(report, t);
  const exportText = reportToText(report, sections);

  async function copyReportText() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 xl:flex-row xl:items-start">
        <div className="max-w-3xl">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]"
          >
            <ArrowLeft size={16} aria-hidden />
            {t.back}
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {t.eyebrow}
          </p>
          <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
            {report.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-[var(--color-muted)]">
            {t.period}: {formatDate(report.periodStart, locale)} -{" "}
            {formatDate(report.periodEnd, locale)}
          </p>
        </div>
        <div className="grid gap-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 text-sm font-bold text-[var(--color-muted)]">
            {t.data}: {dataModeLabel}
          </div>
          {report.legalReviewRequired ? (
            <StatusBadge label={t.legal} tone="orange" />
          ) : (
            <StatusBadge label={t.noLegal} tone="lime" />
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MetaItem label={t.locale} value={report.locale.toUpperCase()} />
        <MetaItem label={t.generated} value={formatDateTime(report.generatedAt)} />
        <MetaItem
          label="Model"
          value={`${report.provider ?? "unknown"}/${report.model ?? "unknown"}`}
        />
        <MetaItem label={t.cost} value={formatUsd(report.estimatedCostUsd)} />
      </div>

      <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--anden-cream-light)]">
            <Sparkles size={18} aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            {t.executiveSummary}
          </h2>
        </div>
        <p className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm leading-6 text-[var(--color-ink)]">
          {summaryFor(report)}
        </p>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        {sections.map((section) => (
          <ReportSection
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>

      <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--anden-cream-light)]">
            <FileText size={18} aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            {t.sourceCitations}
          </h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {report.citations.map((citation, index) => {
            const source = citationRecord(citation);
            return (
              <div
                key={`${source.documentTitle}-${index}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {source.documentTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {source.section}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {source.sourcePackPath}
                </p>
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void copyReportText()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-white"
          >
            <Copy size={16} aria-hidden />
            {copied ? t.copied : t.copyReport}
          </button>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(exportText)}`}
            download={`${report.slug}.txt`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 text-sm font-semibold text-[var(--color-ink)]"
          >
            <Download size={16} aria-hidden />
            {t.downloadReport}
          </a>
        </div>
      </article>
    </section>
  );
}

function EmptyReports({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-8 text-center">
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
        {body}
      </p>
    </div>
  );
}

function StatusBadge({
  label,
  tone
}: {
  label: string;
  tone: "orange" | "lime";
}) {
  const className =
    tone === "orange"
      ? "bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]"
      : "bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${className}`}
    >
      <Scale size={15} aria-hidden />
      {label}
    </span>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
        {label}: {value}
      </p>
    </div>
  );
}

function ReportSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm leading-6 text-[var(--color-ink)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function reportSections(
  report: ReportRecord,
  t: (typeof copy)["en"] | (typeof copy)["es"]
) {
  return [
    { title: t.progress, items: contentArray(report.content, ["progress"]) },
    { title: t.keyRisks, items: contentArray(report.content, ["keyRisks", "risks"]) },
    {
      title: t.opportunities,
      items: contentArray(report.content, ["opportunities"])
    },
    { title: t.blockers, items: contentArray(report.content, ["blockers"]) },
    {
      title: t.recommendedNextActions,
      items: contentArray(report.content, ["recommendedNextActions", "next_steps"])
    },
    {
      title: t.legalReviewItems,
      items:
        contentArray(report.content, ["legalReviewItems"]).length > 0
          ? contentArray(report.content, ["legalReviewItems"])
          : report.legalReviewRequired
            ? ["Review legal-sensitive claims before external use."]
            : ["No legal review items flagged."]
    },
    {
      title: t.aiRecommendations,
      items: contentArray(report.content, ["aiRecommendations", "ai_recommendations"])
    }
  ].filter((section) => section.items.length > 0);
}

function summaryFor(report: ReportRecord) {
  const summary = report.content.executiveSummary;
  if (typeof summary === "string" && summary.trim()) {
    return summary;
  }

  return (
    contentArray(report.content, ["progress"])[0] ??
    "Weekly operating brief generated from Anden OS operating data."
  );
}

function contentArray(
  content: Record<string, unknown>,
  keys: string[]
): string[] {
  for (const key of keys) {
    const value = content[key];
    if (Array.isArray(value)) {
      return value.map(String).filter(Boolean);
    }
  }

  return [];
}

function citationRecord(citation: unknown) {
  if (typeof citation === "object" && citation) {
    const source = citation as Record<string, unknown>;
    return {
      documentTitle: String(source.documentTitle ?? "Source"),
      section: String(source.section ?? "Report citation"),
      sourcePackPath: String(source.sourcePackPath ?? "")
    };
  }

  return {
    documentTitle: "Source",
    section: "Report citation",
    sourcePackPath: ""
  };
}

function reportToText(
  report: ReportRecord,
  sections: Array<{ title: string; items: string[] }>
) {
  return [
    report.title,
    `Period: ${report.periodStart ?? ""} - ${report.periodEnd ?? ""}`,
    "",
    summaryFor(report),
    "",
    ...sections.flatMap((section) => [
      section.title,
      ...section.items.map((item) => `- ${item}`),
      ""
    ]),
    "Sources",
    ...report.citations.map((citation) => {
      const source = citationRecord(citation);
      return `- ${source.documentTitle} (${source.section})`;
    })
  ].join("\n");
}

function formatDate(value: string | undefined, locale: "en" | "es") {
  if (!value) {
    return "n/a";
  }

  return new Intl.DateTimeFormat(locale === "es" ? "en-US" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  }).format(new Date(value));
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
