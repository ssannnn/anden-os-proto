import { notFound } from "next/navigation";
import { findCompany } from "../../crm/mock-data";
import { BackLink, Badge } from "../../crm/ui";

export default async function CompanyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = findCompany(slug);

  if (!company) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <BackLink href="/companies">Companies</BackLink>

      <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
              Company profile
            </p>
            <h1 className="brand-heading mt-3 text-4xl font-semibold text-[var(--color-ink)]">
              {company.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="lime">Priority: {company.priority}</Badge>
              <Badge>Status: {company.status}</Badge>
              <Badge tone="blue">Sector: {company.sector}</Badge>
              <Badge>Country: {company.country}</Badge>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--anden-lime)] px-4 py-3 text-sm font-bold text-[var(--anden-brown-dark)]">
            Digital Zone Readiness {company.readiness}%
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <InfoCard label="Last interaction" value={company.lastInteraction} />
          <InfoCard label="Next step" value={company.nextStep} />
          <InfoCard
            label="Relevant partners"
            value={company.partnerRelevance.join(", ")}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            AI summary
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
            {company.aiSummary}
          </p>
          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              AI recommended action
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
              {company.aiRecommendedAction}
            </p>
          </div>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            Documents associated
          </p>
          <div className="mt-4 space-y-3">
            {company.documents.map((document) => (
              <div
                key={document}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm font-semibold text-[var(--color-ink)]"
              >
                {document}
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
