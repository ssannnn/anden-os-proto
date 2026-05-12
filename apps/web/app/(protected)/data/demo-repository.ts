import {
  createAiClient,
  getAiSpendStatus,
  type AiEnv,
  type AiUsageEvent as AdapterAiUsageEvent
} from "@anden/ai";
import type { AssistantAnswer } from "@anden/assistant";
import {
  createSupabaseRepository,
  demoDataModeLabels,
  getSupabaseReadConfig,
  getSupabaseWriteConfig,
  type AiUsageEventInsert,
  type AssistantMessageRecord,
  type Company,
  type DashboardData,
  type DemoDataMode,
  type DocumentRecord,
  type Partner,
  type ReportInsert,
  type ReportRecord,
  type SupabaseEnv,
  type WorkflowRecord,
  type WorkflowRunInsert,
  type WorkflowRunRecord
} from "@anden/db";
import type { SourcePackChunk } from "@anden/rag";
import {
  companies as mockCompanies,
  partners as mockPartners
} from "../crm/mock-data";
import { documents as mockDocuments } from "../documents/mock-data";
import { mockDashboardData } from "../dashboard/mock-data";

type DemoDataResult<T> = {
  mode: DemoDataMode;
  data: T;
};

export async function getCompaniesData(): Promise<DemoDataResult<Company[]>> {
  return readSupabaseOrMock(
    (repo) => repo.listCompanies(),
    mockCompanies
  );
}

export async function getCompanyData(
  slug: string
): Promise<DemoDataResult<Company | undefined>> {
  return readSupabaseOrMock(
    (repo) => repo.getCompany(slug),
    mockCompanies.find((company) => company.slug === slug)
  );
}

export async function getPartnersData(): Promise<DemoDataResult<Partner[]>> {
  return readSupabaseOrMock((repo) => repo.listPartners(), mockPartners);
}

export async function getPartnerData(
  slug: string
): Promise<DemoDataResult<Partner | undefined>> {
  return readSupabaseOrMock(
    (repo) => repo.getPartner(slug),
    mockPartners.find((partner) => partner.slug === slug)
  );
}

export async function getDocumentsData(): Promise<
  DemoDataResult<DocumentRecord[]>
> {
  return readSupabaseOrMock((repo) => repo.listDocuments(), mockDocuments);
}

export async function getDocumentData(
  slug: string
): Promise<DemoDataResult<DocumentRecord | undefined>> {
  return readSupabaseOrMock(
    (repo) => repo.getDocument(slug),
    mockDocuments.find((document) => document.slug === slug)
  );
}

export async function getDashboardData(): Promise<DemoDataResult<DashboardData>> {
  return readSupabaseOrMock(async (repo) => {
    const [metrics, workflows, aiUsageEvents] = await Promise.all([
      repo.listDashboardMetrics(),
      repo.listWorkflows(),
      repo.listAiUsageEvents()
    ]);
    const totalCostUsd = aiUsageEvents.reduce(
      (sum, event) => sum + event.costUsd,
      0
    );

    return {
      ...mockDashboardData,
      metrics: metrics.length > 0 ? metrics : mockDashboardData.metrics,
      aiSpendStatus: getAiSpendStatus({
        totalCostUsd,
        maxCostUsd: getRuntimeMaxDemoAiCostUsd()
      }),
      workflows:
        workflows.length > 0
          ? workflows.slice(0, 3).map((workflow) => ({
              name: workflow.name,
              state: workflow.status,
              progress: Math.min(95, 35 + workflow.steps.length * 15)
            }))
          : mockDashboardData.workflows
    };
  }, mockDashboardData);
}

export async function getAssistantChunks(): Promise<
  DemoDataResult<SourcePackChunk[]>
> {
  return readSupabaseOrMock(
    (repo) => repo.listDocumentChunks(),
    createMockSourceChunks()
  );
}

export async function getAssistantMessages(
  threadSlug = "default"
): Promise<DemoDataResult<AssistantMessageRecord[]>> {
  return readSupabaseOrMock(
    (repo) => repo.listAssistantMessages(threadSlug),
    []
  );
}

export async function getWorkflowsData(): Promise<
  DemoDataResult<WorkflowRecord[]>
> {
  return readSupabaseOrMock((repo) => repo.listWorkflows(), mockWorkflows);
}

export async function getWorkflowRunsData(): Promise<
  DemoDataResult<WorkflowRunRecord[]>
> {
  return readSupabaseOrMock(
    (repo) => repo.listWorkflowRuns(),
    mockWorkflowRuns
  );
}

export async function getReportsData(): Promise<DemoDataResult<ReportRecord[]>> {
  return readSupabaseOrMock((repo) => repo.listReports(), mockReports);
}

