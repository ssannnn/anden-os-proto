import { describe, expect, it } from "vitest";
import { answerAssistantQuestion, type AssistantAiClient } from "./index";

describe("AI Knowledge Assistant", () => {
  it("answers the value proposition golden prompt with cited internal sources", async () => {
    const result = await answerAssistantQuestion({
      question: "What is Anden's value proposition?",
      locale: "en",
      chunks: [
        {
          chunkId: "anden-value-proposition:000",
          chunkIndex: 0,
          documentSlug: "anden-value-proposition",
          documentTitle: "Anden Value Proposition",
          sourcePackPath:
            "supabase/seed/source-pack/internal/anden-value-proposition.md",
          sourceType: "internal_memo",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Core Message",
          content:
            "Anden OS is an internal AI backoffice for operating knowledge, partners, companies, documents, processes, and decisions.",
          tokenCount: 30,
          sourcePackVersion: "2026-05-11.mock-v1",
          legalReviewRequired: false,
          embedding: [1, 0, 0]
        }
      ],
      aiClient: fakeAiClient()
    });

    expect(result.kind).toBe("answer");
    if (result.kind !== "answer") {
      throw new Error("Expected sourced assistant answer.");
    }
    expect(result.sourcedAnswer).toContain("internal AI backoffice");
    expect(result.operationalInference).toContain("founder");
    expect(result.legalReviewWarning).toBeUndefined();
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({
      documentTitle: "Anden Value Proposition",
      sourceType: "internal_memo",
      originalLanguage: "en",
      section: "Core Message"
    });
  });

  it("marks regulatory answers with legal review warning and original Spanish source metadata", async () => {
    const result = await answerAssistantQuestion({
      question: "Summarize the requirements for a company to join a digital zone.",
      locale: "en",
      chunks: [
        {
          chunkId: "argentina-knowledge-economy-law:000",
          chunkIndex: 0,
          documentSlug: "argentina-knowledge-economy-law",
          documentTitle: "Ley 27.506 - Régimen de Economía del Conocimiento",
          sourcePackPath:
            "supabase/seed/source-pack/regulations/argentina-knowledge-economy-law.md",
          sourceUrl:
            "https://www.argentina.gob.ar/normativa/nacional/ley-27506-324101/actualizacion",
          sourceType: "regulation",
          jurisdiction: "Argentina",
          originalLanguage: "es",
          section: "Operational Summary",
          content:
            "Companies should validate promoted activities, registration, fiscal status, and evidence for eligibility. Original regulatory source is Spanish.",
          tokenCount: 30,
          sourcePackVersion: "2026-05-11.mock-v1",
          legalReviewRequired: true,
          embedding: [1, 0, 0]
        }
      ],
      aiClient: fakeAiClient()
    });

    expect(result.kind).toBe("answer");
    if (result.kind !== "answer") {
      throw new Error("Expected regulatory assistant answer.");
    }
    expect(result.legalReviewRequired).toBe(true);
    expect(result.legalReviewWarning).toContain("Legal review");
    expect(result.operationalInference).toContain("operational draft");
    expect(result.citations[0]).toMatchObject({
      documentTitle: "Ley 27.506 - Régimen de Economía del Conocimiento",
      sourceUrl:
        "https://www.argentina.gob.ar/normativa/nacional/ley-27506-324101/actualizacion",
      sourceType: "regulation",
      jurisdiction: "Argentina",
      originalLanguage: "es"
    });
  });

  it("returns a knowledge gap instead of unsupported confidence", async () => {
    const result = await answerAssistantQuestion({
      question: "Does Anden guarantee payroll tax refunds in Brazil?",
      locale: "en",
      chunks: [
        {
          chunkId: "anden-value-proposition:000",
          chunkIndex: 0,
          documentSlug: "anden-value-proposition",
          documentTitle: "Anden Value Proposition",
          sourcePackPath:
            "supabase/seed/source-pack/internal/anden-value-proposition.md",
          sourceType: "internal_memo",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Core Message",
          content: "Anden OS centralizes internal operating knowledge.",
          tokenCount: 10,
          sourcePackVersion: "2026-05-11.mock-v1",
          legalReviewRequired: false,
          embedding: [1, 0, 0]
        }
      ],
      aiClient: fakeAiClient({ embedding: [0, 1, 0] })
    });

    expect(result.kind).toBe("knowledge_gap");
    if (result.kind !== "knowledge_gap") {
      throw new Error("Expected knowledge gap.");
    }
    expect(result.sourcedAnswer).toContain("not have enough indexed");
    expect(result.citations).toEqual([]);
    expect(result.legalReviewRequired).toBe(false);
    expect(result.confidence).toBe(0);
  });

  it("returns a knowledge gap when the requested jurisdiction is not sourced", async () => {
    const result = await answerAssistantQuestion({
      question: "Does Anden guarantee payroll tax refunds in Brazil?",
      locale: "en",
      chunks: [
        {
          chunkId: "argentina-knowledge-economy-law:000",
          chunkIndex: 0,
          documentSlug: "argentina-knowledge-economy-law",
          documentTitle: "Ley 27.506 - Régimen de Economía del Conocimiento",
          sourcePackPath:
            "supabase/seed/source-pack/regulations/argentina-knowledge-economy-law.md",
          sourceType: "regulation",
          jurisdiction: "Argentina",
          originalLanguage: "es",
          section: "Operational Summary",
          content:
            "Argentina rules include fiscal status, promoted activities, and tax-related operational review.",
          tokenCount: 20,
          sourcePackVersion: "2026-05-11.mock-v1",
          legalReviewRequired: true,
          embedding: [1, 0, 0]
        }
      ],
      aiClient: fakeAiClient()
    });

    expect(result.kind).toBe("knowledge_gap");
    if (result.kind !== "knowledge_gap") {
      throw new Error("Expected jurisdiction knowledge gap.");
    }
    expect(result.knowledgeGap.reason).toContain("jurisdiction");
  });

  it("answers Spanish golden prompts in Spanish with citations", async () => {
    const result = await answerAssistantQuestion({
      question: "¿Qué documentos deberíamos pedirle a una nueva empresa fintech?",
      locale: "es",
      chunks: [
        {
          chunkId: "digital-zone-company-onboarding-faq:000",
          chunkIndex: 0,
          documentSlug: "digital-zone-company-onboarding-faq",
          documentTitle: "Digital Zone Company Onboarding FAQ",
          sourcePackPath:
            "supabase/seed/source-pack/internal/digital-zone-company-onboarding-faq.md",
          sourceType: "internal_memo",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Company Intake Checklist",
          content:
            "Request incorporation and tax documents, product description, sector description, compliance context, and regulatory context.",
          tokenCount: 25,
          sourcePackVersion: "2026-05-11.mock-v1",
          legalReviewRequired: false,
          embedding: [1, 0, 0]
        }
      ],
      aiClient: fakeAiClient()
    });

    expect(result.kind).toBe("answer");
    if (result.kind !== "answer") {
      throw new Error("Expected Spanish assistant answer.");
    }
    expect(result.sourcedAnswer).toContain("Según");
    expect(result.operationalInference).toContain("borrador interno");
    expect(result.citations).toHaveLength(1);
  });
});

function fakeAiClient({ embedding = [1, 0, 0] }: { embedding?: number[] } = {}): AssistantAiClient {
  return {
    async embedTexts() {
      return {
        embeddings: [embedding],
        provider: "mock",
        requestedProvider: "mock",
        model: "mock-embedding-1536",
        usage: {
          feature: "rag_retrieval",
          provider: "mock",
          requestedProvider: "mock",
          model: "mock-embedding-1536",
          inputTokens: 10,
          outputTokens: 0,
          estimatedCostUsd: 0,
          locale: "en",
          createdAt: "2026-05-11T00:00:00.000Z",
          warningState: "normal"
        }
      };
    },
    async generateText() {
      return {
        text: "Mock fallback should be replaced by deterministic golden answer.",
        provider: "mock",
        requestedProvider: "mock",
        model: "mock-deterministic",
        usage: {
          feature: "assistant",
          provider: "mock",
          requestedProvider: "mock",
          model: "mock-deterministic",
          inputTokens: 10,
          outputTokens: 10,
          estimatedCostUsd: 0,
          locale: "en",
          createdAt: "2026-05-11T00:00:00.000Z",
          warningState: "normal"
        }
      };
    }
  };
}
