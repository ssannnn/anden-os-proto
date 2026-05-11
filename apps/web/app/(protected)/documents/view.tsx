import { Upload } from "lucide-react";
import {
  documentJurisdictions,
  documentStatuses,
  documentTypes,
  documents
} from "./mock-data";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";

type DocumentFilters = {
  type?: string;
  jurisdiction?: string;
  status?: string;
};

export function DocumentsView({ filters }: { filters: DocumentFilters }) {
  const filteredDocuments = documents.filter((document) => {
    return (
      matches(document.type, filters.type) &&
      matches(document.jurisdiction, filters.jurisdiction) &&
      matches(document.indexStatus, filters.status)
    );
  });

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Knowledge base"
        title="Documents"
        description="Operate a cited internal knowledge layer with source metadata, index status, legal review flags, and AI-ready document intelligence."
        metric="37 documents indexed"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
        <form className="flex flex-wrap items-end gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
          <SelectFilter
            label="Type"
            name="type"
            value={filters.type}
            options={documentTypes}
          />
          <SelectFilter
            label="Jurisdiction"
            name="jurisdiction"
            value={filters.jurisdiction}
            options={documentJurisdictions}
          />
          <SelectFilter
            label="Status"
            name="status"
            value={filters.status}
            options={documentStatuses}
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
          >
            Apply filters
          </button>
        </form>

        <aside className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--anden-lime)] p-3 text-[var(--anden-brown-dark)]">
              <Upload size={20} aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
                Simulated upload
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Drop intake PDFs here in the real product. For this demo, upload
                is visual only and all document intelligence uses seeded data.
              </p>
              <button
                type="button"
                className="mt-4 h-10 rounded-xl border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-ink)]"
              >
                Upload document
              </button>
            </div>
          </div>
        </aside>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState message="No documents match the current filters." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredDocuments.map((document) => (
            <article
              key={document.slug}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <DetailLink href={`/documents/${document.slug}`}>
                    {document.title}
                  </DetailLink>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {document.type} · {document.jurisdiction} ·{" "}
                    {document.sourceLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={document.indexStatus === "Indexed" ? "lime" : "neutral"}>
                    {document.indexStatus}
                  </Badge>
                  {document.legalReviewRequired ? (
                    <Badge tone="orange">Legal review required</Badge>
                  ) : (
                    <Badge>Internal mock</Badge>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--color-ink)]">
                {document.summary}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Metadata label="Updated" value={document.updatedAt} />
                <Metadata
                  label="Retrieved"
                  value={document.retrievedAt ?? "Internal seed"}
                />
                <Metadata label="Language" value={document.language} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

function matches(value: string, filter?: string) {
  return !filter || filter === "All" || value === filter;
}
