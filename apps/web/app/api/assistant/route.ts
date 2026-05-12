import { answerAssistantQuestion, type AssistantLocale } from "@anden/assistant";
import { NextResponse } from "next/server";
import {
  createRuntimeAiClient,
  getAssistantChunks,
  getAssistantMessages,
  recordAssistantExchange
} from "../../(protected)/data/demo-repository";

type AssistantRequestBody = {
  question?: string;
  locale?: AssistantLocale;
  threadSlug?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const threadSlug = normalizeThreadSlug(url.searchParams.get("threadSlug"));
  const messages = await getAssistantMessages(threadSlug);

  return NextResponse.json({
    ok: true,
    dataMode: messages.mode,
    threadSlug,
    messages: messages.data
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AssistantRequestBody;
  const question = body.question?.trim();
  const locale = body.locale === "es" ? "es" : "en";

  if (!question) {
    return NextResponse.json(
      { ok: false, error: "Question is required" },
      { status: 400 }
    );
  }

  const chunks = await getAssistantChunks();
  const answer = await answerAssistantQuestion({
    question,
    locale,
    chunks: chunks.data,
    aiClient: createRuntimeAiClient()
  });

  await recordAssistantExchange({
    question,
    answer,
    threadSlug: normalizeThreadSlug(body.threadSlug)
  });

  return NextResponse.json({
    ok: true,
    dataMode: chunks.mode,
    answer
  });
}

function normalizeThreadSlug(value?: string | null) {
  const slug = value?.trim().toLowerCase();
  return slug || "default";
}
