export type AiProvider = "mock" | "openai" | "ollama";

export const defaultAiProvider: AiProvider = "mock";

export type AiLocale = "en" | "es";

export type AiEnv = {
  AI_PROVIDER?: string;
  AI_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OLLAMA_BASE_URL?: string;
  AI_EMBEDDING_MODEL?: string;
  MAX_DEMO_AI_COST_USD?: string;
};

export type GenerateTextInput = {
  feature: string;
  locale: AiLocale;
  prompt: string;
  system?: string;
  maxOutputTokens?: number;
};

export type AiUsageEvent = {
  feature: string;
  provider: AiProvider;
  requestedProvider: AiProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  locale: AiLocale;
  createdAt: string;
  warningState: AiBudgetState;
  fallbackReason?: "not_configured" | "budget_exhausted" | "provider_error";
};

export type GenerateTextResult = {
  text: string;
  provider: AiProvider;
  requestedProvider: AiProvider;
  model: string;
  usage: AiUsageEvent;
};

export type EmbedTextsInput = {
  feature: string;
  locale: AiLocale;
  texts: string[];
};

export type EmbedTextsResult = {
  embeddings: number[][];
  provider: AiProvider;
  requestedProvider: AiProvider;
  model: string;
  usage: AiUsageEvent;
};

export type AiUsageStore = {
  getTotalCostUsd(): Promise<number>;
  recordUsage(event: AiUsageEvent): Promise<void>;
};

export type AiBudgetState = "normal" | "warning" | "blocked";

export type AiSpendStatus = {
  totalCostUsd: number;
  maxCostUsd: number;
  warningThresholdUsd: number;
  percentUsed: number;
  state: AiBudgetState;
};

export type AiClientOptions = {
  env: AiEnv;
  usageStore: AiUsageStore;
  fetch?: typeof fetch;
  now?: () => Date;
};

const openAiModelPricingUsdPer1MTokens: Record<
  string,
  { input: number; output: number }
> = {
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 }
};

const openAiEmbeddingPricingUsdPer1MTokens: Record<string, number> = {
  "text-embedding-3-small": 0.02
};

export class InMemoryAiUsageStore implements AiUsageStore {
  readonly events: AiUsageEvent[] = [];

  constructor(events: AiUsageEvent[] = []) {
    this.events = [...events];
  }

  async getTotalCostUsd() {
    return this.events.reduce((sum, event) => sum + event.estimatedCostUsd, 0);
  }

  async recordUsage(event: AiUsageEvent) {
    this.events.push(event);
  }
}

