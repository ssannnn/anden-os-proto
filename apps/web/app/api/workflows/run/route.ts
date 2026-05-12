import { retrieveRelevantChunks } from "@anden/rag";
import {
  runWorkflowSimulation,
  type WorkflowLocale,
  type WorkflowSlug
} from "@anden/workflows";
import { NextResponse } from "next/server";
import {
  createRuntimeAiClient,
  getAssistantChunks,
  recordWorkflowRun
} from "../../../(protected)/data/demo-repository";

type WorkflowRunRequestBody = {
  workflowSlug?: string;
  locale?: WorkflowLocale;
  inputs?: Record<string, string>;
};

const workflowSlugs: WorkflowSlug[] = [
  "company-onboarding",
  "prepare-meeting",
  "publish-institutional-content"
];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as WorkflowRunRequestBody;
  const workflowSlug = normalizeWorkflowSlug(body.workflowSlug);

  if (!workflowSlug) {
    return NextResponse.json(
      { ok: false, error: "Valid workflowSlug is required" },
      { status: 400 }
    );
  }

  const locale = body.locale === "es" ? "es" : "en";
  const inputs = normalizeInputs(body.inputs);
  const chunks = await getAssistantChunks();
  const aiClient = createRuntimeAiClient();
  const retrieval = await retrieveRelevantChunks({
    query: buildRetrievalQuery(workflowSlug, inputs),
    chunks: chunks.data,
    embedTexts: async ({ feature, texts }) => {
      const result = await aiClient.embedTexts({ feature, locale, texts });
      return { embeddings: result.embeddings };
    },
    limit: 4,
    minConfidence: 0.12
  });
  const citations = retrieval.kind === "sources_found" ? retrieval.citations : [];
  const result = runWorkflowSimulation({
    workflowSlug,
    locale,
    inputs,
    citations
  });
  const completedAt = new Date().toISOString();

  await recordWorkflowRun({
    workflowSlug,
    state: result.state,
    progress: result.progress,
    inputs,
    outputs: {
      ...result.outputs,
      citations: result.citations,
      confidence: result.confidence,
      legalReviewRequired: result.legalReviewRequired
    },
    completedAt
  });

  return NextResponse.json({
    ok: true,
    dataMode: chunks.mode,
    result: {
      ...result,
      completedAt
    }
  });
}

function normalizeWorkflowSlug(value?: string): WorkflowSlug | undefined {
  return workflowSlugs.find((slug) => slug === value);
}

function normalizeInputs(inputs?: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(inputs ?? {}).map(([key, value]) => [key, value.trim()])
  );
}

function buildRetrievalQuery(
  workflowSlug: WorkflowSlug,
  inputs: Record<string, string>
) {
  if (workflowSlug === "company-onboarding") {
    return [
      inputs.company,
      inputs.sector,
      inputs.country,
      "company onboarding document request Knowledge Economy registration legal review"
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (workflowSlug === "prepare-meeting") {
    return [
      inputs.company,
      inputs.stakeholder,
      inputs.objective,
      "government stakeholder meeting talking points free zone risks"
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    inputs.topic,
    "Anden value proposition AI backoffice workflow automation executive reporting"
  ]
    .filter(Boolean)
    .join(" ");
}
