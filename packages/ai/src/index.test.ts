import { describe, expect, it, vi } from "vitest";
import {
  createAiClient,
  getAiSpendStatus,
  InMemoryAiUsageStore,
  type AiUsageEvent
} from "./index";

describe("AI provider adapter", () => {
  it("uses deterministic mock behavior when no hosted provider is configured", async () => {
    const usageStore = new InMemoryAiUsageStore();
    const client = createAiClient({ env: {}, usageStore });

    const result = await client.generateText({
      feature: "assistant",
      locale: "en",
      prompt: "What is Anden's value proposition?"
    });

    expect(result.provider).toBe("mock");
    expect(result.text).toContain("mock");
    expect(result.usage.estimatedCostUsd).toBe(0);
    expect(await usageStore.getTotalCostUsd()).toBe(0);
    expect(usageStore.events).toHaveLength(1);
    expect(usageStore.events[0]).toMatchObject({
      feature: "assistant",
      provider: "mock",
      locale: "en"
    });
  });

  it("records not-configured fallback when a hosted provider is requested without credentials", async () => {
    const usageStore = new InMemoryAiUsageStore();
    const fetch = vi.fn();
    const client = createAiClient({
      env: { AI_PROVIDER: "openai" },
      usageStore,
      fetch
    });

    const result = await client.generateText({
      feature: "assistant",
      locale: "en",
      prompt: "Use hosted AI."
    });

    expect(result.provider).toBe("mock");
    expect(result.requestedProvider).toBe("openai");
    expect(result.usage.fallbackReason).toBe("not_configured");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses OpenAI when configured and records estimated paid usage", async () => {
    const usageStore = new InMemoryAiUsageStore();
    const fetch = vi.fn(async () =>
      Response.json({
        output_text: "Hosted OpenAI response",
        usage: {
          input_tokens: 1000,
          output_tokens: 500
        }
      })
    );
    const client = createAiClient({
      env: {
        AI_PROVIDER: "openai",
        OPENAI_API_KEY: "test-key",
        AI_MODEL: "gpt-4.1-mini"
      },
      usageStore,
      fetch
    });

    const result = await client.generateText({
      feature: "assistant",
      locale: "en",
      prompt: "Generate a short answer."
    });

    expect(result.provider).toBe("openai");
    expect(result.text).toBe("Hosted OpenAI response");
    expect(result.usage).toMatchObject({
      feature: "assistant",
      provider: "openai",
      requestedProvider: "openai",
      model: "gpt-4.1-mini",
      inputTokens: 1000,
      outputTokens: 500,
      locale: "en"
    });
    expect(result.usage.estimatedCostUsd).toBeGreaterThan(0);
    expect(await usageStore.getTotalCostUsd()).toBe(result.usage.estimatedCostUsd);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("reports warning state after 80 percent of the configured budget", () => {
    expect(getAiSpendStatus({ totalCostUsd: 4.01, maxCostUsd: 5 })).toMatchObject({
      state: "warning",
      warningThresholdUsd: 4,
      maxCostUsd: 5
    });
  });

  it("routes hosted calls to mock fallback when the hard cap is already reached", async () => {
    const usageStore = new InMemoryAiUsageStore([
      usageEvent({ estimatedCostUsd: 5 })
    ]);
    const fetch = vi.fn();
    const client = createAiClient({
      env: {
        AI_PROVIDER: "openai",
        OPENAI_API_KEY: "test-key",
        MAX_DEMO_AI_COST_USD: "5"
      },
      usageStore,
      fetch
    });

    const result = await client.generateText({
      feature: "assistant",
      locale: "es",
      prompt: "Resume Andén."
    });

    expect(result.provider).toBe("mock");
    expect(result.requestedProvider).toBe("openai");
    expect(result.usage.fallbackReason).toBe("budget_exhausted");
    expect(result.usage.warningState).toBe("blocked");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("supports optional Ollama mode for local no-cost generation", async () => {
    const usageStore = new InMemoryAiUsageStore();
    const fetch = vi.fn(async () =>
      Response.json({
        response: "Ollama local response",
        prompt_eval_count: 42,
        eval_count: 24
      })
    );
    const client = createAiClient({
      env: {
        AI_PROVIDER: "ollama",
        OLLAMA_BASE_URL: "http://127.0.0.1:11434",
        AI_MODEL: "llama3.2"
      },
      usageStore,
      fetch
    });

    const result = await client.generateText({
      feature: "assistant",
      locale: "en",
      prompt: "Generate locally."
    });

    expect(result.provider).toBe("ollama");
    expect(result.text).toBe("Ollama local response");
    expect(result.usage).toMatchObject({
      provider: "ollama",
      model: "llama3.2",
      inputTokens: 42,
      outputTokens: 24,
      estimatedCostUsd: 0
    });
  });
});

function usageEvent(overrides: Partial<AiUsageEvent> = {}): AiUsageEvent {
  return {
    feature: "assistant",
    provider: "openai",
    requestedProvider: "openai",
    model: "gpt-4.1-mini",
    inputTokens: 100,
    outputTokens: 100,
    estimatedCostUsd: 0.001,
    locale: "en",
    createdAt: "2026-05-11T00:00:00.000Z",
    warningState: "normal",
    ...overrides
  };
}
