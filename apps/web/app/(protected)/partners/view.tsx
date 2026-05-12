"use client";

import type { Partner } from "@anden/db";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";
import { useLocale } from "../shell/locale-context";

type PartnerFilters = {
  sector?: string;
  type?: string;
};

const copy = {
  en: {
    eyebrow: "Ecosystem",
    title: "Partners",
    description:
      "Map institutional and operational partners by relevance, sector, recommended use case, and AI partner fit.",
    metric: "4 institutional partners",
    sector: "Sector",
    type: "Type",
    all: "All",
    apply: "Apply filters",
    empty: "No partners match the current filters.",
    fintechRelevance: "Fintech relevance",
    fintechRelevant: "Relevant for fintech companies",
    institutionalRelevant: "Relevant for institutional operations",
    recommendedUseCase: "Recommended use case"
  },
  es: {
    eyebrow: "Ecosistema",
    title: "Partners",
    description:
      "Mapeo de partners institucionales y operativos por relevancia, sector, caso de uso recomendado y fit AI.",
    metric: "4 partners institucionales",
    sector: "Sector",
    type: "Tipo",
    all: "Todos",
    apply: "Aplicar filtros",
    empty: "Ningun partner coincide con los filtros actuales.",
    fintechRelevance: "Relevancia fintech",
    fintechRelevant: "Relevante para empresas fintech",
    institutionalRelevant: "Relevante para operaciones institucionales",
    recommendedUseCase: "Caso de uso recomendado"
  }
} as const;

export function PartnersView({
  partners,
  filters
}: {
  partners: Partner[];
  filters: PartnerFilters;
}) {
  const { locale } = useLocale();
  const t = copy[locale];
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
          options={partnerSectors}
          allLabel={t.all}
        />
        <SelectFilter
          label={t.type}
          name="type"
          value={filters.type}
          options={partnerTypes}
          allLabel={t.all}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
        >
          {t.apply}
        </button>
      </form>

      {filteredPartners.length === 0 ? (
        <EmptyState message={t.empty} />
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
                    {t.fintechRelevance}: {partner.fintechRelevance}%
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                {partner.linkedSectors.includes("Fintech")
                  ? t.fintechRelevant
                  : t.institutionalRelevant}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {partner.aiSummary}
              </p>
              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {t.recommendedUseCase}
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
