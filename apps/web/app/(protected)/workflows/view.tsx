"use client";

import type { SourceCitation } from "@anden/rag";
import type {
  WorkflowLocale,
  WorkflowSimulationResult,
  WorkflowSlug,
  WorkflowStep
} from "@anden/workflows";
import type { WorkflowRecord, WorkflowRunRecord } from "@anden/db";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  History,
  Loader2,
  Play,
  Sparkles
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useLocale } from "../shell/locale-context";

type WorkflowsViewProps = {
  workflows: WorkflowRecord[];
  initialRuns: WorkflowRunRecord[];
  dataModeLabel: string;
};

type RunResult = WorkflowSimulationResult & {
  completedAt?: string;
};

type WorkflowFormState = Record<WorkflowSlug, Record<string, string>>;

const workflowOrder: WorkflowSlug[] = [
  "company-onboarding",
  "prepare-meeting",
  "publish-institutional-content"
];

const workflowDefaults: WorkflowFormState = {
  "company-onboarding": {
    company: "AtlasPay",
    sector: "Fintech",
    country: "Argentina"
  },
  "prepare-meeting": {
    company: "Civitas Cloud",
    stakeholder: "government stakeholder",
    objective: "expand digital zone operations"
  },
  "publish-institutional-content": {
    topic: "AI operating systems for digital zone teams"
  }
};

const workflowInputLabels: Record<WorkflowSlug, Record<string, string>> = {
  "company-onboarding": {
    company: "Company",
    sector: "Sector",
    country: "Country"
  },
  "prepare-meeting": {
    company: "Company",
    stakeholder: "Stakeholder",
    objective: "Objective"
  },
  "publish-institutional-content": {
    topic: "Topic"
  }
};

const copy = {
  en: {
    eyebrow: "Automation",
    title: "Workflows",
    description:
      "Run simulated onboarding, meeting preparation, and institutional content workflows with saved outputs.",
    run: "Run",
    running: "Running",
    data: "Data",
    output: "Generated output",
    sources: "Sources",
    confidence: "confidence",
    legal: "Legal review required",
    history: "Run history",
    noHistory: "No workflow runs yet.",
    steps: "Step progression",
    error: "Workflow request failed"
  },
  es: {
    eyebrow: "Automatizacion",
    title: "Workflows",
    description:
      "Ejecuta workflows simulados de onboarding, preparacion de reuniones y contenido institucional con outputs guardados.",
    run: "Ejecutar",
    running: "Ejecutando",
    data: "Datos",
    output: "Output generado",
    sources: "Fuentes",
    confidence: "confianza",
    legal: "Requiere revision de Legal",
    history: "Historial de corridas",
    noHistory: "Todavia no hay corridas.",
    steps: "Progreso de pasos",
    error: "Fallo la solicitud del workflow"
  }
} as const;

