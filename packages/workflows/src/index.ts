import type { SourceCitation } from "@anden/rag";

export type WorkflowSlug =
  | "company-onboarding"
  | "prepare-meeting"
  | "publish-institutional-content";

export type WorkflowLocale = "en" | "es";

export type WorkflowStepStatus = "queued" | "active" | "complete";

export type WorkflowStep = {
  name: string;
  status: WorkflowStepStatus;
};

export type WorkflowSimulationInput = {
  workflowSlug: WorkflowSlug;
  locale: WorkflowLocale;
  inputs: Record<string, string>;
  citations: SourceCitation[];
};

export type WorkflowSimulationResult = {
  workflowSlug: WorkflowSlug;
  state: "Completed";
  progress: 100;
  steps: WorkflowStep[];
  outputs: Record<string, string | string[]>;
  citations: SourceCitation[];
  confidence: number;
  legalReviewRequired: boolean;
};

export function runWorkflowSimulation({
  workflowSlug,
  locale,
  inputs,
  citations
}: WorkflowSimulationInput): WorkflowSimulationResult {
  if (workflowSlug === "company-onboarding") {
    return runCompanyOnboarding({ locale, inputs, citations, workflowSlug });
  }

  if (workflowSlug === "prepare-meeting") {
    return runPrepareMeeting({ locale, inputs, citations, workflowSlug });
  }

  if (workflowSlug === "publish-institutional-content") {
    return runPublishInstitutionalContent({
      locale,
      inputs,
      citations,
      workflowSlug
    });
  }

  throw new Error(`Unsupported workflow simulation: ${workflowSlug}`);
}

function runCompanyOnboarding({
  workflowSlug,
  inputs,
  citations
}: WorkflowSimulationInput): WorkflowSimulationResult {
  const company = inputs.company ?? "New company";
  const sector = inputs.sector ?? "Digital services";
  const country = inputs.country ?? "Argentina";

  return {
    workflowSlug,
    state: "Completed",
    progress: 100,
    steps: [
      { name: "Create profile", status: "complete" },
      { name: "Request documents", status: "complete" },
      { name: "Generate summary", status: "complete" },
      { name: "Validate fit", status: "complete" },
      { name: "Prepare email", status: "complete" },
      { name: "Assign next step", status: "complete" }
    ],
    outputs: {
      onboardingPlan: `${company} should enter the Digital Zone onboarding path as a ${sector} company operating from ${country}. Create the CRM profile, attach intake evidence, and route regulated assumptions to Legal.`,
      requiredDocuments: [
        "Incorporation documents",
        "Tax status and CUIT evidence",
        "Product and compliance overview",
        "Revenue mix by promoted activity",
        "Representative or proxy information"
      ],
      fitAssessment: `${company} is a strong fit for the demo pipeline when fintech activity, fiscal status, and compliance context are validated with source-backed evidence.`,
      preparedEmail: `Hi ${company} team, we prepared the Digital Zone onboarding intake. Please send incorporation, tax, product, and compliance documents so we can prepare the regulatory onboarding call.`,
      nextStep: "Schedule regulatory onboarding call and send the Digital Zone benefits brief."
    },
    citations,
    confidence: averageConfidence(citations),
    legalReviewRequired: citations.some((citation) => citation.legalReviewRequired)
  };
}

function runPrepareMeeting({
  workflowSlug,
  inputs,
  citations
}: WorkflowSimulationInput): WorkflowSimulationResult {
  const company = inputs.company ?? "Target company";
  const stakeholder = inputs.stakeholder ?? "stakeholder";
  const objective = inputs.objective ?? "align on Digital Zone operations";
  const legalReviewRequired = citations.some(
    (citation) => citation.legalReviewRequired
  );

  return {
    workflowSlug,
    state: "Completed",
    progress: 100,
    steps: [
      { name: "Collect stakeholder context", status: "complete" },
      { name: "Draft briefing", status: "complete" },
      { name: "List risks", status: "complete" },
      { name: "Draft follow-up", status: "complete" }
    ],
    outputs: {
      briefing: `${company} meeting brief for ${stakeholder}: focus the conversation on ${objective}, institutional constraints, and the operating evidence Anden can centralize for follow-up decisions.`,
      talkingPoints: [
        "Position Anden as an internal AI operating layer.",
        "Show how source-backed knowledge reduces manual coordination.",
        "Separate digital operations benefits from free-zone legal claims.",
        "Use the workflow output as a draft, not external legal guidance."
      ],
      risks: [
        "Legal review required before external regulatory positioning.",
        "Stakeholder incentives may differ from company onboarding priorities.",
        "Avoid implying tax, customs, or eligibility outcomes without reviewed sources."
      ],
      suggestedQuestions: [
        "Which institutional constraints should the operating model respect?",
        "What decision needs to happen after this meeting?",
        "Which documents or source materials should Anden request next?"
      ],
      followUpEmail: `Hi ${stakeholder}, thank you for discussing ${objective}. We will send a source-backed summary for ${company}, highlight open legal-review items, and propose the next operating checkpoint.`
    },
    citations,
    confidence: averageConfidence(citations),
    legalReviewRequired
  };
}

function runPublishInstitutionalContent({
  workflowSlug,
  inputs,
  citations
}: WorkflowSimulationInput): WorkflowSimulationResult {
  const topic = inputs.topic ?? "Digital Zone operations";

  return {
    workflowSlug,
    state: "Completed",
    progress: 100,
    steps: [
      { name: "Generate outline", status: "complete" },
      { name: "Draft blog", status: "complete" },
      { name: "SEO metadata", status: "complete" },
      { name: "LinkedIn post", status: "complete" },
      { name: "Newsletter snippet", status: "complete" }
    ],
    outputs: {
      outline: [
        "Operating problem",
        "AI knowledge layer",
        "Workflow automation",
        "Executive reporting"
      ],
      blogDraft: `${topic} need more than static documentation. Anden OS shows how an internal backoffice can connect source-backed knowledge, company context, workflows, and weekly operating reports for the team running the demo.`,
      seoMetadata:
        "Title: AI operating systems for digital zone teams | Description: How source-backed internal workflows help digital zone teams coordinate companies, partners, documents, and executive reporting.",
      linkedInPost: `Anden OS turns ${topic} into a repeatable operating workflow: cited knowledge, partner context, document intelligence, and executive-ready next steps.`,
      newsletterSnippet:
        "This week we turned the internal AI backoffice into a working workflow surface for onboarding, meetings, and institutional content."
    },
    citations,
    confidence: averageConfidence(citations),
    legalReviewRequired: citations.some((citation) => citation.legalReviewRequired)
  };
}

function averageConfidence(citations: SourceCitation[]) {
  if (citations.length === 0) {
    return 0;
  }

  return Math.round(
    (citations.reduce((sum, citation) => sum + citation.confidence, 0) /
      citations.length) *
      100
  );
}
