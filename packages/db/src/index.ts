export type DemoDataMode = "supabase" | "mock";

export const defaultDemoDataMode: DemoDataMode = "mock";

export const demoDataModeLabels: Record<DemoDataMode, string> = {
  mock: "Mock fallback",
  supabase: "Supabase live"
};

export type CompanyStatus =
  | "Interested"
  | "Briefing"
  | "Qualification"
  | "Onboarding";

export type Priority = "High" | "Medium" | "Low";

export type Company = {
  slug: string;
  name: string;
  sector: string;
  country: string;
  status: CompanyStatus;
  priority: Priority;
  lastInteraction: string;
  nextStep: string;
  documents: string[];
  aiSummary: string;
  aiRecommendedAction: string;
  readiness: number;
  partnerRelevance: string[];
};

export type Partner = {
  slug: string;
  name: string;
  type: string;
  country: string;
  relevance: "Strategic" | "High" | "Medium";
  fintechRelevance: number;
  linkedSectors: string[];
  lastInteraction: string;
  nextStep: string;
  documents: string[];
  aiSummary: string;
  recommendedUseCases: string[];
};

export type DocumentType =
  | "Regulation"
  | "Official guidance"
  | "Internal memo"
  | "Partner profile"
  | "Playbook"
  | "Template";

export type DocumentStatus = "Indexed" | "Review queued" | "Draft";

export type DocumentRecord = {
  slug: string;
  title: string;
  type: DocumentType;
  sourceLabel: string;
  sourceUrl?: string;
  sourcePackPath: string;
  jurisdiction: "Argentina" | "Internal" | "Global";
  language: "Spanish" | "English";
  indexStatus: DocumentStatus;
  retrievedAt?: string;
  updatedAt: string;
  legalReviewRequired: boolean;
  summary: string;
  entities: string[];
  risks: string[];
  checklist: string[];
  linkedCompanies: string[];
  linkedPartners: string[];
  aiUseCases: string[];
};

export type DocumentChunkRecord = {
  chunkId: string;
  chunkIndex: number;
  documentSlug: string;
  documentTitle: string;
  sourcePackPath: string;
  sourceUrl?: string;
  sourceType: string;
  jurisdiction: string;
  originalLanguage: "en" | "es";
  section: string;
  article?: string;
  content: string;
  tokenCount: number;
  sourcePackVersion: string;
  legalReviewRequired: boolean;
  embedding?: number[];
};

export type DocumentChunkUpsert = {
  chunkIndex: number;
  content: string;
  tokenCount: number;
  embedding?: number[];
  metadata: Record<string, unknown>;
};

export type DashboardMetricTone =
  | "blue"
  | "lime"
  | "orange"
  | "sky"
  | "periwinkle"
  | "brown";

export type DashboardMetric = {
  value: string;
  label: { en: string; es: string };
  tone: DashboardMetricTone;
};

export type DashboardPipelineItem = {
  company: string;
  sector: string;
  status: CompanyStatus;
  priority: Priority;
  nextAction: string;
  readiness: number;
};

export type DashboardWorkflow = {
  name: string;
  state: string;
  progress: number;
};

export type AiSpendState = "normal" | "warning" | "blocked";

export type AiSpendSummary = {
  totalCostUsd: number;
  maxCostUsd: number;
  warningThresholdUsd: number;
  percentUsed: number;
  state: AiSpendState;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  pipeline: DashboardPipelineItem[];
  alerts: string[];
  recentQueries: string[];
  workflows: DashboardWorkflow[];
  aiSpendStatus: AiSpendSummary;
};

export type WorkflowRecord = {
  slug: string;
  name: string;
  category: string;
  status: string;
  steps: unknown[];
};

export type ReportRecord = {
  slug: string;
  title: string;
  reportType: string;
  status: string;
  periodStart?: string;
  periodEnd?: string;
  content: Record<string, unknown>;
};

