import { describe, expect, it } from "vitest";
import { runWorkflowSimulation, type WorkflowSimulationInput } from "./index";

describe("workflow automation simulations", () => {
  it("runs company onboarding with source-backed output and legal review flag", () => {
    const result = runWorkflowSimulation({
      workflowSlug: "company-onboarding",
      locale: "en",
      inputs: {
        company: "AtlasPay",
        sector: "Fintech",
        country: "Argentina"
      },
      citations: [
        citation({
          documentSlug: "digital-zone-company-onboarding-faq",
          documentTitle: "Digital Zone Company Onboarding FAQ",
          section: "Company Intake Checklist",
          confidence: 0.91,
          legalReviewRequired: false
        }),
        citation({
          documentSlug: "argentina-knowledge-economy-registration",
          documentTitle: "Argentina.gob.ar - Beneficios Economía del Conocimiento",
          section: "Documentation",
          confidence: 0.84,
          legalReviewRequired: true
        })
      ]
    });

    expect(result).toMatchObject({
      workflowSlug: "company-onboarding",
      state: "Completed",
      progress: 100,
      legalReviewRequired: true,
      confidence: 88
    });
    expect(result.steps.map((step) => step.status)).toEqual([
      "complete",
      "complete",
      "complete",
      "complete",
      "complete",
      "complete"
    ]);
    expect(result.outputs.onboardingPlan).toContain("AtlasPay");
    expect(result.outputs.requiredDocuments).toEqual(
      expect.arrayContaining([
        "Incorporation documents",
        "Tax status and CUIT evidence",
        "Product and compliance overview"
      ])
    );
    expect(result.outputs.fitAssessment).toContain("strong fit");
    expect(result.outputs.preparedEmail).toContain("AtlasPay");
    expect(result.outputs.nextStep).toContain("regulatory onboarding call");
    expect(result.citations[0]).toMatchObject({
      documentTitle: "Digital Zone Company Onboarding FAQ",
      confidence: 0.91
    });
  });

  it("runs meeting preparation with briefing, talking points, risks, questions, and follow-up", () => {
    const result = runWorkflowSimulation({
      workflowSlug: "prepare-meeting",
      locale: "en",
      inputs: {
        company: "Civitas Cloud",
        stakeholder: "government stakeholder",
        objective: "expand digital zone operations"
      },
      citations: [
        citation({
          documentSlug: "government-stakeholder-meeting-playbook",
          documentTitle: "Government Stakeholder Meeting Playbook",
          section: "Meeting Preparation",
          confidence: 0.89
        }),
        citation({
          documentSlug: "argentina-free-zones-law-24331",
          documentTitle: "Ley 24.331 - Zonas Francas",
          sourceType: "regulation",
          jurisdiction: "Argentina",
          originalLanguage: "es",
          section: "Operational Risk Notes",
          confidence: 0.79,
          legalReviewRequired: true
        })
      ]
    });

    expect(result.workflowSlug).toBe("prepare-meeting");
    expect(result.outputs.briefing).toContain("Civitas Cloud");
    expect(result.outputs.talkingPoints).toEqual(
      expect.arrayContaining([
        "Position Anden as an internal AI operating layer.",
        "Separate digital operations benefits from free-zone legal claims."
      ])
    );
    expect(result.outputs.risks).toEqual(
      expect.arrayContaining([
        "Legal review required before external regulatory positioning."
      ])
    );
    expect(result.outputs.suggestedQuestions).toEqual(
      expect.arrayContaining([
        "Which institutional constraints should the operating model respect?"
      ])
    );
    expect(result.outputs.followUpEmail).toContain("government stakeholder");
    expect(result.legalReviewRequired).toBe(true);
    expect(result.confidence).toBe(84);
  });

  it("runs institutional content publishing with outline, draft, SEO, LinkedIn, and newsletter output", () => {
    const result = runWorkflowSimulation({
      workflowSlug: "publish-institutional-content",
      locale: "en",
      inputs: {
        topic: "AI operating systems for digital zone teams"
      },
      citations: [
        citation({
          documentSlug: "anden-value-proposition",
          documentTitle: "Anden Value Proposition",
          section: "Core Message",
          confidence: 0.93
        })
      ]
    });

    expect(result.workflowSlug).toBe("publish-institutional-content");
    expect(result.outputs.outline).toEqual(
      expect.arrayContaining([
        "Operating problem",
        "AI knowledge layer",
        "Workflow automation",
        "Executive reporting"
      ])
    );
    expect(result.outputs.blogDraft).toContain(
      "AI operating systems for digital zone teams"
    );
    expect(result.outputs.seoMetadata).toContain("digital zone");
    expect(result.outputs.linkedInPost).toContain("Anden OS");
    expect(result.outputs.newsletterSnippet).toContain("This week");
    expect(result.legalReviewRequired).toBe(false);
    expect(result.confidence).toBe(93);
  });
});

function citation(
  overrides: Partial<WorkflowSimulationInput["citations"][number]>
): WorkflowSimulationInput["citations"][number] {
  return {
    chunkId: "source:000",
    documentSlug: "source",
    documentTitle: "Source",
    sourcePackPath: "supabase/seed/source-pack/internal/source.md",
    sourceType: "internal_memo",
    jurisdiction: "Internal",
    originalLanguage: "en",
    section: "Operational Summary",
    excerpt: "Source excerpt",
    confidence: 0.8,
    legalReviewRequired: false,
    ...overrides
  };
}
