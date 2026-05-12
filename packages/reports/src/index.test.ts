import { describe, expect, it } from "vitest";
import {
  generateWeeklyOperatingBrief,
  type WeeklyBriefAiClient,
  type WeeklyBriefInput
} from "./index";

describe("weekly operating brief generator", () => {
  it("synthesizes operating data into a cited executive brief with AI metadata", async () => {
    const result = await generateWeeklyOperatingBrief({
      locale: "en",
      periodStart: "2026-05-05",
      periodEnd: "2026-05-12",
      dashboard: {
        alerts: ["Legal review required for fintech onboarding checklist"],
        recentQueries: ["What documents should we request from a new fintech company?"],
        metrics: [{ value: "12", label: { en: "companies tracked", es: "empresas registradas" } }],
        pipeline: [
          {
            company: "AtlasPay",
            sector: "Fintech",
            status: "Interested",
            priority: "High",
            nextAction: "Schedule regulatory onboarding call",
            readiness: 84
          }
        ],
        workflows: [
          { name: "Company onboarding", state: "Completed", progress: 100 }
        ],
        aiSpendStatus: {
          totalCostUsd: 0,
          maxCostUsd: 5,
          warningThresholdUsd: 4,
          percentUsed: 0,
          state: "normal"
        }
      },
      companies: [
        {
          name: "AtlasPay",
          sector: "Fintech",
          priority: "High",
          status: "Interested",
          nextStep: "Regulatory onboarding call",
          aiRecommendedAction:
            "Schedule regulatory onboarding call and send digital zone benefits brief."
        }
      ],
      partners: [
        {
          name: "Crecimiento",
          fintechRelevance: 94,
          recommendedUseCases: ["Introduce fintech leads."]
        }
      ],
      documents: [
        {
          title: "Argentina.gob.ar - Beneficios Economia del Conocimiento",
          legalReviewRequired: true,
          risks: ["Administrative forms and attachments can change."],
          checklist: ["Prepare declarations for R&D, training, sales, and exports."]
        }
      ],
      workflowRuns: [
        {
          workflowName: "Company onboarding",
          state: "Completed",
          progress: 100,
          outputs: {
            nextStep: "Schedule regulatory onboarding call",
            legalReviewRequired: true
          }
        }
      ],
      assistantMessages: [
        {
          role: "assistant",
          content: "Request incorporation and tax documents.",
          citations: [],
          confidence: 91,
          createdAt: "2026-05-12T00:00:00.000Z"
        }
      ],
      citations: [
        {
          chunkId: "weekly-operating-brief-template:000",
          documentSlug: "weekly-operating-brief-template",
          documentTitle: "Weekly Operating Brief Template",
          sourcePackPath:
            "supabase/seed/source-pack/internal/weekly-operating-brief-template.md",
          sourceType: "template",
          jurisdiction: "Internal",
          originalLanguage: "en",
          section: "Sections",
          excerpt: "Progress. Risks. Next steps. Opportunities. Blockers.",
          confidence: 0.91,
          legalReviewRequired: false
        },
        {
          chunkId: "argentina-knowledge-economy-registration:000",
          documentSlug: "argentina-knowledge-economy-registration",
          documentTitle: "Argentina.gob.ar - Beneficios Economia del Conocimiento",
          sourcePackPath:
            "supabase/seed/source-pack/regulations/argentina-knowledge-economy-registration.md",
          sourceUrl: "https://www.argentina.gob.ar/servicio/acceder-los-beneficios-del-regimen-de-promocion-de-la-economia-del-conocimiento",
          sourceType: "official_guidance",
          jurisdiction: "Argentina",
          originalLanguage: "es",
          section: "Operational Summary",
          excerpt: "Official registration guidance for accessing benefits.",
          confidence: 0.82,
          legalReviewRequired: true
        }
      ],
      aiClient: fakeAiClient()
    });

    expect(result).toMatchObject({
      slug: "weekly-operating-brief-2026-05-12",
      title: "Weekly Operating Brief - May 12, 2026",
      reportType: "weekly_operating_brief",
      status: "Generated",
      locale: "en",
      provider: "mock",
      model: "mock-deterministic",
      estimatedCostUsd: 0,
      legalReviewRequired: true
    });
    expect(result.content.executiveSummary).toContain("AtlasPay");
    expect(result.content.progress).toEqual(
      expect.arrayContaining(["Company onboarding completed at 100%."])
    );
    expect(result.content.keyRisks).toEqual(
      expect.arrayContaining([
        "Legal review required for fintech onboarding checklist"
      ])
    );
    expect(result.content.opportunities).toEqual(
      expect.arrayContaining([
        "Use Crecimiento for high-relevance fintech introductions."
      ])
    );
    expect(result.content.blockers).toEqual(
      expect.arrayContaining(["No explicit blockers are active in the demo data."])
    );
    expect(result.content.recommendedNextActions).toEqual(
      expect.arrayContaining([
        "Schedule regulatory onboarding call and send digital zone benefits brief."
      ])
    );
    expect(result.content.legalReviewItems).toEqual(
      expect.arrayContaining([
        "Review Argentina.gob.ar - Beneficios Economia del Conocimiento before external use."
      ])
    );
    expect(result.citations).toHaveLength(2);
  });

  it("preserves cost-guard fallback metadata from the AI provider", async () => {
    const result = await generateWeeklyOperatingBrief({
      ...briefInput(),
      aiClient: {
        async generateText(input) {
          return {
            text: "Budget exhausted mock fallback.",
            provider: "mock",
            requestedProvider: "openai",
            model: "mock-deterministic",
            usage: {
              feature: input.feature,
              provider: "mock",
              requestedProvider: "openai",
              model: "mock-deterministic",
              inputTokens: 120,
              outputTokens: 40,
              estimatedCostUsd: 0,
              locale: input.locale,
              createdAt: "2026-05-12T00:00:00.000Z",
              warningState: "blocked",
              fallbackReason: "budget_exhausted"
            }
          };
        }
      }
    });

    expect(result.provider).toBe("mock");
    expect(result.requestedProvider).toBe("openai");
    expect(result.warningState).toBe("blocked");
    expect(result.fallbackReason).toBe("budget_exhausted");
    expect(result.estimatedCostUsd).toBe(0);
  });
});