export type AiUsageEventRecord = {
  feature: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  locale: "en" | "es";
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type AiUsageEventInsert = Omit<AiUsageEventRecord, "createdAt"> & {
  createdAt?: string;
};

export type SupabaseEnv = {
  SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

export type SupabaseReadConfig = {
  url: string;
  key: string;
  fetch?: typeof fetch;
};

export type SupabaseWriteConfig = SupabaseReadConfig;

export type DemoRepository = {
  listCompanies(): Promise<Company[]>;
  getCompany(slug: string): Promise<Company | undefined>;
  listPartners(): Promise<Partner[]>;
  getPartner(slug: string): Promise<Partner | undefined>;
  listDocuments(): Promise<DocumentRecord[]>;
  getDocument(slug: string): Promise<DocumentRecord | undefined>;
  listDocumentChunks(): Promise<DocumentChunkRecord[]>;
  upsertDocumentChunks(
    documentSlug: string,
    chunks: DocumentChunkUpsert[]
  ): Promise<void>;
  listDashboardMetrics(): Promise<DashboardMetric[]>;
  listWorkflows(): Promise<WorkflowRecord[]>;
  listReports(): Promise<ReportRecord[]>;
  listAiUsageEvents(): Promise<AiUsageEventRecord[]>;
  recordAiUsageEvent(event: AiUsageEventInsert): Promise<void>;
};

type CompanyRow = {
  slug: string;
  name: string;
  sector: string;
  country: string;
  status: CompanyStatus;
  priority: Priority;
  last_interaction: string;
  next_step: string;
  documents: string[] | null;
  ai_summary: string;
  ai_recommended_action: string;
  readiness: number;
  partner_relevance: string[] | null;
};

type PartnerRow = {
  slug: string;
  name: string;
  partner_type: string;
  country: string;
  relevance: Partner["relevance"];
  fintech_relevance: number;
  linked_sectors: string[] | null;
  last_interaction: string;
  next_step: string;
  documents: string[] | null;
  ai_summary: string;
  recommended_use_cases: string[] | null;
};

type DocumentRow = {
  slug: string;
  title: string;
  document_type: DocumentType;
  source_label: string;
  source_url: string | null;
  source_pack_path: string;
  jurisdiction: DocumentRecord["jurisdiction"];
  language: DocumentRecord["language"];
  index_status: DocumentStatus;
  retrieved_at: string | null;
  updated_at: string;
  legal_review_required: boolean;
  summary: string;
  entities: string[] | null;
  risks: string[] | null;
  checklist: string[] | null;
  linked_companies: string[] | null;
  linked_partners: string[] | null;
  ai_use_cases: string[] | null;
};

type DocumentChunkRow = {
  chunk_index: number;
  content: string;
  token_count: number;
  embedding: number[] | string | null;
  metadata: Record<string, unknown> | null;
  documents: {
    slug: string;
    title: string;
    document_type: DocumentType;
    source_url: string | null;
    source_pack_path: string;
    jurisdiction: DocumentRecord["jurisdiction"];
    language: DocumentRecord["language"];
    legal_review_required: boolean;
  };
};

type DocumentIdRow = {
  id: number;
};

type DashboardMetricRow = {
  metric_key: string;
  value: string;
  label_en: string;
  label_es: string;
  tone: DashboardMetricTone;
};

type WorkflowRow = {
  slug: string;
  name: string;
  category: string;
  status: string;
  steps: unknown[] | null;
};

type ReportRow = {
  slug: string;
  title: string;
  report_type: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  content: Record<string, unknown> | null;
};

type AiUsageEventRow = {
  feature: string;
  provider: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number | string;
  locale: "en" | "es";
  created_at: string;
  metadata: Record<string, unknown> | null;
};

export function resolveDemoDataMode(env: SupabaseEnv): DemoDataMode {
  return getSupabaseReadConfig(env) ? "supabase" : "mock";
}

export function getSupabaseReadConfig(
  env: SupabaseEnv
): SupabaseReadConfig | undefined {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    env.SUPABASE_SERVICE_ROLE_KEY ??
    env.SUPABASE_ANON_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return undefined;
  }

  return { url, key };
}

export function getSupabaseWriteConfig(
  env: SupabaseEnv
): SupabaseWriteConfig | undefined {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return undefined;
  }

  return { url, key };
}