export function createRuntimeAiClient() {
  return createAiClient({
    env: getRuntimeAiEnv(),
    usageStore: createRuntimeAiUsageStore()
  });
}

export async function recordAiUsageEvent(event: AdapterAiUsageEvent) {
  const config = getSupabaseWriteConfig(getRuntimeSupabaseEnv());

  if (!config) {
    return;
  }

  try {
    const repo = createSupabaseRepository(config);
    await repo.recordAiUsageEvent(toAiUsageEventInsert(event));
  } catch (error) {
    console.warn("Supabase AI usage write failed.", error);
  }
}

export async function recordAssistantExchange({
  question,
  answer,
  threadSlug = "default"
}: {
  question: string;
  answer: AssistantAnswer;
  threadSlug?: string;
}) {
  const config = getSupabaseWriteConfig(getRuntimeSupabaseEnv());

  if (!config) {
    return;
  }

  try {
    const repo = createSupabaseRepository(config);
    await repo.recordAssistantExchange({
      threadSlug,
      title: "Anden OS assistant",
      locale: answer.locale,
      userContent: question,
      assistantContent: `${answer.sourcedAnswer}\n\n${answer.operationalInference}`,
      citations: answer.citations,
      confidence: answer.confidence
    });
  } catch (error) {
    console.warn("Supabase assistant exchange write failed.", error);
  }
}

export async function recordWorkflowRun(run: WorkflowRunInsert) {
  const config = getSupabaseWriteConfig(getRuntimeSupabaseEnv());

  if (!config) {
    return;
  }

  try {
    const repo = createSupabaseRepository(config);
    await repo.recordWorkflowRun(run);
  } catch (error) {
    console.warn("Supabase workflow run write failed.", error);
  }
}

export async function recordReport(report: ReportInsert) {
  const config = getSupabaseWriteConfig(getRuntimeSupabaseEnv());

  if (!config) {
    return;
  }

  try {
    const repo = createSupabaseRepository(config);
    await repo.recordReport(report);
  } catch (error) {
    console.warn("Supabase report write failed.", error);
  }
}

export function createRuntimeAiUsageStore() {
  return {
    async getTotalCostUsd() {
      const config = getSupabaseReadConfig(getRuntimeSupabaseEnv());

      if (!config) {
        return 0;
      }

      try {
        const repo = createSupabaseRepository(config);
        const events = await repo.listAiUsageEvents();
        return events.reduce((sum, event) => sum + event.costUsd, 0);
      } catch (error) {
        console.warn("Supabase AI usage read failed.", error);
        return 0;
      }
    },
    async recordUsage(event: AdapterAiUsageEvent) {
      await recordAiUsageEvent(event);
    }
  };
}

export function getDataModeLabel(mode: DemoDataMode) {
  return demoDataModeLabels[mode];
}

async function readSupabaseOrMock<T>(
  readSupabase: (
    repo: ReturnType<typeof createSupabaseRepository>
  ) => Promise<T>,
  mockData: T
): Promise<DemoDataResult<T>> {
  const config = getSupabaseReadConfig(getRuntimeSupabaseEnv());

  if (!config) {
    return { mode: "mock", data: mockData };
  }

  try {
    const repo = createSupabaseRepository(config);
    return { mode: "supabase", data: await readSupabase(repo) };
  } catch (error) {
    console.warn("Supabase data read failed; falling back to mock data.", error);
    return { mode: "mock", data: mockData };
  }
}