function fakeAiClient(): WeeklyBriefAiClient {
  return {
    async generateText(input) {
      return {
        text: `Mock brief draft for ${input.locale}`,
        provider: "mock",
        requestedProvider: "mock",
        model: "mock-deterministic",
        usage: {
          feature: input.feature,
          provider: "mock",
          requestedProvider: "mock",
          model: "mock-deterministic",
          inputTokens: 100,
          outputTokens: 50,
          estimatedCostUsd: 0,
          locale: input.locale,
          createdAt: "2026-05-12T00:00:00.000Z",
          warningState: "normal"
        }
      };
    }
  };
}

function briefInput(): Omit<WeeklyBriefInput, "aiClient"> {
  return {
    locale: "en",
    periodStart: "2026-05-05",
    periodEnd: "2026-05-12",
    dashboard: {
      alerts: ["Legal review required for fintech onboarding checklist"],
      recentQueries: ["What documents should we request from a new fintech company?"],
      metrics: [{ value: "12", label: { en: "companies tracked", es: "empresas registradas" } }],
      pipeline: [
        {
          company: "AtlasPay",
          sector: "Fintech",
          status: "Interested",
          priority: "High",
          nextAction: "Schedule regulatory onboarding call",
          readiness: 84
        }
      ],
      workflows: [
        { name: "Company onboarding", state: "Completed", progress: 100 }
      ],
      aiSpendStatus: {
        totalCostUsd: 0,
        maxCostUsd: 5,
        warningThresholdUsd: 4,
        percentUsed: 0,
        state: "normal"
      }
    },
    companies: [
      {
        name: "AtlasPay",
        sector: "Fintech",
        priority: "High",
        status: "Interested",
        nextStep: "Regulatory onboarding call",
        aiRecommendedAction:
          "Schedule regulatory onboarding call and send digital zone benefits brief."
      }
    ],
    partners: [
      {
        name: "Crecimiento",
        fintechRelevance: 94,
        recommendedUseCases: ["Introduce fintech leads."]
      }
    ],
    documents: [
      {
        title: "Argentina.gob.ar - Beneficios Economia del Conocimiento",
        legalReviewRequired: true,
        risks: ["Administrative forms and attachments can change."],
        checklist: ["Prepare declarations for R&D, training, sales, and exports."]
      }
    ],
    workflowRuns: [
      {
        workflowName: "Company onboarding",
        state: "Completed",
        progress: 100,
        outputs: {
          nextStep: "Schedule regulatory onboarding call",
          legalReviewRequired: true
        }
      }
    ],
    assistantMessages: [
      {
        role: "assistant",
        content: "Request incorporation and tax documents.",
        citations: [],
        confidence: 91,
        createdAt: "2026-05-12T00:00:00.000Z"
      }
    ],
    citations: [
      {
        chunkId: "weekly-operating-brief-template:000",
        documentSlug: "weekly-operating-brief-template",
        documentTitle: "Weekly Operating Brief Template",
        sourcePackPath:
          "supabase/seed/source-pack/internal/weekly-operating-brief-template.md",
        sourceType: "template",
        jurisdiction: "Internal",
        originalLanguage: "en",
        section: "Sections",
        excerpt: "Progress. Risks. Next steps. Opportunities. Blockers.",
        confidence: 0.91,
        legalReviewRequired: false
      }
    ]
  };
}