export function createAiClient(options: AiClientOptions) {
  return {
    async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
      const requestedProvider = resolveAiProvider(options.env);
      const model = resolveModel(options.env, requestedProvider);
      const totalCostUsd = await options.usageStore.getTotalCostUsd();
      const maxCostUsd = resolveMaxCostUsd(options.env);
      const spendStatus = getAiSpendStatus({
        totalCostUsd,
        maxCostUsd
      });

      if (requestedProvider === "openai" && !options.env.OPENAI_API_KEY) {
        return await createMockResult({
          input,
          requestedProvider,
          fallbackReason: "not_configured",
          spendStatus,
          usageStore: options.usageStore,
          now: options.now
        });
      }

      if (requestedProvider !== "mock" && spendStatus.state === "blocked") {
        return await createMockResult({
          input,
          requestedProvider,
          fallbackReason: "budget_exhausted",
          spendStatus,
          usageStore: options.usageStore,
          now: options.now
        });
      }

      if (requestedProvider === "openai") {
        try {
          return await generateOpenAiText({
            input,
            model,
            env: options.env,
            fetchImpl: options.fetch ?? globalThis.fetch,
            usageStore: options.usageStore,
            spendStatus,
            now: options.now
          });
        } catch {
          return await createMockResult({
            input,
            requestedProvider,
            fallbackReason: "provider_error",
            spendStatus,
            usageStore: options.usageStore,
            now: options.now
          });
        }
      }

      if (requestedProvider === "ollama") {
        try {
          return await generateOllamaText({
            input,
            model,
            env: options.env,
            fetchImpl: options.fetch ?? globalThis.fetch,
            usageStore: options.usageStore,
            spendStatus,
            now: options.now
          });
        } catch {
          return await createMockResult({
            input,
            requestedProvider,
            fallbackReason: "provider_error",
            spendStatus,
            usageStore: options.usageStore,
            now: options.now
          });
        }
      }

      return await createMockResult({
        input,
        requestedProvider,
        fallbackReason: requestedProvider === "mock" ? undefined : "not_configured",
        spendStatus,
        usageStore: options.usageStore,
        now: options.now
      });
    },
    async embedTexts(input: EmbedTextsInput): Promise<EmbedTextsResult> {
      const requestedProvider = resolveAiProvider(options.env);
      const model = resolveEmbeddingModel(options.env, requestedProvider);
      const totalCostUsd = await options.usageStore.getTotalCostUsd();
      const maxCostUsd = resolveMaxCostUsd(options.env);
      const spendStatus = getAiSpendStatus({
        totalCostUsd,
        maxCostUsd
      });

      if (requestedProvider === "openai" && !options.env.OPENAI_API_KEY) {
        return await createMockEmbeddingResult({
          input,
          requestedProvider,
          fallbackReason: "not_configured",
          spendStatus,
          usageStore: options.usageStore,
          now: options.now
        });
      }

      if (requestedProvider !== "mock" && spendStatus.state === "blocked") {
        return await createMockEmbeddingResult({
          input,
          requestedProvider,
          fallbackReason: "budget_exhausted",
          spendStatus,
          usageStore: options.usageStore,
          now: options.now
        });
      }

      if (requestedProvider === "openai") {
        try {
          return await generateOpenAiEmbeddings({
            input,
            model,
            env: options.env,
            fetchImpl: options.fetch ?? globalThis.fetch,
            usageStore: options.usageStore,
            spendStatus,
            now: options.now
          });
        } catch {
          return await createMockEmbeddingResult({
            input,
            requestedProvider,
            fallbackReason: "provider_error",
            spendStatus,
            usageStore: options.usageStore,
            now: options.now
          });
        }
      }

      if (requestedProvider === "ollama") {
        try {
          return await generateOllamaEmbeddings({
            input,
            model,
            env: options.env,
            fetchImpl: options.fetch ?? globalThis.fetch,
            usageStore: options.usageStore,
            spendStatus,
            now: options.now
          });
        } catch {
          return await createMockEmbeddingResult({
            input,
            requestedProvider,
            fallbackReason: "provider_error",
            spendStatus,
            usageStore: options.usageStore,
            now: options.now
          });
        }
      }

      return await createMockEmbeddingResult({
        input,
        requestedProvider,
        fallbackReason: requestedProvider === "mock" ? undefined : "not_configured",
        spendStatus,
        usageStore: options.usageStore,
        now: options.now
      });
    }
  };
}

export function resolveAiProvider(env: AiEnv): AiProvider {
  const provider = env.AI_PROVIDER?.toLowerCase();

  if (provider === "openai") {
    return "openai";
  }

  if (provider === "ollama") {
    return "ollama";
  }

  return defaultAiProvider;
}

export function getAiSpendStatus({
  totalCostUsd,
  maxCostUsd = 5
}: {
  totalCostUsd: number;
  maxCostUsd?: number;
}): AiSpendStatus {
  const warningThresholdUsd = maxCostUsd * 0.8;
  const percentUsed = maxCostUsd > 0 ? totalCostUsd / maxCostUsd : 1;
  const state =
    totalCostUsd >= maxCostUsd
      ? "blocked"
      : totalCostUsd >= warningThresholdUsd
        ? "warning"
        : "normal";

  return {
    totalCostUsd,
    maxCostUsd,
    warningThresholdUsd,
    percentUsed,
    state
  };
}

async function createMockResult({
  input,
  requestedProvider,
  fallbackReason,
  spendStatus,
  usageStore,
  now
}: {
  input: GenerateTextInput;
  requestedProvider: AiProvider;
  fallbackReason?: AiUsageEvent["fallbackReason"];
  spendStatus: AiSpendStatus;
  usageStore: AiUsageStore;
  now?: () => Date;
}): Promise<GenerateTextResult> {
  const output =
    input.locale === "es"
      ? "Respuesta mock de Andén OS. Usa fuentes internas sembradas y no genera costo."
      : "Anden OS mock response. It uses seeded internal sources and generates no cost.";

  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "mock",
    requestedProvider,
    model: "mock-deterministic",
    inputTokens: estimateTokens([input.system, input.prompt].join("\n")),
    outputTokens: estimateTokens(output),
    estimatedCostUsd: 0,
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state,
    fallbackReason
  };

  await usageStore.recordUsage(usage);

  return {
    text: output,
    provider: "mock",
    requestedProvider,
    model: "mock-deterministic",
    usage
  };
}