export function WorkflowsView({
  workflows,
  initialRuns,
  dataModeLabel
}: WorkflowsViewProps) {
  const { locale } = useLocale();
  const t = copy[locale];
  const definitions = useMemo(() => orderWorkflows(workflows), [workflows]);
  const [formState, setFormState] = useState<WorkflowFormState>(workflowDefaults);
  const [runs, setRuns] = useState<WorkflowRunRecord[]>(initialRuns);
  const [activeRun, setActiveRun] = useState<RunResult | undefined>();
  const [progressSteps, setProgressSteps] = useState<WorkflowStep[]>([]);
  const [runningSlug, setRunningSlug] = useState<WorkflowSlug | undefined>();
  const [error, setError] = useState<string | undefined>();

  async function runWorkflow(workflowSlug: WorkflowSlug) {
    setRunningSlug(workflowSlug);
    setError(undefined);
    setActiveRun(undefined);
    await animateSteps(definitions, workflowSlug, setProgressSteps);

    try {
      const response = await fetch("/api/workflows/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workflowSlug,
          locale,
          inputs: formState[workflowSlug]
        })
      });
      const payload = (await response.json()) as {
        ok: boolean;
        dataMode?: string;
        result?: RunResult;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.result) {
        throw new Error(payload.error ?? t.error);
      }

      const result = payload.result;
      setActiveRun(result);
      setProgressSteps(result.steps);
      setRuns((current) => [
        toWorkflowRunRecord(result, formState[workflowSlug]),
        ...current
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t.error);
    } finally {
      setRunningSlug(undefined);
    }
  }

  function updateField(
    workflowSlug: WorkflowSlug,
    field: string,
    value: string
  ) {
    setFormState((current) => ({
      ...current,
      [workflowSlug]: {
        ...current[workflowSlug],
        [field]: value
      }
    }));
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
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 text-sm font-bold text-[var(--color-muted)]">
          {t.data}: {dataModeLabel}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {definitions.map((workflow) => (
          <WorkflowCard
            key={workflow.slug}
            workflow={workflow}
            formValues={formState[workflow.slug]}
            locale={locale}
            isRunning={runningSlug === workflow.slug}
            onFieldChange={(field, value) =>
              updateField(workflow.slug, field, value)
            }
            onSubmit={() => void runWorkflow(workflow.slug)}
          />
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--anden-orange)] p-4 text-sm font-semibold text-[var(--anden-brown-dark)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <SectionTitle
            icon={<Sparkles size={18} aria-hidden />}
            title={t.output}
            description={activeRun ? `${activeRun.state} / ${activeRun.progress}%` : t.steps}
          />

          <StepProgress steps={activeRun?.steps ?? progressSteps} />

          {activeRun ? (
            <div className="mt-5 space-y-4">
              {activeRun.legalReviewRequired ? (
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--anden-orange)] p-3 text-sm font-bold text-[var(--anden-brown-dark)]">
                  <AlertTriangle size={16} aria-hidden />
                  {t.legal}
                </div>
              ) : null}
              <OutputSections outputs={activeRun.outputs} />
              <CitationList
                citations={activeRun.citations}
                confidence={activeRun.confidence}
                confidenceLabel={t.confidence}
                sourcesLabel={t.sources}
              />
            </div>
          ) : null}
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5">
          <SectionTitle
            icon={<History size={18} aria-hidden />}
            title={t.history}
            description={`${runs.length} saved runs`}
          />
          <div className="mt-5 space-y-3">
            {runs.length === 0 ? (
              <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 text-sm text-[var(--color-muted)]">
                {t.noHistory}
              </p>
            ) : (
              runs.map((run, index) => (
                <div
                  key={`${run.workflowSlug}-${run.startedAt}-${index}`}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {run.workflowName}
                    </p>
                    <span className="rounded-lg bg-[var(--anden-lime)] px-2.5 py-1 text-xs font-bold text-[var(--anden-brown-dark)]">
                      {run.state} / {run.progress}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    {run.category}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function WorkflowCard({
  workflow,
  formValues,
  locale,
  isRunning,
  onFieldChange,
  onSubmit
}: {
  workflow: WorkflowRecord & { slug: WorkflowSlug };
  formValues: Record<string, string>;
  locale: WorkflowLocale;
  isRunning: boolean;
  onFieldChange(field: string, value: string): void;
  onSubmit(): void;
}) {
  const labels = workflowInputLabels[workflow.slug];
  const t = copy[locale];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--anden-orange)]">
            {workflow.category}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
            {workflow.name}
          </h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--anden-cream-light)]">
          <Play size={17} aria-hidden />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {Object.entries(labels).map(([field, label]) => (
          <label
            key={field}
            className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            {label}
            <input
              value={formValues[field] ?? ""}
              onChange={(event) => onFieldChange(field, event.target.value)}
              className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm font-medium text-[var(--color-ink)] outline-none"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {workflow.steps.slice(0, 3).map((step, index) => (
          <p
            key={`${workflow.slug}-${index}`}
            className="text-xs font-medium text-[var(--color-muted)]"
          >
            {readStepName(step)}
          </p>
        ))}
      </div>

      <button
        type="submit"
        disabled={isRunning}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--anden-blue)] px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isRunning ? <Loader2 size={16} aria-hidden /> : <Play size={16} aria-hidden />}
        {isRunning ? t.running : `${t.run} ${workflow.name.toLowerCase()}`}
      </button>
    </form>
  );
}

