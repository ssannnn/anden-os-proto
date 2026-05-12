import type { GenerateTextInput, GenerateTextResult } from "@anden/ai";
import type { SourceCitation } from "@anden/rag";

export type WeeklyBriefLocale = "en" | "es";

export type WeeklyBriefAiClient = {
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
};

export type WeeklyBriefInput = {
  locale: WeeklyBriefLocale;
  periodStart: string;
  periodEnd: string;
  dashboard: {
    metrics: Array<{ value: string; label: { en: string; es: string } }>;
    pipeline: Array<{
      company: string;
      sector: string;
      status: string;
      priority: string;
      nextAction: string;
      readiness: number;
    }>;
    alerts: string[];
    recentQueries: string[];
    workflows: Array<{ name: string; state: string; progress: number }>;
    aiSpendStatus: {
      totalCostUsd: number;
      maxCostUsd: number;
      warningThresholdUsd: number;
      percentUsed: number;
      state: string;
    };
  };
  companies: Array<{
    name: string;
    sector: string;
    priority: string;
    status: string;
    nextStep: string;
    aiRecommendedAction: string;
  }>;
  partners: Array<{
    name: string;
    fintechRelevance: number;
    recommendedUseCases: string[];
  }>;
  documents: Array<{
    title: string;
    legalReviewRequired: boolean;
    risks: string[];
    checklist: string[];
  }>;
  workflowRuns: Array<{
    workflowName: string;
    state: string;
    progress: number;
    outputs: Record<string, unknown>;
  }>;
  assistantMessages: Array<{
    role: string;
    content: string;
    citations: unknown[];
    confidence?: number;
    createdAt: string;
  }>;
  citations: SourceCitation[];
  aiClient: WeeklyBriefAiClient;
};

export type WeeklyOperatingBriefContent = {
  executiveSummary: string;
  progress: string[];
  keyRisks: string[];
  opportunities: string[];
  blockers: string[];
  recommendedNextActions: string[];
  legalReviewItems: string[];
  aiRecommendations: string[];
};

export type WeeklyOperatingBrief = {
  slug: string;
  title: string;
  reportType: "weekly_operating_brief";
  status: "Generated";
  locale: WeeklyBriefLocale;
  periodStart: string;
  periodEnd: string;
  content: WeeklyOperatingBriefContent;
  citations: SourceCitation[];
  provider: GenerateTextResult["provider"];
  requestedProvider: GenerateTextResult["requestedProvider"];
  model: string;
  estimatedCostUsd: number;
  warningState: GenerateTextResult["usage"]["warningState"];
  fallbackReason?: GenerateTextResult["usage"]["fallbackReason"];
  legalReviewRequired: boolean;
  generatedAt: string;
};

export async function generateWeeklyOperatingBrief(
  input: WeeklyBriefInput
): Promise<WeeklyOperatingBrief> {
  const draft = await input.aiClient.generateText({
    feature: "weekly_operating_brief",
    locale: input.locale,
    system:
      "Generate a concise founder-facing weekly operating brief from structured operating data. Preserve citations and legal-review separation.",
    prompt: buildPrompt(input),
    maxOutputTokens: 900
  });
  const periodEndLabel = formatDateLabel(input.periodEnd, input.locale);

  return {
    slug: `weekly-operating-brief-${input.periodEnd}`,
    title:
      input.locale === "es"
        ? `Brief Operativo Semanal - ${periodEndLabel}`
        : `Weekly Operating Brief - ${periodEndLabel}`,
    reportType: "weekly_operating_brief",
    status: "Generated",
    locale: input.locale,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    content: composeContent(input),
    citations: input.citations,
    provider: draft.provider,
    requestedProvider: draft.requestedProvider,
    model: draft.model,
    estimatedCostUsd: draft.usage.estimatedCostUsd,
    warningState: draft.usage.warningState,
    fallbackReason: draft.usage.fallbackReason,
    legalReviewRequired:
      input.documents.some((document) => document.legalReviewRequired) ||
      input.citations.some((citation) => citation.legalReviewRequired),
    generatedAt: draft.usage.createdAt
  };
}

function composeContent(input: WeeklyBriefInput): WeeklyOperatingBriefContent {
  return {
    executiveSummary: composeExecutiveSummary(input),
    progress: progressItems(input),
    keyRisks: keyRiskItems(input),
    opportunities: opportunityItems(input),
    blockers: blockerItems(input),
    recommendedNextActions: recommendedNextActionItems(input),
    legalReviewItems: legalReviewItems(input),
    aiRecommendations: aiRecommendationItems(input)
  };
}

