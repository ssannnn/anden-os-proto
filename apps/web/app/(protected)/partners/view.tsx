import type { Partner } from "@anden/db";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";

type PartnerFilters = {
  sector?: string;
  type?: string;
};

export function PartnersView({
  partners,
  filters
}: {
  partners: Partner[];
  filters: PartnerFilters;
}) {
  const partnerSectors = uniqueValues(
    partners.flatMap((partner) => partner.linkedSectors)
  );
  const partnerTypes = uniqueValues(partners.map((partner) => partner.type));

  const filteredPartners = partners.filter((partner) => {
    const sectorMatch =
      !filters.sector ||
      filters.sector === "All" ||
      partner.linkedSectors.includes(filters.sector);
    const typeMatch =
      !filters.type || filters.type === "All" || partner.type === filters.type;

    return sectorMatch && typeMatch;
  });

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Ecosystem"
        title="Partners"
        description="Map institutional and operational partners by relevance, sector, recommended use case, and AI partner fit."
        metric="4 institutional partners"
      />

      <form className="flex flex-wrap items-end gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
        <SelectFilter
          label="Sector"
          name="sector"
          value={filters.sector}
          options={partnerSectors}
        />
        <SelectFilter
          label="Type"
          name="type"
          value={filters.type}
          options={partnerTypes}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
        >
          Apply filters
        </button>
      </form>

      {filteredPartners.length === 0 ? (
        <EmptyState message="No partners match the current filters." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredPartners.map((partner) => (
            <article
              key={partner.slug}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DetailLink href={`/partners/${partner.slug}`}>
                    {partner.name}
                  </DetailLink>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {partner.type} · {partner.country}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="lime">{partner.relevance}</Badge>
                  <Badge tone="blue">
                    Fintech relevance: {partner.fintechRelevance}%
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                {partner.linkedSectors.includes("Fintech")
                  ? "Relevant for fintech companies"
                  : "Relevant for institutional operations"}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {partner.aiSummary}
              </p>
              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Recommended use case
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
                  {partner.recommendedUseCases[0]}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}