function getRuntimeSupabaseEnv(): SupabaseEnv {
  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

function getRuntimeMaxDemoAiCostUsd() {
  const parsed = Number(process.env.MAX_DEMO_AI_COST_USD ?? "5");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

function getRuntimeAiEnv(): AiEnv {
  return {
    AI_PROVIDER: process.env.AI_PROVIDER,
    AI_MODEL: process.env.AI_MODEL,
    AI_EMBEDDING_MODEL: process.env.AI_EMBEDDING_MODEL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
    MAX_DEMO_AI_COST_USD: process.env.MAX_DEMO_AI_COST_USD
  };
}

function createMockSourceChunks(): SourcePackChunk[] {
  return mockDocuments.map((document, index) => ({
    chunkId: `${document.slug}:000`,
    chunkIndex: 0,
    documentSlug: document.slug,
    documentTitle: document.title,
    sourcePackPath: document.sourcePackPath,
    sourceUrl: document.sourceUrl,
    sourceType: document.type.toLowerCase().replace(/\s+/g, "_"),
    jurisdiction: document.jurisdiction,
    originalLanguage: document.language === "Spanish" ? "es" : "en",
    section: "Operational Summary",
    content: [
      document.summary,
      `Entities: ${document.entities.join(", ")}`,
      `Checklist: ${document.checklist.join(" ")}`,
      `Risks: ${document.risks.join(" ")}`,
      `Use cases: ${document.aiUseCases.join(", ")}`
    ].join("\n"),
    tokenCount: 120,
    sourcePackVersion: "2026-05-11.mock-v1",
    legalReviewRequired: document.legalReviewRequired,
    embedding: createMockEmbedding(index)
  }));
}

function createMockEmbedding(index: number) {
  return [index + 1, 1, 0];
}

const mockWorkflows: WorkflowRecord[] = [
  {
    slug: "company-onboarding",
    name: "Company onboarding",
    category: "onboarding",
    status: "Active",
    steps: [
      { name: "Create profile", status: "complete" },
      { name: "Request documents", status: "active" },
      { name: "Generate summary", status: "queued" },
      { name: "Validate fit", status: "queued" },
      { name: "Prepare email", status: "queued" },
      { name: "Assign next step", status: "queued" }
    ]
  },
  {
    slug: "prepare-meeting",
    name: "Prepare meeting",
    category: "briefing",
    status: "Active",
    steps: [
      { name: "Collect stakeholder context", status: "complete" },
      { name: "Draft briefing", status: "active" },
      { name: "List risks", status: "queued" },
      { name: "Draft follow-up", status: "queued" }
    ]
  },
  {
    slug: "publish-institutional-content",
    name: "Publish institutional content",
    category: "content",
    status: "Active",
    steps: [
      { name: "Generate outline", status: "active" },
      { name: "Draft blog", status: "queued" },
      { name: "SEO metadata", status: "queued" },
      { name: "LinkedIn post", status: "queued" },
      { name: "Newsletter snippet", status: "queued" }
    ]
  }
];

const mockWorkflowRuns: WorkflowRunRecord[] = [
  {
    workflowSlug: "company-onboarding",
    workflowName: "Company onboarding",
    category: "onboarding",
    state: "Waiting documents",
    progress: 64,
    inputs: { company: "AtlasPay" },
    outputs: { nextStep: "Request Knowledge Economy onboarding documents" },
    startedAt: "2026-05-11T09:00:00.000Z"
  },
  {
    workflowSlug: "prepare-meeting",
    workflowName: "Prepare meeting",
    category: "briefing",
    state: "Brief draft ready",
    progress: 82,
    inputs: { company: "Civitas Cloud", stakeholder: "government" },
    outputs: { briefing: "Draft stakeholder briefing generated" },
    startedAt: "2026-05-11T10:15:00.000Z"
  },
  {
    workflowSlug: "publish-institutional-content",
    workflowName: "Publish institutional content",
    category: "content",
    state: "Outline generated",
    progress: 46,
    inputs: { topic: "Digital Zone operations" },
    outputs: { outline: "Institutional content outline generated" },
    startedAt: "2026-05-11T11:30:00.000Z"
  }
];

const mockReports: ReportRecord[] = [
  {
    slug: "weekly-operating-brief-2026-05-11",
    title: "Weekly Operating Brief - May 11, 2026",
    reportType: "weekly_operating_brief",
    status: "Draft",
    locale: "en",
    periodStart: "2026-05-04",
    periodEnd: "2026-05-11",
    content: {
      progress: ["Dashboard, CRM, and document library slices are live."],
      risks: ["Legal review required for regulatory summaries before external use."],
      next_steps: ["Build AI provider adapter and RAG indexing."],
      opportunities: ["Use founder briefing to demonstrate operating leverage."],
      blockers: [],
      ai_recommendations: ["Prioritize assistant golden path after persistence."]
    },
    citations: [
      {
        documentTitle: "Weekly Operating Brief Template",
        sourcePackPath:
          "supabase/seed/source-pack/internal/weekly-operating-brief-template.md"
      }
    ],
    provider: "mock",
    requestedProvider: "mock",
    model: "mock-seed",
    estimatedCostUsd: 0,
    legalReviewRequired: true,
    generatedAt: "2026-05-11T00:00:00.000Z"
  }
];

function toAiUsageEventInsert(event: AdapterAiUsageEvent): AiUsageEventInsert {
  return {
    feature: event.feature,
    provider: event.provider,
    model: event.model,
    promptTokens: event.inputTokens,
    completionTokens: event.outputTokens,
    costUsd: event.estimatedCostUsd,
    locale: event.locale,
    createdAt: event.createdAt,
    metadata: {
      requestedProvider: event.requestedProvider,
      warningState: event.warningState,
      fallbackReason: event.fallbackReason
    }
  };
}
