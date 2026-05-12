import { describe, expect, it } from "vitest";
import {
  chunkSourcePackDocument,
  indexSourcePackDocuments,
  retrieveRelevantChunks,
  type SourcePackChunk
} from "./index";

describe("source-pack chunking", () => {
  it("preserves stable source metadata and original-language section details", () => {
    const chunks = chunkSourcePackDocument({
      sourcePackVersion: "2026-05-11.mock-v1",
      document: {
        slug: "argentina-free-zones-law-24331",
        title: "Ley 24.331 - Zonas Francas",
        path: "regulations/argentina-free-zones-law-24331.md",
        sourceUrl: "https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto",
        sourceType: "regulation",
        jurisdiction: "Argentina",
        language: "es",
        retrievedAt: "2026-05-11",
        legalReviewRequired: true
      },
      markdown: `---
title: Ley 24.331 - Zonas Francas
slug: argentina-free-zones-law-24331
source_url: https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto
source_type: regulation
jurisdiction: Argentina
language: es
retrieved_at: 2026-05-11
legal_review_required: true
---

# Operational Summary

Official operational summary for internal review.

## Articulo 4 - Actividades

El texto original en espanol debe conservarse cuando el retrieval cite normativa.
`
    });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toMatchObject({
      chunkId: "argentina-free-zones-law-24331:000",
      chunkIndex: 0,
      documentSlug: "argentina-free-zones-law-24331",
      documentTitle: "Ley 24.331 - Zonas Francas",
      sourcePackPath: "supabase/seed/source-pack/regulations/argentina-free-zones-law-24331.md",
      sourceUrl: "https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto",
      sourceType: "regulation",
      jurisdiction: "Argentina",
      originalLanguage: "es",
      section: "Operational Summary",
      article: undefined,
      sourcePackVersion: "2026-05-11.mock-v1",
      legalReviewRequired: true
    });
    expect(chunks[1]).toMatchObject({
      chunkId: "argentina-free-zones-law-24331:001",
      section: "Articulo 4 - Actividades",
      article: "Articulo 4",
      originalLanguage: "es"
    });
    expect(chunks[1]?.content).toContain("texto original en espanol");
  });

  it("indexes chunks with embeddings returned by the configured embedding provider", async () => {
    const chunks = await indexSourcePackDocuments({
      sourcePackVersion: "2026-05-11.mock-v1",
      documents: [
        {
          document: {
            slug: "anden-value-proposition",
            title: "Anden Value Proposition",
            path: "internal/anden-value-proposition.md",
            sourceType: "internal_memo",
            jurisdiction: "Internal",
            language: "en",
            retrievedAt: "2026-05-11",
            legalReviewRequired: false
          },
          markdown: `# Operational Summary

Anden OS centralizes company and partner context.
`
        }
      ],
      embedTexts: async ({ texts }) => ({
        embeddings: texts.map((_, index) => [index, 1, 0])
      })
    });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      chunkId: "anden-value-proposition:000",
      embedding: [0, 1, 0],
      sourceType: "internal_memo",
      originalLanguage: "en"
    });
  });

  it("retrieves relevant chunks with source-aware citation metadata", async () => {
    const result = await retrieveRelevantChunks({
      query: "What is Anden's value proposition?",
      chunks: [
        sourceChunk({
          chunkId: "anden-value-proposition:000",
          documentSlug: "anden-value-proposition",
          documentTitle: "Anden Value Proposition",
          sourceType: "internal_memo",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Core Message",
          content: "Anden OS gives founders operational leverage.",
          embedding: [1, 0, 0]
        }),
        sourceChunk({
          chunkId: "digital-zone-company-onboarding-faq:000",
          documentSlug: "digital-zone-company-onboarding-faq",
          documentTitle: "Digital Zone Company Onboarding FAQ",
          sourceType: "internal_memo",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Company Intake Checklist",
          content: "Request incorporation and tax documents.",
          embedding: [0, 1, 0]
        })
      ],
      embedTexts: async () => ({ embeddings: [[1, 0, 0]] }),
      limit: 1
    });

    expect(result.kind).toBe("sources_found");
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({
      chunkId: "anden-value-proposition:000",
      documentTitle: "Anden Value Proposition",
      sourceUrl: "https://anden.test/source",
      sourceType: "internal_memo",
      jurisdiction: "Internal",
      section: "Core Message",
      originalLanguage: "en"
    });
    expect(result.citations[0]?.confidence).toBeGreaterThan(0.9);
  });

  it("returns a knowledge gap when retrieval quality is below threshold", async () => {
    const result = await retrieveRelevantChunks({
      query: "Does Anden provide audited payroll tax guarantees in Brazil?",
      chunks: [
        sourceChunk({
          chunkId: "anden-value-proposition:000",
          content: "Anden OS centralizes internal company and partner context.",
          embedding: [1, 0, 0]
        })
      ],
      embedTexts: async () => ({ embeddings: [[0, 1, 0]] }),
      minConfidence: 0.4
    });

    expect(result).toEqual({
      kind: "knowledge_gap",
      query: "Does Anden provide audited payroll tax guarantees in Brazil?",
      citations: [],
      reason: "No indexed source chunk met the retrieval confidence threshold."
    });
  });
});

function sourceChunk(overrides: Partial<SourcePackChunk>): SourcePackChunk {
  return {
    chunkId: "document:000",
    chunkIndex: 0,
    documentSlug: "document",
    documentTitle: "Document",
    sourcePackPath: "supabase/seed/source-pack/internal/document.md",
    sourceUrl: "https://anden.test/source",
    sourceType: "internal_memo",
    jurisdiction: "Internal",
    originalLanguage: "en",
    section: "Operational Summary",
    content: "Content",
    tokenCount: 10,
    sourcePackVersion: "2026-05-11.mock-v1",
    legalReviewRequired: false,
    embedding: [1, 0, 0],
    ...overrides
  };
}
