"use client";

import type { DocumentRecord } from "@anden/db";
import { Upload } from "lucide-react";
import { Badge, DetailLink, EmptyState, PageHeader, SelectFilter } from "../crm/ui";
import { useLocale } from "../shell/locale-context";

type DocumentFilters = {
  type?: string;
  jurisdiction?: string;
  status?: string;
};

const copy = {
  en: {
    eyebrow: "Knowledge base",
    title: "Documents",
    description:
      "Operate a cited internal knowledge layer with source metadata, index status, legal review flags, and AI-ready document intelligence.",
    metric: "37 documents indexed",
    type: "Type",
    jurisdiction: "Jurisdiction",
    status: "Status",
    all: "All",
    apply: "Apply filters",
    uploadEyebrow: "Simulated upload",
    uploadDescription:
      "Drop intake PDFs here in the real product. For this demo, upload is visual only and all document intelligence uses seeded data.",
    uploadButton: "Upload document",
    empty: "No documents match the current filters.",
    legalReviewRequired: "Legal review required",
    internalMock: "Internal mock",
    updated: "Updated",
    retrieved: "Retrieved",
    internalSeed: "Internal seed",
    language: "Language"
  },
  es: {
    eyebrow: "Base de conocimiento",
    title: "Documentos",
    description:
      "Opera una capa interna de conocimiento citado con metadata de fuente, estado de indexacion, flags de revision legal e inteligencia documental AI-ready.",
    metric: "37 documentos indexados",
    type: "Tipo",
    jurisdiction: "Jurisdiccion",
    status: "Estado",
    all: "Todos",
    apply: "Aplicar filtros",
    uploadEyebrow: "Carga simulada",
    uploadDescription:
      "En el producto real, aca se cargarian PDFs de intake. En esta demo, la carga es solo visual y la inteligencia documental usa datos seed.",
    uploadButton: "Subir documento",
    empty: "Ningun documento coincide con los filtros actuales.",
    legalReviewRequired: "Requiere revision legal",
    internalMock: "Mock interno",
    updated: "Actualizado",
    retrieved: "Recuperado",
    internalSeed: "Seed interno",
    language: "Idioma"
  }
} as const;

export function DocumentsView({
  documents,
  filters
}: {
  documents: DocumentRecord[];
  filters: DocumentFilters;
}) {
  const { locale } = useLocale();
  const t = copy[locale];
  const documentTypes = uniqueValues(documents.map((document) => document.type));
  const documentJurisdictions = uniqueValues(
    documents.map((document) => document.jurisdiction)
  );
  const documentStatuses = uniqueValues(
    documents.map((document) => document.indexStatus)
  );

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
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        metric={t.metric}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
        <form className="flex flex-wrap items-end gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
          <SelectFilter
            label={t.type}
            name="type"
            value={filters.type}
            options={documentTypes}
            allLabel={t.all}
          />
          <SelectFilter
            label={t.jurisdiction}
            name="jurisdiction"
            value={filters.jurisdiction}
            options={documentJurisdictions}
            allLabel={t.all}
          />
          <SelectFilter
            label={t.status}
            name="status"
            value={filters.status}
            options={documentStatuses}
            allLabel={t.all}
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-[var(--color-ink)] px-4 text-sm font-semibold text-[var(--anden-cream-light)]"
          >
            {t.apply}
          </button>
        </form>

        <aside className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--anden-lime)] p-3 text-[var(--anden-brown-dark)]">
              <Upload size={20} aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--anden-orange)]">
                {t.uploadEyebrow}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {t.uploadDescription}
              </p>
              <button
                type="button"
                className="mt-4 h-10 rounded-xl border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-ink)]"
              >
                {t.uploadButton}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState message={t.empty} />
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
                    <Badge tone="orange">{t.legalReviewRequired}</Badge>
                  ) : (
                    <Badge>{t.internalMock}</Badge>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--color-ink)]">
                {document.summary}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Metadata label={t.updated} value={document.updatedAt} />
                <Metadata
                  label={t.retrieved}
                  value={document.retrievedAt ?? t.internalSeed}
                />
                <Metadata label={t.language} value={document.language} />
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

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}
