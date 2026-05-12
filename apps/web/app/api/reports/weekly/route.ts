import { retrieveRelevantChunks } from "@anden/rag";
import { generateWeeklyOperatingBrief, type WeeklyBriefLocale } from "@anden/reports";
import { NextResponse } from "next/server";
import {
  createRuntimeAiClient,
  getAssistantChunks,
  getAssistantMessages,
  getCompaniesData,
  getDashboardData,
  getDocumentsData,
  getPartnersData,
  getWorkflowRunsData,
  recordReport
} from "../../../(protected)/data/demo-repository";

type WeeklyReportRequestBody = {
  locale?: WeeklyBriefLocale;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as WeeklyReportRequestBody;
  const locale = body.locale === "es" ? "es" : "en";
  const periodEnd = todayIsoDate();
  const periodStart = offsetIsoDate(periodEnd, -7);
  const [
    dashboard,
    companies,
    partners,
    documents,
    workflowRuns,
    assistantMessages,
    chunks
  ] = await Promise.all([
    getDashboardData(),
    getCompaniesData(),
    getPartnersData(),
    getDocumentsData(),
    getWorkflowRunsData(),
    getAssistantMessages("default"),
    getAssistantChunks()
  ]);
  const aiClient = createRuntimeAiClient();
  const retrieval = await retrieveRelevantChunks({
    query:
      "weekly operating brief progress risks next steps opportunities blockers legal review founder briefing",
    chunks: chunks.data,
    embedTexts: async ({ feature, texts }) => {
      const result = await aiClient.embedTexts({ feature, locale, texts });
      return { embeddings: result.embeddings };
    },
    limit: 5,
    minConfidence: 0.12
  });
  const report = await generateWeeklyOperatingBrief({
    locale,
    periodStart,
    periodEnd,
    dashboard: dashboard.data,
    companies: companies.data,
    partners: partners.data,
    documents: documents.data,
    workflowRuns: workflowRuns.data,
    assistantMessages: assistantMessages.data,
    citations: retrieval.kind === "sources_found" ? retrieval.citations : [],
    aiClient
  });

  await recordReport({
    slug: report.slug,
    title: report.title,
    reportType: report.reportType,
    status: report.status,
    locale: report.locale,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    content: report.content,
    citations: report.citations,
    provider: report.provider,
    requestedProvider: report.requestedProvider,
    model: report.model,
    estimatedCostUsd: report.estimatedCostUsd,
    legalReviewRequired: report.legalReviewRequired,
    generatedAt: report.generatedAt
  });

  return NextResponse.json({
    ok: true,
    dataMode: dashboard.mode,
    report
  });
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function offsetIsoDate(date: string, offsetDays: number) {
  const nextDate = new Date(`${date}T00:00:00.000Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + offsetDays);
  return nextDate.toISOString().slice(0, 10);
}
