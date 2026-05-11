import type { Company } from "@anden/db";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";

type CompanyFilters = {
  sector?: string;
  status?: string;
  country?: string;
  priority?: string;
};

export function CompaniesView({
  companies,
  filters
}: {
  companies: Company[];
  filters: CompanyFilters;
}) {
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
        eyebrow="Pipeline"
        title="Companies"
        description="Track institutional leads with status, priority, next step, linked documents, AI summary, and AI recommended action."
        metric="12 companies tracked"
      />

      <form className="flex flex-wrap items-end gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
        <SelectFilter
          label="Sector"
          name="sector"
          value={filters.sector}
          options={companySectors}
        />
        <SelectFilter
          label="Status"
          name="status"
          value={filters.status}
          options={companyStatuses}
        />
        <SelectFilter
          label="Country"
          name="country"
          value={filters.country}
          options={companyCountries}
        />
        <SelectFilter
          label="Priority"
          name="priority"
          value={filters.priority}
          options={companyPriorities}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
        >
          Apply filters
        </button>
      </form>

      {filteredCompanies.length === 0 ? (
        <EmptyState message="No companies match the current filters." />
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
                    AI summary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
                    {company.aiSummary}
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
              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  AI recommendation
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
