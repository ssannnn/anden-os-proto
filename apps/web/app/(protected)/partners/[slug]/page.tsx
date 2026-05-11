import { notFound } from "next/navigation";
import { getPartnerData } from "../../data/demo-repository";
import { BackLink, Badge } from "../../crm/ui";

export default async function PartnerDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: partner } = await getPartnerData(slug);

  if (!partner) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <BackLink href="/partners">Partners</BackLink>

      <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
              Partner profile
            </p>
            <h1 className="brand-heading mt-3 text-4xl font-semibold text-[var(--color-ink)]">
              {partner.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="lime">{partner.relevance}</Badge>
              <Badge>Partner type: {partner.type}</Badge>
              <Badge tone="blue">
                Fintech relevance: {partner.fintechRelevance}%
              </Badge>
              <Badge>Country: {partner.country}</Badge>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--anden-lime)] px-4 py-3 text-sm font-bold text-[var(--anden-brown-dark)]">
            Relevant for fintech companies
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <InfoCard
            label="Linked sectors"
            value={partner.linkedSectors.join(", ")}
          />
          <InfoCard label="Last interaction" value={partner.lastInteraction} />
          <InfoCard label="Next step" value={partner.nextStep} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            AI summary
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
            {partner.aiSummary}
          </p>
          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Documents associated
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
              {partner.documents.join(", ")}
            </p>
          </div>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            Recommended use cases
          </p>
          <div className="mt-4 space-y-3">
            {partner.recommendedUseCases.map((useCase) => (
              <div
                key={useCase}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm font-semibold text-[var(--color-ink)]"
              >
                {useCase}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
        {label}: {value}
      </p>
    </div>
  );
}