async function generateOpenAiText({
  input,
  model,
  env,
  fetchImpl,
  usageStore,
  spendStatus,
  now
}: {
  input: GenerateTextInput;
  model: string;
  env: AiEnv;
  fetchImpl: typeof globalThis.fetch;
  usageStore: AiUsageStore;
  spendStatus: AiSpendStatus;
  now?: () => Date;
}): Promise<GenerateTextResult> {
  const baseUrl = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(
    /\/$/,
    ""
  );
  const response = await fetchImpl(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [input.system, input.prompt].filter(Boolean).join("\n\n"),
      max_output_tokens: input.maxOutputTokens ?? 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const body = (await response.json()) as OpenAiResponseBody;
  const text = extractOpenAiText(body);
  const inputTokens =
    body.usage?.input_tokens ??
    estimateTokens([input.system, input.prompt].join("\n"));
  const outputTokens = body.usage?.output_tokens ?? estimateTokens(text);
  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "openai",
    requestedProvider: "openai",
    model,
    inputTokens,
    outputTokens,
    estimatedCostUsd: estimateOpenAiCostUsd({
      model,
      inputTokens,
      outputTokens
    }),
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state
  };

  await usageStore.recordUsage(usage);

  return {
    text,
    provider: "openai",
    requestedProvider: "openai",
    model,
    usage
  };
}

type OpenAiResponseBody = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

function extractOpenAiText(body: OpenAiResponseBody) {
  if (body.output_text) {
    return body.output_text;
  }

  const text = body.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n");

  if (!text) {
    throw new Error("OpenAI response did not include text output.");
  }

  return text;
}