function composeExecutiveSummary(input: WeeklyBriefInput) {
  const topCompany =
    input.dashboard.pipeline[0]?.company ?? input.companies[0]?.name ?? "the pipeline";
  const activeWorkflow =
    input.dashboard.workflows[0]?.name ?? input.workflowRuns[0]?.workflowName;

  return input.locale === "es"
    ? `${topCompany} concentra la prioridad operativa de la semana. ${activeWorkflow ?? "El flujo operativo"} muestra avance suficiente para convertir señales de CRM, documentos y workflows en decisiones ejecutivas con fuentes adjuntas.`
    : `${topCompany} is the operating priority for the week. ${activeWorkflow ?? "The operating workflow"} has enough progress to turn CRM, document, and workflow signals into source-backed executive decisions.`;
}

function progressItems(input: WeeklyBriefInput) {
  const workflowProgress = input.workflowRuns.map(
    (run) => `${run.workflowName} ${run.state.toLowerCase()} at ${run.progress}%.`
  );
  const dashboardProgress = input.dashboard.workflows.map(
    (workflow) =>
      `${workflow.name} ${workflow.state.toLowerCase()} at ${workflow.progress}%.`
  );

  return uniqueNonEmpty([...workflowProgress, ...dashboardProgress]).slice(0, 5);
}

function keyRiskItems(input: WeeklyBriefInput) {
  return uniqueNonEmpty([
    ...input.dashboard.alerts,
    ...input.documents.flatMap((document) => document.risks)
  ]).slice(0, 6);
}

function opportunityItems(input: WeeklyBriefInput) {
  const partnerOpportunities = input.partners
    .filter((partner) => partner.fintechRelevance >= 80)
    .map((partner) => `Use ${partner.name} for high-relevance fintech introductions.`);
  const pipelineOpportunities = input.dashboard.pipeline
    .filter((company) => company.priority === "High")
    .map(
      (company) =>
        `Move ${company.company} forward while readiness is ${company.readiness}%.`
    );

  return uniqueNonEmpty([...partnerOpportunities, ...pipelineOpportunities]).slice(
    0,
    5
  );
}

function blockerItems(input: WeeklyBriefInput) {
  const blockers = input.dashboard.alerts.filter((alert) =>
    /block|missing|waiting|pending/i.test(alert)
  );

  return blockers.length > 0
    ? blockers
    : ["No explicit blockers are active in the demo data."];
}

function recommendedNextActionItems(input: WeeklyBriefInput) {
  return uniqueNonEmpty([
    ...input.companies.map((company) => company.aiRecommendedAction),
    ...input.dashboard.pipeline.map((company) => company.nextAction),
    ...input.workflowRuns.map((run) =>
      typeof run.outputs.nextStep === "string" ? run.outputs.nextStep : undefined
    )
  ]).slice(0, 6);
}

function legalReviewItems(input: WeeklyBriefInput) {
  const documentItems = input.documents
    .filter((document) => document.legalReviewRequired)
    .map((document) => `Review ${document.title} before external use.`);
  const citationItems = input.citations
    .filter((citation) => citation.legalReviewRequired)
    .map((citation) => `Validate ${citation.documentTitle} with Legal.`);

  return uniqueNonEmpty([...documentItems, ...citationItems]).slice(0, 5);
}

function aiRecommendationItems(input: WeeklyBriefInput) {
  return uniqueNonEmpty([
    "Use the generated brief as an internal operating draft.",
    "Keep cited sources attached to any regulatory or partner-facing statement.",
    input.assistantMessages[0]?.content
      ? `Follow up on recent assistant output: ${trim(input.assistantMessages[0].content)}`
      : undefined
  ]);
}

function buildPrompt(input: WeeklyBriefInput) {
  return JSON.stringify({
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    dashboard: input.dashboard,
    companies: input.companies,
    partners: input.partners,
    documents: input.documents,
    workflowRuns: input.workflowRuns,
    citations: input.citations.map((citation) => ({
      documentTitle: citation.documentTitle,
      section: citation.section,
      legalReviewRequired: citation.legalReviewRequired
    }))
  });
}

function formatDateLabel(date: string, locale: WeeklyBriefLocale) {
  const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  return formatter.format(new Date(`${date}T00:00:00.000Z`));
}

function uniqueNonEmpty(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])
  );
}

function trim(value: string) {
  return value.replace(/\s+/g, " ").slice(0, 160);
}
