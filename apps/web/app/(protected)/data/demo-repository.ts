import {
  createSupabaseRepository,
  demoDataModeLabels,
  getSupabaseReadConfig,
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
    const [metrics, workflows] = await Promise.all([
      repo.listDashboardMetrics(),
      repo.listWorkflows()
    ]);

    return {
      ...mockDashboardData,
      metrics: metrics.length > 0 ? metrics : mockDashboardData.metrics,
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
