# Anden OS

Anden OS is a password-protected AI backoffice demo for Anden operations. It
shows an internal system for operating companies, partners, documents,
workflows, AI knowledge retrieval, and executive reports.

The demo is built as a pnpm monorepo:

- `apps/web`: Next.js app, password gate, shell, and product routes.
- `packages/ai`: AI provider adapter, mock fallback, OpenAI/Ollama support, and
  USD cost guard.
- `packages/db`: Supabase repository and shared data types.
- `packages/rag`: source-pack retrieval and citation helpers.
- `packages/assistant`: cited AI Knowledge Assistant.
- `packages/workflows`: workflow simulation engine.
- `packages/reports`: weekly operating brief generator.
- `supabase`: local schema, migrations, seed data, and source pack.

## Quick Start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Open `http://127.0.0.1:3000` and use the access code from
`DEMO_ACCESS_CODE`. The default local code is `anden-demo`.

The app runs without Supabase or paid AI credentials. With no environment
variables configured, it uses mock data and deterministic AI fallbacks.

## Core Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
pnpm build
pnpm validate:db:artifacts
```

Local Supabase commands:

```bash
pnpm db:start
pnpm db:reset
pnpm validate:db
pnpm db:stop
```

## Demo Docs

- [Local demo runbook](docs/local-demo-runbook.md)
- [Deploy guide](docs/deploy.md)
- [7-minute demo script](docs/demo-script.md)
- [Smoke test checklist](docs/smoke-test.md)
- [Supabase persistence](docs/supabase.md)

## Environment Summary

For local development, put variables in `apps/web/.env.local`. For Vercel,
configure them in the project dashboard.

Required for the protected demo:

```bash
DEMO_ACCESS_CODE=...
```

Optional hosted AI:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=...
AI_MODEL=gpt-4.1-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
MAX_DEMO_AI_COST_USD=5
```

Optional Supabase live data:

```bash
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Use server-only Supabase variables in deploys. Do not expose the service-role
key with a `NEXT_PUBLIC_` prefix.

## Demo Reset

Mock-mode reset:

1. Click `Lock demo`.
2. Clear browser site data for the demo URL if locale state should reset.
3. Log in again and start from `/dashboard`.

Supabase local reset:

```bash
pnpm db:reset
```

Hosted Supabase reset is intentionally manual. See
[docs/deploy.md](docs/deploy.md) before resetting remote data.
