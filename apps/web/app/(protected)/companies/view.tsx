"use client";

import type { Company } from "@anden/db";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";
import { useLocale } from "../shell/locale-context";

type CompanyFilters = {
  sector?: string;
  status?: string;
  country?: string;
  priority?: string;
};

const copy = {
  en: {
    eyebrow: "Pipeline",
    title: "Companies",
    description:
      "Track institutional leads with status, priority, next step, linked documents, AI summary, and AI recommended action.",
    metric: "12 companies tracked",
    sector: "Sector",
    status: "Status",
    country: "Country",
    priority: "Priority",
    all: "All",
    apply: "Apply filters",
    empty: "No companies match the current filters.",
    aiSummary: "AI summary",
    readiness: "readiness",
    aiRecommendation: "AI recommendation"
  },
  es: {
    eyebrow: "Pipeline",
    title: "Empresas",
    description:
      "Seguimiento de leads institucionales con estado, prioridad, proximo paso, documentos vinculados, resumen AI y accion recomendada por AI.",
    metric: "12 empresas monitoreadas",
    sector: "Sector",
    status: "Estado",
    country: "Pais",
    priority: "Prioridad",
    all: "Todos",
    apply: "Aplicar filtros",
    empty: "Ninguna empresa coincide con los filtros actuales.",
    aiSummary: "Resumen AI",
    readiness: "preparacion",
    aiRecommendation: "Recomendacion AI"
  }
} as const;

export function CompaniesView({
  companies,
  filters
}: {
  companies: Company[];
  filters: CompanyFilters;
}) {
  const { locale } = useLocale();
  const t = copy[locale];
  const companySectors = uniqueValues(companies.map((company) => company.sector));
  const companyStatuses = uniqueValues(companies.map((company) => company.status));
  const companyCountries = uniqueValues(companies.map((company) => company.country));
  const companyPriorities = uniqueValues(
    companies.map((company) => company.priority)
  );

  const filteredCompanies = companies.filter((company) => {
    return (
      matches(company.sector, filters.sector) &&
      matches(company.status, filters.status) &&
      matches(company.country, filters.country) &&
      matches(company.priority, filters.priority)
    );
  });

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        metric={t.metric}
      />

      <form className="flex flex-wrap items-end gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
        <SelectFilter
          label={t.sector}
          name="sector"
          value={filters.sector}
          options={companySectors}
          allLabel={t.all}
        />
        <SelectFilter
          label={t.status}
          name="status"
          value={filters.status}
          options={companyStatuses}
          allLabel={t.all}
        />
        <SelectFilter
          label={t.country}
          name="country"
          value={filters.country}
          options={companyCountries}
          allLabel={t.all}
        />
        <SelectFilter
          label={t.priority}
          name="priority"
          value={filters.priority}
          options={companyPriorities}
          allLabel={t.all}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
        >
          {t.apply}
        </button>
      </form>

      {filteredCompanies.length === 0 ? (
        <EmptyState message={t.empty} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredCompanies.map((company) => (
            <article
              key={company.slug}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DetailLink href={`/companies/${company.slug}`}>
                    {company.name}
                  </DetailLink>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {company.sector} · {company.country}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="lime">{company.priority}</Badge>
                  <Badge>{company.status}</Badge>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
                    {t.aiSummary}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
                    {company.aiSummary}
                  </p>
                </div>
                <div className="min-w-36">
                  <p className="text-right text-sm font-semibold text-[var(--color-ink)]">
                    {company.readiness}% {t.readiness}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--anden-blue)]"
                      style={{ width: `${company.readiness}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {t.aiRecommendation}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
                  {company.aiRecommendedAction}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function matches(value: string, filter?: string) {
  return !filter || filter === "All" || value === filter;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}
