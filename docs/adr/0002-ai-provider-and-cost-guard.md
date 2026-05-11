# ADR 0002: AI Provider And Cost Guard

## Status

Accepted

## Date

2026-05-11

## Context

The demo must be shareable through a public deploy, but AI usage must remain low-cost. The budget ceiling for the initial demo is USD 5. Ollama is useful for local development, but not the simplest option for a public Vercel deploy.

## Decision

Use Vercel + Supabase Free + OpenAI API for the shareable demo, with a hard operational limit of USD 5.

Create an AI provider adapter with these modes:

- `mock`: deterministic fallback responses for golden paths and cost-limit fallback
- `openai`: hosted AI for the deployed demo
- `ollama`: optional local development provider

Use environment variables for model selection. The implementation should default to the cheapest suitable current OpenAI chat model and use `text-embedding-3-small` for embeddings unless a better low-cost option is selected during implementation.

Do not use OpenAI File Search, Web Search, or other paid managed retrieval features for the MVP. Build RAG with the app's own document chunks and vector search.

Persist AI usage events with:

- feature
- provider
- model
- estimated input tokens
- estimated output tokens
- estimated cost in USD
- locale
- created timestamp

Use `MAX_DEMO_AI_COST_USD=5`.

When estimated spend reaches 80%, show an internal warning. When estimated spend reaches or exceeds 100%, block hosted OpenAI calls and use the `mock` provider fallback.

## Consequences

The demo can be shared publicly while keeping cost bounded.

The AI layer remains portable: a later production version can switch model providers without rewriting product features.

Some demo paths must have high-quality mock fallbacks so the product remains reliable after the cost guard trips.
