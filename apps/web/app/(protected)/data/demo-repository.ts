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
  type SupabaseEnv
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