export function createSupabaseRepository(
  config: SupabaseReadConfig
): DemoRepository {
  const fetchRows = createPostgrestReader(config);
  const insertRow = createPostgrestInserter(config);
  const upsertRows = createPostgrestUpserter(config);

  return {
    async listCompanies() {
      const rows = await fetchRows<CompanyRow>("companies", {
        order: "name.asc"
      });
      return rows.map(mapCompany);
    },
    async getCompany(slug: string) {
      const rows = await fetchRows<CompanyRow>("companies", {
        filters: { slug: `eq.${slug}` },
        limit: 1
      });
      return rows[0] ? mapCompany(rows[0]) : undefined;
    },
    async listPartners() {
      const rows = await fetchRows<PartnerRow>("partners", {
        order: "name.asc"
      });
      return rows.map(mapPartner);
    },
    async getPartner(slug: string) {
      const rows = await fetchRows<PartnerRow>("partners", {
        filters: { slug: `eq.${slug}` },
        limit: 1
      });
      return rows[0] ? mapPartner(rows[0]) : undefined;
    },
    async listDocuments() {
      const rows = await fetchRows<DocumentRow>("documents", {
        order: "title.asc"
      });
      return rows.map(mapDocument);
    },
    async getDocument(slug: string) {
      const rows = await fetchRows<DocumentRow>("documents", {
        filters: { slug: `eq.${slug}` },
        limit: 1
      });
      return rows[0] ? mapDocument(rows[0]) : undefined;
    },
    async listDocumentChunks() {
      const rows = await fetchRows<DocumentChunkRow>("document_chunks", {
        select:
          "chunk_index,content,token_count,embedding,metadata,documents(slug,title,document_type,source_url,source_pack_path,jurisdiction,language,legal_review_required)",
        order: "document_id.asc,chunk_index.asc"
      });
      return rows.map(mapDocumentChunk);
    },
    async upsertDocumentChunks(documentSlug: string, chunks: DocumentChunkUpsert[]) {
      const documents = await fetchRows<DocumentIdRow>("documents", {
        select: "id",
        filters: { slug: `eq.${documentSlug}` },
        limit: 1
      });
      const documentId = documents[0]?.id;

      if (!documentId) {
        throw new Error(`Document not found for chunk upsert: ${documentSlug}`);
      }

      await upsertRows(
        "document_chunks",
        chunks.map((chunk) => ({
          document_id: documentId,
          chunk_index: chunk.chunkIndex,
          content: chunk.content,
          token_count: chunk.tokenCount,
          embedding: chunk.embedding
            ? toVectorLiteral(chunk.embedding)
            : undefined,
          metadata: chunk.metadata
        })),
        { onConflict: "document_id,chunk_index" }
      );
    },
    async listDashboardMetrics() {
      const rows = await fetchRows<DashboardMetricRow>("dashboard_metrics", {
        order: "sort_order.asc"
      });
      return rows.map(mapDashboardMetric);
    },
    async listWorkflows() {
      const rows = await fetchRows<WorkflowRow>("workflows", {
        order: "sort_order.asc"
      });
      return rows.map(mapWorkflow);
    },
    async listReports() {
      const rows = await fetchRows<ReportRow>("reports", {
        order: "generated_at.desc"
      });
      return rows.map(mapReport);
    },
    async listAiUsageEvents() {
      const rows = await fetchRows<AiUsageEventRow>("ai_usage_events", {
        order: "created_at.desc"
      });
      return rows.map(mapAiUsageEvent);
    },
    async recordAiUsageEvent(event: AiUsageEventInsert) {
      await insertRow("ai_usage_events", {
        feature: event.feature,
        provider: event.provider,
        model: event.model,
        prompt_tokens: event.promptTokens,
        completion_tokens: event.completionTokens,
        cost_usd: event.costUsd,
        locale: event.locale,
        created_at: event.createdAt,
        metadata: event.metadata
      });
    }
  };
}

function createPostgrestReader(config: SupabaseReadConfig) {
  const fetchImpl = config.fetch ?? fetch;
  const baseUrl = config.url.replace(/\/$/, "");

  return async function fetchRows<T>(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, string>;
      order?: string;
      limit?: number;
    } = {}
  ): Promise<T[]> {
    const url = new URL(`${baseUrl}/rest/v1/${table}`);
    url.searchParams.set("select", options.select ?? "*");

    if (options.order) {
      url.searchParams.set("order", options.order);
    }

    if (options.limit) {
      url.searchParams.set("limit", String(options.limit));
    }

    for (const [key, value] of Object.entries(options.filters ?? {})) {
      url.searchParams.set(key, value);
    }

    const response = await fetchImpl(url, {
      headers: {
        apikey: config.key,
        authorization: `Bearer ${config.key}`,
        accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Supabase read failed for ${table}: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as T[];
  };
}

function createPostgrestUpserter(config: SupabaseReadConfig) {
  const fetchImpl = config.fetch ?? fetch;
  const baseUrl = config.url.replace(/\/$/, "");

  return async function upsertRows(
    table: string,
    rows: Array<Record<string, unknown>>,
    options: { onConflict: string }
  ): Promise<void> {
    const url = new URL(`${baseUrl}/rest/v1/${table}`);
    url.searchParams.set("on_conflict", options.onConflict);

    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        apikey: config.key,
        authorization: `Bearer ${config.key}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(rows),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Supabase upsert failed for ${table}: ${response.status} ${response.statusText}`
      );
    }
  };
}

