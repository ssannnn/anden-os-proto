import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getDocumentData } from "../../data/demo-repository";
import { BackLink, Badge } from "../../crm/ui";

export default async function DocumentDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: document } = await getDocumentData(slug);

  if (!document) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <BackLink href="/documents">Documents</BackLink>

      <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
              Document intelligence
            </p>
            <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
              {document.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="blue">Type: {document.type}</Badge>
              <Badge>Jurisdiction: {document.jurisdiction}</Badge>
              <Badge tone={document.indexStatus === "Indexed" ? "lime" : "neutral"}>
                {document.indexStatus}
              </Badge>
              {document.legalReviewRequired ? (
                <Badge tone="orange">Legal review required</Badge>
              ) : (
                <Badge>Legal review not required</Badge>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--anden-lime)] px-4 py-3 text-sm font-bold text-[var(--anden-brown-dark)]">
            AI citation ready
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <InfoCard label="Source" value={document.sourceLabel} />
          <InfoCard label="Updated" value={document.updatedAt} />
          <InfoCard
            label="Retrieved"
            value={document.retrievedAt ?? "Internal seed"}
          />
          <InfoCard label="Language" value={document.language} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            Summary
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
            {document.summary}
          </p>

          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Source URL
            </p>
            {document.sourceUrl ? (
              <a
                href={document.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 break-all text-sm font-semibold leading-6 text-[var(--anden-blue)]"
              >
                {document.sourceUrl}
                <ExternalLink size={14} aria-hidden />
              </a>
            ) : (
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
                Internal source pack: {document.sourcePackPath}
              </p>
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
            AI use cases
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {document.aiUseCases.map((useCase) => (
              <Badge key={useCase} tone="lime">
                {useCase}
              </Badge>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Review guidance
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
              {document.legalReviewRequired
                ? "Legal review required before using this content in external advice, partner messages, or company onboarding claims. Original source in Spanish."
                : "Internal demo source. Use for product narrative and mock workflow behavior; cite legal-reviewed sources for regulatory claims."}
            </p>
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListCard title="Entities" items={document.entities} />
        <ListCard title="Risks" items={document.risks} />
        <ListCard title="Checklist" items={document.checklist} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListCard title="Linked companies" items={document.linkedCompanies} />
        <ListCard title="Linked partners" items={document.linkedPartners} />
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
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
        {label}: {value}
      </p>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm font-semibold leading-6 text-[var(--color-ink)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
