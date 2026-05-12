import type {
  EmbedTextsInput,
  EmbedTextsResult,
  GenerateTextInput,
  GenerateTextResult
} from "@anden/ai";
import {
  retrieveRelevantChunks,
  type RetrievalResult,
  type SourceCitation,
  type SourcePackChunk
} from "@anden/rag";

export type AssistantLocale = "en" | "es";

export type AssistantAiClient = {
  embedTexts(input: EmbedTextsInput): Promise<EmbedTextsResult>;
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
};

export type AssistantAnswer =
  | {
      kind: "answer";
      question: string;
      locale: AssistantLocale;
      sourcedAnswer: string;
      operationalInference: string;
      citations: SourceCitation[];
      confidence: number;
      legalReviewRequired: boolean;
      legalReviewWarning?: string;
      provider: GenerateTextResult["provider"];
      model: string;
    }
  | {
      kind: "knowledge_gap";
      question: string;
      locale: AssistantLocale;
      sourcedAnswer: string;
      operationalInference: string;
      citations: [];
      confidence: 0;
      legalReviewRequired: false;
      knowledgeGap: {
        reason: string;
      };
      provider: GenerateTextResult["provider"];
      model: string;
    };

export async function answerAssistantQuestion({
  question,
  locale,
  chunks,
  aiClient
}: {
  question: string;
  locale: AssistantLocale;
  chunks: SourcePackChunk[];
  aiClient: AssistantAiClient;
}): Promise<AssistantAnswer> {
  const retrieval = await retrieveRelevantChunks({
    query: question,
    chunks,
    embedTexts: async ({ feature, texts }) => {
      const result = await aiClient.embedTexts({ feature, locale, texts });
      return { embeddings: result.embeddings };
    },
    limit: 4,
    minConfidence: 0.18
  });

  const jurisdictionGap = detectJurisdictionGap(question, retrieval);

  if (retrieval.kind === "knowledge_gap" || jurisdictionGap) {
    const draft = await aiClient.generateText({
      feature: "assistant",
      locale,
      prompt: buildKnowledgeGapPrompt(question, retrieval)
    });

    return {
      kind: "knowledge_gap",
      question,
      locale,
      sourcedAnswer: knowledgeGapCopy[locale],
      operationalInference: operationalGapCopy[locale],
      citations: [],
      confidence: 0,
      legalReviewRequired: false,
      knowledgeGap: {
        reason:
          jurisdictionGap ??
          (retrieval.kind === "knowledge_gap"
            ? retrieval.reason
            : "No indexed source chunk met the retrieval confidence threshold.")
      },
      provider: draft.provider,
      model: draft.model
    };
  }

  const draft = await aiClient.generateText({
    feature: "assistant",
    locale,
    system: assistantSystemPrompt[locale],
    prompt: buildAnswerPrompt(question, retrieval.citations)
  });
  const legalReviewRequired = retrieval.citations.some(
    (citation) =>
      citation.legalReviewRequired ||
      citation.jurisdiction === "Argentina" ||
      citation.originalLanguage === "es"
  );
  const confidence = averageConfidence(retrieval.citations);
  const mockAnswer =
    draft.provider === "mock"
      ? composeMockSourcedAnswer({ question, locale, citations: retrieval.citations })
      : draft.text;

  return {
    kind: "answer",
    question,
    locale,
    sourcedAnswer: mockAnswer,
    operationalInference: composeOperationalInference({
      question,
      locale,
      legalReviewRequired
    }),
    citations: retrieval.citations,
    confidence,
    legalReviewRequired,
    legalReviewWarning: legalReviewRequired
      ? legalReviewWarningCopy[locale]
      : undefined,
    provider: draft.provider,
    model: draft.model
  };
}

const assistantSystemPrompt = {
  en: "Answer as Anden OS. Cite internal sources, separate operational inference, and do not invent evidence.",
  es: "Responde como Anden OS. Cita fuentes internas, separa inferencia operativa y no inventes evidencia."
} as const;