function createPostgrestInserter(config: SupabaseReadConfig) {
  const fetchImpl = config.fetch ?? fetch;
  const baseUrl = config.url.replace(/\/$/, "");

  return async function insertRow(
    table: string,
    row: Record<string, unknown>
  ): Promise<void> {
    const response = await fetchImpl(`${baseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: config.key,
        authorization: `Bearer ${config.key}`,
        "content-type": "application/json",
        prefer: "return=minimal"
      },
      body: JSON.stringify(row),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Supabase insert failed for ${table}: ${response.status} ${response.statusText}`
      );
    }
  };
}

function mapCompany(row: CompanyRow): Company {
  return {
    slug: row.slug,
    name: row.name,
    sector: row.sector,
    country: row.country,
    status: row.status,
    priority: row.priority,
    lastInteraction: formatDate(row.last_interaction),
    nextStep: row.next_step,
    documents: row.documents ?? [],
    aiSummary: row.ai_summary,
    aiRecommendedAction: row.ai_recommended_action,
    readiness: row.readiness,
    partnerRelevance: row.partner_relevance ?? []
  };
}

function mapPartner(row: PartnerRow): Partner {
  return {
    slug: row.slug,
    name: row.name,
    type: row.partner_type,
    country: row.country,
    relevance: row.relevance,
    fintechRelevance: row.fintech_relevance,
    linkedSectors: row.linked_sectors ?? [],
    lastInteraction: formatDate(row.last_interaction),
    nextStep: row.next_step,
    documents: row.documents ?? [],
    aiSummary: row.ai_summary,
    recommendedUseCases: row.recommended_use_cases ?? []
  };
}

function mapDocument(row: DocumentRow): DocumentRecord {
  return {
    slug: row.slug,
    title: row.title,
    type: row.document_type,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url ?? undefined,
    sourcePackPath: row.source_pack_path,
    jurisdiction: row.jurisdiction,
    language: row.language,
    indexStatus: row.index_status,
    retrievedAt: row.retrieved_at ? formatDate(row.retrieved_at) : undefined,
    updatedAt: formatDate(row.updated_at),
    legalReviewRequired: row.legal_review_required,
    summary: row.summary,
    entities: row.entities ?? [],
    risks: row.risks ?? [],
    checklist: row.checklist ?? [],
    linkedCompanies: row.linked_companies ?? [],
    linkedPartners: row.linked_partners ?? [],
    aiUseCases: row.ai_use_cases ?? []
  };
}

function mapDocumentChunk(row: DocumentChunkRow): DocumentChunkRecord {
  const metadata = row.metadata ?? {};
  const documentSlug = row.documents.slug;
  const chunkIndex = row.chunk_index;

  return {
    chunkId: `${documentSlug}:${String(chunkIndex).padStart(3, "0")}`,
    chunkIndex,
    documentSlug,
    documentTitle: row.documents.title,
    sourcePackPath: String(
      metadata.source_pack_path ?? row.documents.source_pack_path
    ),
    sourceUrl: row.documents.source_url ?? undefined,
    sourceType: String(metadata.source_type ?? row.documents.document_type),
    jurisdiction: row.documents.jurisdiction,
    originalLanguage: toSourceLanguage(row.documents.language),
    section: String(metadata.section ?? "Document"),
    article:
      typeof metadata.article === "string" ? metadata.article : undefined,
    content: row.content,
    tokenCount: row.token_count,
    sourcePackVersion: String(metadata.source_pack_version ?? "unknown"),
    legalReviewRequired: row.documents.legal_review_required,
    embedding: parseVector(row.embedding)
  };
}

function mapDashboardMetric(row: DashboardMetricRow): DashboardMetric {
  return {
    value: row.value,
    label: {
      en: row.label_en,
      es: row.label_es
    },
    tone: row.tone
  };
}

function mapWorkflow(row: WorkflowRow): WorkflowRecord {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    status: row.status,
    steps: row.steps ?? []
  };
}

function mapReport(row: ReportRow): ReportRecord {
  return {
    slug: row.slug,
    title: row.title,
    reportType: row.report_type,
    status: row.status,
    periodStart: row.period_start ?? undefined,
    periodEnd: row.period_end ?? undefined,
    content: row.content ?? {}
  };
}

function mapAiUsageEvent(row: AiUsageEventRow): AiUsageEventRecord {
  return {
    feature: row.feature,
    provider: row.provider,
    model: row.model,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    costUsd: Number(row.cost_usd),
    locale: row.locale,
    createdAt: row.created_at,
    metadata: row.metadata ?? {}
  };
}

function toSourceLanguage(language: DocumentRecord["language"]) {
  return language === "Spanish" ? "es" : "en";
}

function parseVector(value: number[] | string | null) {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function toVectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}