function SectionTitle({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--anden-cream-light)]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function StepProgress({ steps }: { steps: WorkflowStep[] }) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-2">
      {steps.map((step, index) => (
        <div
          key={`${step.name}-${index}`}
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3"
        >
          <CheckCircle2
            size={16}
            aria-hidden
            className={
              step.status === "complete"
                ? "text-[var(--anden-lime)]"
                : "text-[var(--color-muted)]"
            }
          />
          <span className="text-sm font-semibold text-[var(--color-ink)]">
            {step.name}
          </span>
          <span className="ml-auto text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {step.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function OutputSections({
  outputs
}: {
  outputs: Record<string, string | string[]>;
}) {
  return (
    <div className="grid gap-3">
      {Object.entries(outputs).map(([key, value]) => (
        <section
          key={key}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
        >
          <h3 className="text-sm font-bold text-[var(--color-ink)]">
            {formatOutputLabel(key)}
          </h3>
          {Array.isArray(value) ? (
            <ul className="mt-3 grid gap-2">
              {value.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-6 text-[var(--color-muted)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {value}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

function CitationList({
  citations,
  confidence,
  confidenceLabel,
  sourcesLabel
}: {
  citations: SourceCitation[];
  confidence: number;
  confidenceLabel: string;
  sourcesLabel: string;
}) {
  return (
    <section>
      <h3 className="text-sm font-bold text-[var(--color-ink)]">
        {sourcesLabel} / {confidence}% {confidenceLabel}
      </h3>
      <div className="mt-3 grid gap-2">
        {citations.map((citation) => (
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
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {citation.section} / {citation.sourceType} /{" "}
              {Math.round(citation.confidence * 100)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function orderWorkflows(workflows: WorkflowRecord[]) {
  return workflowOrder
    .map((slug) => workflows.find((workflow) => workflow.slug === slug))
    .filter((workflow): workflow is WorkflowRecord & { slug: WorkflowSlug } =>
      Boolean(workflow)
    );
}

function toWorkflowRunRecord(
  result: RunResult,
  inputs: Record<string, string>
): WorkflowRunRecord {
  return {
    workflowSlug: result.workflowSlug,
    workflowName: workflowName(result.workflowSlug),
    category: workflowCategory(result.workflowSlug),
    state: result.state,
    progress: result.progress,
    inputs,
    outputs: {
      ...result.outputs,
      citations: result.citations,
      confidence: result.confidence,
      legalReviewRequired: result.legalReviewRequired
    },
    startedAt: result.completedAt ?? new Date().toISOString(),
    completedAt: result.completedAt
  };
}

async function animateSteps(
  workflows: Array<WorkflowRecord & { slug: WorkflowSlug }>,
  workflowSlug: WorkflowSlug,
  setSteps: (steps: WorkflowStep[]) => void
) {
  const workflow = workflows.find((item) => item.slug === workflowSlug);
  const baseSteps = (workflow?.steps ?? []).map((step) => ({
    name: readStepName(step),
    status: "queued" as const
  }));

  for (let index = 0; index < baseSteps.length; index += 1) {
    setSteps(
      baseSteps.map((step, stepIndex) => ({
        ...step,
        status:
          stepIndex < index
            ? "complete"
            : stepIndex === index
              ? "active"
              : "queued"
      }))
    );
    await new Promise((resolve) => setTimeout(resolve, 90));
  }
}

function readStepName(step: unknown) {
  if (typeof step === "object" && step && "name" in step) {
    return String(step.name);
  }

  return "Workflow step";
}

function formatOutputLabel(key: string) {
  if (key === "followUpEmail") {
    return "Follow-up email";
  }

  if (key === "linkedInPost") {
    return "LinkedIn post";
  }

  if (key === "seoMetadata") {
    return "SEO metadata";
  }

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function workflowName(slug: WorkflowSlug) {
  return (
    {
      "company-onboarding": "Company onboarding",
      "prepare-meeting": "Prepare meeting",
      "publish-institutional-content": "Publish institutional content"
    } as const
  )[slug];
}

function workflowCategory(slug: WorkflowSlug) {
  return (
    {
      "company-onboarding": "onboarding",
      "prepare-meeting": "briefing",
      "publish-institutional-content": "content"
    } as const
  )[slug];
}
