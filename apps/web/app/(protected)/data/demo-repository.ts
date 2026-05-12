import {
  getAiSpendStatus,
  type AiUsageEvent as AdapterAiUsageEvent
} from "@anden/ai";
import {
  createSupabaseRepository,
  demoDataModeLabels,
  getSupabaseReadConfig,
  getSupabaseWriteConfig,
  type AiUsageEventInsert,
  type Company,
  type DashboardData,
  type DemoDataMode,
  type DocumentRecord,
  type Partner,
  type SupabaseEnv
} from "@anden/db";
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
