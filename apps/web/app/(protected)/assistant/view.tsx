"use client";

import type { AssistantAnswer } from "@anden/assistant";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  FileText,
  Lightbulb,
  Send
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocale } from "../shell/locale-context";

type AssistantMessage = {
  id: string;
  question: string;
  answer: AssistantAnswer;
  dataMode: string;
};

const goldenPrompts = {
  en: [
    "What is Anden's value proposition?",
    "Summarize the requirements for a company to join an Argentina digital zone.",
    "Which partners are most relevant for fintech companies?",
    "Generate a briefing for a meeting with a government stakeholder about expanding digital zone operations.",
    "What documents should we request from a new fintech company?"
  ],
  es: [
    "¿Cuál es la propuesta de valor de Andén?",
    "Resumí los requisitos para que una empresa entre en una zona digital argentina.",
    "¿Qué partners son más relevantes para empresas fintech?",
    "Generá un briefing para una reunión con un stakeholder de gobierno sobre operaciones de zona digital.",
    "¿Qué documentos deberíamos pedirle a una nueva empresa fintech?"
  ]
} as const;

const copy = {
  en: {
    eyebrow: "AI knowledge layer",
    title: "AI Knowledge Assistant",
    description:
      "Ask operational questions and review answers with cited internal and regulatory sources.",
    suggested: "Golden prompts",
    input: "Ask Anden OS",
    placeholder: "Ask about partners, onboarding, regulations, or founder briefs",
    ask: "Ask",
    sources: "Sources",
    inference: "Operational inference",
    confidence: "confidence",
    data: "Data",
    gap: "Knowledge gap",
    legal: "Legal review",
    originalSpanish: "Original language: Spanish",
    originalEnglish: "Original language: English"
  },
  es: {
    eyebrow: "Capa de conocimiento AI",
    title: "Asistente de conocimiento AI",
    description:
      "Consultá preguntas operativas y revisá respuestas con fuentes internas y regulatorias citadas.",
    suggested: "Prompts principales",
    input: "Preguntar a Anden OS",
    placeholder: "Preguntá sobre partners, onboarding, normativa o briefs",
    ask: "Preguntar",
    sources: "Fuentes",
    inference: "Inferencia operativa",
    confidence: "confianza",
    data: "Datos",
    gap: "Brecha de conocimiento",
    legal: "Revisión de Legal",
    originalSpanish: "Idioma original: español",
    originalEnglish: "Idioma original: inglés"
  }
} as const;

export function AssistantView() {
  const { locale } = useLocale();
  const t = copy[locale];
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function askAssistant(nextQuestion: string) {
    const trimmed = nextQuestion.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          locale,
          threadSlug: "default"
        })
      });
      const payload = (await response.json()) as {
        ok: boolean;
        dataMode?: string;
        answer?: AssistantAnswer;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.answer) {
        throw new Error(payload.error ?? "Assistant request failed");
      }

      const answer = payload.answer;
      setMessages((current) => [
        {
          id: `${Date.now()}`,
          question: trimmed,
          answer,
          dataMode: payload.dataMode ?? "mock"
        },
        ...current
      ]);
      setQuestion((current) => (current === trimmed ? "" : current));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Assistant request failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAssistant(question);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 xl:flex-row xl:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
            {t.eyebrow}
          </p>
          <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
            {t.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            {t.description}
          </p>
        </div>
        <div className="flex min-w-48 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3">
          <Bot size={18} aria-hidden className="text-[var(--anden-blue)]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {t.confidence}
            </p>
            <p className="text-lg font-semibold text-[var(--color-ink)]">
              {messages[0]?.answer.confidence ?? 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]">
                <Lightbulb size={18} aria-hidden />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                {t.suggested}
              </h2>
            </div>
            <div className="mt-4 grid gap-2">
              {goldenPrompts[locale].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void askAssistant(prompt)}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2 text-left text-sm font-semibold leading-5 text-[var(--color-ink)]"
                >
                  <span>{prompt}</span>
                  <ArrowRight size={16} aria-hidden />
                </button>
              ))}
            </div>
          </section>

          <form
            onSubmit={submitQuestion}
            className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
          >
            <label
              htmlFor="assistant-question"
              className="text-sm font-semibold text-[var(--color-ink)]"
            >
              {t.input}
            </label>
            <textarea
              id="assistant-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={5}
              placeholder={t.placeholder}
              className="mt-3 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3 text-sm leading-6 text-[var(--color-ink)] outline-none"
            />
            {error ? (
              <p className="mt-2 text-sm font-semibold text-[var(--anden-orange)]">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--anden-blue)] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Send size={16} aria-hidden />
              {isLoading ? "..." : t.ask}
            </button>
          </form>
        </aside>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--anden-blue)] text-white">
                  <Bot size={18} aria-hidden />
                </div>
                <p className="text-base font-semibold text-[var(--color-ink)]">
                  {goldenPrompts[locale][0]}
                </p>
              </div>
            </article>
          ) : null}

          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  {message.question}
                </h2>
                <span className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-1.5 text-xs font-bold text-[var(--color-muted)]">
                  {t.data}: {message.dataMode}
                </span>
              </div>

              {message.answer.kind === "knowledge_gap" ? (
                <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--anden-orange)]">
                    <AlertTriangle size={16} aria-hidden />
                    {t.gap}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-ink)]">
                    {message.answer.sourcedAnswer}
                  </p>
                </div>
              ) : (
                <>
                  {message.answer.legalReviewWarning ? (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--anden-orange)] p-4 text-[var(--anden-brown-dark)]">
                      <AlertTriangle size={18} aria-hidden />
                      <div>
                        <p className="text-sm font-bold">{t.legal}</p>
                        <p className="mt-1 text-sm leading-6">
                          {message.answer.legalReviewWarning}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-[var(--color-ink)]">
                    {message.answer.sourcedAnswer}
                  </p>

                  <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                    <h3 className="text-sm font-bold text-[var(--color-ink)]">
                      {t.inference}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {message.answer.operationalInference}
                    </p>
                  </section>
                </>
              )}

              <section className="mt-4">
                <h3 className="text-sm font-bold text-[var(--color-ink)]">
                  {t.sources}
                </h3>
                <div className="mt-3 grid gap-2">
                  {message.answer.citations.map((citation) => (
                    <div
                      key={citation.chunkId}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText size={16} aria-hidden />
                        <p className="text-sm font-semibold text-[var(--color-ink)]">
                          {citation.documentTitle}
                        </p>
                      </div>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        {citation.originalLanguage === "es"
                          ? t.originalSpanish
                          : t.originalEnglish}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {citation.section} · {citation.sourceType} ·{" "}
                        {Math.round(citation.confidence * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
