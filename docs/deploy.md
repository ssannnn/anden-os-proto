# Demo Deploy Guide

This guide prepares Anden OS for a shareable, password-protected Vercel demo.
The app is intentionally light-theme only and supports EN/ES through the in-app
locale toggle.

## Recommended Deployment Shape

- Hosting: Vercel
- App root: `apps/web`
- Data mode: mock fallback for the safest zero-cost demo, or Supabase live after
  issue #15 is completed
- AI mode: `mock` for zero cost, or `openai` with `MAX_DEMO_AI_COST_USD=5`
- Access: password gate through `DEMO_ACCESS_CODE`

`apps/web/vercel.json` pins the project to the Next.js framework and runs the
web build from the monorepo root so workspace packages resolve correctly.
This follows Vercel's monorepo deployment pattern:
https://vercel.com/academy/production-monorepos/deploy-web-app

## Vercel Project Settings

1. Import `ssannnn/anden-os-proto` into Vercel.
2. Set Root Directory to `apps/web`.
3. Keep Framework Preset as `Next.js`.
4. Keep Install Command as Vercel's default `pnpm install`.
5. Keep Build Command as `cd ../.. && pnpm --filter @anden/web build`.
6. Add environment variables from the sections below.
7. Deploy.
8. Open `/login` and verify the password gate before sharing the URL.

## Required Environment Variables

```bash
DEMO_ACCESS_CODE=choose-a-non-public-demo-code
```

The app defaults to `anden-demo` only when this variable is missing. A shared
deploy should always set a non-default value.

## AI Provider Configuration

Zero-cost mode:

```bash
AI_PROVIDER=mock
MAX_DEMO_AI_COST_USD=5
```

Hosted OpenAI mode:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=...
AI_MODEL=gpt-4.1-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
MAX_DEMO_AI_COST_USD=5
```

Behavior:

- If `AI_PROVIDER=openai` is set without `OPENAI_API_KEY`, the app falls back to
  mock AI.
- If estimated usage reaches `MAX_DEMO_AI_COST_USD`, hosted AI calls are blocked
  and mock fallback keeps the demo usable.
- Usage events store provider, model, estimated tokens, estimated cost, locale,
  and warning state when Supabase write credentials are configured.

Optional local-only Ollama mode:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
AI_MODEL=llama3.2
AI_EMBEDDING_MODEL=nomic-embed-text
```

Do not use Ollama for the shared Vercel deploy.

## Supabase Configuration

The app runs without Supabase by using mock fallback data. Configure Supabase
only after the hosted project exists and `supabase/seed.sql` has been applied.

Preferred server-only deploy variables:

```bash
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Read-only fallback:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Use service-role variables only as server-side Vercel variables. Never expose
the service-role key with a `NEXT_PUBLIC_` prefix.

See [docs/supabase.md](supabase.md) for local and remote schema operations.

## Demo Reset Procedure

Mock deploy reset:

1. Click `Lock demo`.
2. Open the browser's site settings for the deploy URL and clear site data if
   the locale should reset to English.
3. Log in again and start from `/dashboard`.

Local Supabase reset:

```bash
pnpm db:start
pnpm db:reset
pnpm validate:db
pnpm db:stop
```

Hosted Supabase reset:

1. Confirm no stakeholder is using the demo.
2. Export or screenshot any generated reports you need to keep.
3. In Supabase SQL editor, review `supabase/seed.sql`.
4. Prefer re-applying seed data manually for demo tables.
5. Use `supabase db reset --linked` only when you intentionally want to wipe
   hosted demo data.

## Pre-Share Verification

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm validate:db:artifacts
pnpm build
E2E_PORT=3307 pnpm test:e2e
```

Then complete [docs/smoke-test.md](smoke-test.md) against the deployed URL.