async function generateOpenAiEmbeddings({
  input,
  model,
  env,
  fetchImpl,
  usageStore,
  spendStatus,
  now
}: {
  input: EmbedTextsInput;
  model: string;
  env: AiEnv;
  fetchImpl: typeof globalThis.fetch;
  usageStore: AiUsageStore;
  spendStatus: AiSpendStatus;
  now?: () => Date;
}): Promise<EmbedTextsResult> {
  const baseUrl = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(
    /\/$/,
    ""
  );
  const response = await fetchImpl(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: input.texts
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI embeddings request failed: ${response.status}`);
  }

  const body = (await response.json()) as OpenAiEmbeddingResponseBody;
  const embeddings = body.data.map((item) => item.embedding);
  const inputTokens =
    body.usage?.prompt_tokens ?? estimateTokens(input.texts.join("\n"));
  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "openai",
    requestedProvider: "openai",
    model,
    inputTokens,
    outputTokens: 0,
    estimatedCostUsd: estimateOpenAiEmbeddingCostUsd({
      model,
      inputTokens
    }),
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state
  };

  await usageStore.recordUsage(usage);

  return {
    embeddings,
    provider: "openai",
    requestedProvider: "openai",
    model,
    usage
  };
}

type OpenAiEmbeddingResponseBody = {
  data: Array<{ embedding: number[] }>;
  usage?: {
    prompt_tokens?: number;
  };
};

export function estimateOpenAiCostUsd({
  model,
  inputTokens,
  outputTokens
}: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const pricing =
    openAiModelPricingUsdPer1MTokens[model] ??
    openAiModelPricingUsdPer1MTokens["gpt-4.1-mini"];

  return roundUsd(
    (inputTokens / 1_000_000) * pricing.input +
      (outputTokens / 1_000_000) * pricing.output
  );
}

export function estimateOpenAiEmbeddingCostUsd({
  model,
  inputTokens
}: {
  model: string;
  inputTokens: number;
}) {
  const inputPrice =
    openAiEmbeddingPricingUsdPer1MTokens[model] ??
    openAiEmbeddingPricingUsdPer1MTokens["text-embedding-3-small"];

  return roundUsd((inputTokens / 1_000_000) * inputPrice);
}

async function generateOllamaText({
  input,
  model,
  env,
  fetchImpl,
  usageStore,
  spendStatus,
  now
}: {
  input: GenerateTextInput;
  model: string;
  env: AiEnv;
  fetchImpl: typeof globalThis.fetch;
  usageStore: AiUsageStore;
  spendStatus: AiSpendStatus;
  now?: () => Date;
}): Promise<GenerateTextResult> {
  const baseUrl = (env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(
    /\/$/,
    ""
  );
  const response = await fetchImpl(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt: [input.system, input.prompt].filter(Boolean).join("\n\n"),
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    response?: string;
    prompt_eval_count?: number;
    eval_count?: number;
  };
  const text = body.response;

  if (!text) {
    throw new Error("Ollama response did not include text output.");
  }

  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "ollama",
    requestedProvider: "ollama",
    model,
    inputTokens:
      body.prompt_eval_count ??
      estimateTokens([input.system, input.prompt].join("\n")),
    outputTokens: body.eval_count ?? estimateTokens(text),
    estimatedCostUsd: 0,
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state
  };

  await usageStore.recordUsage(usage);

  return {
    text,
    provider: "ollama",
    requestedProvider: "ollama",
    model,
    usage
  };
}

async function generateOllamaEmbeddings({
  input,
  model,
  env,
  fetchImpl,
  usageStore,
  spendStatus,
  now
}: {
  input: EmbedTextsInput;
  model: string;
  env: AiEnv;
  fetchImpl: typeof globalThis.fetch;
  usageStore: AiUsageStore;
  spendStatus: AiSpendStatus;
  now?: () => Date;
}): Promise<EmbedTextsResult> {
  const baseUrl = (env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(
    /\/$/,
    ""
  );
  const response = await fetchImpl(`${baseUrl}/api/embed`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: input.texts
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama embeddings request failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    embeddings?: number[][];
    prompt_eval_count?: number;
  };

  if (!body.embeddings) {
    throw new Error("Ollama response did not include embeddings.");
  }

  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "ollama",
    requestedProvider: "ollama",
    model,
    inputTokens: body.prompt_eval_count ?? estimateTokens(input.texts.join("\n")),
    outputTokens: 0,
    estimatedCostUsd: 0,
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state
  };

  await usageStore.recordUsage(usage);

  return {
    embeddings: body.embeddings,
    provider: "ollama",
    requestedProvider: "ollama",
    model,
    usage
  };
}

async function createMockEmbeddingResult({
  input,
  requestedProvider,
  fallbackReason,
  spendStatus,
  usageStore,
  now
}: {
  input: EmbedTextsInput;
  requestedProvider: AiProvider;
  fallbackReason?: AiUsageEvent["fallbackReason"];
  spendStatus: AiSpendStatus;
  usageStore: AiUsageStore;
  now?: () => Date;
}): Promise<EmbedTextsResult> {
  const embeddings = input.texts.map(createDeterministicEmbedding);
  const usage: AiUsageEvent = {
    feature: input.feature,
    provider: "mock",
    requestedProvider,
    model: "mock-embedding-1536",
    inputTokens: estimateTokens(input.texts.join("\n")),
    outputTokens: 0,
    estimatedCostUsd: 0,
    locale: input.locale,
    createdAt: (now?.() ?? new Date()).toISOString(),
    warningState: spendStatus.state,
    fallbackReason
  };

  await usageStore.recordUsage(usage);

  return {
    embeddings,
    provider: "mock",
    requestedProvider,
    model: "mock-embedding-1536",
    usage
  };
}

function resolveModel(env: AiEnv, provider: AiProvider) {
  if (env.AI_MODEL) {
    return env.AI_MODEL;
  }

  if (provider === "openai") {
    return "gpt-4.1-mini";
  }

  if (provider === "ollama") {
    return "llama3.2";
  }

  return "mock-deterministic";
}

function resolveEmbeddingModel(env: AiEnv, provider: AiProvider) {
  if (env.AI_EMBEDDING_MODEL) {
    return env.AI_EMBEDDING_MODEL;
  }

  if (provider === "openai") {
    return "text-embedding-3-small";
  }

  if (provider === "ollama") {
    return "nomic-embed-text";
  }

  return "mock-embedding-1536";
}

function resolveMaxCostUsd(env: AiEnv) {
  const parsed = Number(env.MAX_DEMO_AI_COST_USD ?? "5");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

function createDeterministicEmbedding(text: string) {
  const embedding = Array.from({ length: 1536 }, () => 0);
  const normalized = text.toLowerCase();

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    embedding[code % embedding.length] += 1;
  }

  const magnitude = Math.sqrt(
    embedding.reduce((sum, value) => sum + value * value, 0)
  );

  return magnitude === 0
    ? embedding
    : embedding.map((value) => roundEmbeddingValue(value / magnitude));
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

function roundUsd(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function roundEmbeddingValue(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