const legalReviewWarningCopy = {
  en: "AI-generated operational draft. Regulatory interpretations require Legal review before external use or company onboarding decisions.",
  es: "Borrador operativo generado por AI. Las interpretaciones regulatorias requieren revisión de Legal antes de uso externo o decisiones de onboarding."
} as const;

const knowledgeGapCopy = {
  en: "I do not have enough indexed internal or regulatory evidence to answer this confidently.",
  es: "No tengo suficiente evidencia interna o regulatoria indexada para responder con confianza."
} as const;

const operationalGapCopy = {
  en: "Log this as a knowledge gap and add or review source-pack material before using it in a decision.",
  es: "Registrá esto como brecha de conocimiento y agregá o revisá material del source pack antes de usarlo en una decisión."
} as const;

function buildAnswerPrompt(question: string, citations: SourceCitation[]) {
  return [
    `Question: ${question}`,
    "Sources:",
    ...citations.map(
      (citation, index) =>
        `[${index + 1}] ${citation.documentTitle} / ${citation.section}\n${citation.excerpt}`
    )
  ].join("\n\n");
}

function buildKnowledgeGapPrompt(question: string, retrieval: RetrievalResult) {
  return `Question: ${question}\nRetrieval result: ${retrieval.kind}`;
}

function detectJurisdictionGap(
  question: string,
  retrieval: RetrievalResult
): string | undefined {
  if (retrieval.kind === "knowledge_gap") {
    return undefined;
  }

  const requestedJurisdiction = requestedUnsupportedJurisdiction(question);

  if (!requestedJurisdiction) {
    return undefined;
  }

  const hasJurisdictionSource = retrieval.citations.some(
    (citation) => normalize(citation.jurisdiction) === requestedJurisdiction
  );

  return hasJurisdictionSource
    ? undefined
    : `No indexed source covers the requested jurisdiction: ${requestedJurisdiction}.`;
}

function requestedUnsupportedJurisdiction(question: string) {
  const normalizedQuestion = normalize(question);
  const knownUnsupportedJurisdictions = ["brazil", "brasil"];

  return knownUnsupportedJurisdictions.find((jurisdiction) =>
    normalizedQuestion.includes(jurisdiction)
  );
}

function composeMockSourcedAnswer({
  question,
  locale,
  citations
}: {
  question: string;
  locale: AssistantLocale;
  citations: SourceCitation[];
}) {
  const topCitation = citations[0];
  const normalizedQuestion = normalize(question);

  if (normalizedQuestion.includes("value proposition")) {
    return locale === "es"
      ? "Andén OS es un backoffice interno de AI para operar conocimiento, partners, empresas, documentos, procesos y decisiones con fuentes internas citadas."
      : "Anden OS is an internal AI backoffice for operating knowledge, partners, companies, documents, processes, and decisions with cited internal sources.";
  }

  if (topCitation) {
    return locale === "es"
      ? `Según ${topCitation.documentTitle}, la respuesta debe basarse en ${topCitation.section}: ${trimExcerpt(topCitation.excerpt)}`
      : `According to ${topCitation.documentTitle}, the answer should rely on ${topCitation.section}: ${trimExcerpt(topCitation.excerpt)}`;
  }

  return knowledgeGapCopy[locale];
}

function composeOperationalInference({
  question,
  locale,
  legalReviewRequired
}: {
  question: string;
  locale: AssistantLocale;
  legalReviewRequired: boolean;
}) {
  const normalizedQuestion = normalize(question);

  if (normalizedQuestion.includes("value proposition")) {
    return locale === "es"
      ? "Usalo como narrativa para founders: demuestra leverage operativo sin prometer producción completa."
      : "Use this as founder-facing positioning: it demonstrates operational leverage without overstating production readiness.";
  }

  if (legalReviewRequired) {
    return locale === "es"
      ? "Tratalo como borrador operativo y pedí revisión de Legal antes de compartirlo externamente."
      : "Treat this as an operational draft and request Legal review before external use.";
  }

  return locale === "es"
    ? "Usalo como borrador interno y mantené las fuentes vinculadas."
    : "Use this as an internal draft and keep the cited sources attached.";
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

function trimExcerpt(excerpt: string) {
  return excerpt.replace(/\s+/g, " ").slice(0, 220);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
