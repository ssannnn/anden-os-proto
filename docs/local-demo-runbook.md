# Local Demo Runbook

Use this when you want to run the demo locally and walk through the
7-minute script yourself.

## Prerequisites

- Node.js available through the repo's normal shell.
- pnpm installed.
- Docker running if you want Supabase local mode.
- Repo checked out at `anden-os`.

Start from the repo root:

```bash
cd /home/santi/Desktop/anden-projects/anden-os
```

Install dependencies if this is a fresh checkout:

```bash
pnpm install
```

## Option A: Full Local Demo With Supabase

This is the recommended path when testing the full local experience. It uses
Supabase local for persisted demo reads/writes and `AI_PROVIDER=mock` so there
is no OpenAI cost.

1. Start Supabase:

```bash
pnpm db:start
```

2. Reset and seed local data:

```bash
pnpm db:reset
```

3. Export local Supabase env vars:

```bash
eval "$(
  pnpm exec supabase status -o env \
    --override-name api.url=SUPABASE_URL \
    --override-name auth.service_role_key=SUPABASE_SERVICE_ROLE_KEY \
  | grep -E '^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)='
)"
```

If that command prints nothing, run `pnpm exec supabase status` and copy these
values manually:

- `Project URL` into `SUPABASE_URL`
- `Secret` into `SUPABASE_SERVICE_ROLE_KEY`

4. Start the web app:

```bash
DEMO_ACCESS_CODE=anden-demo \
AI_PROVIDER=mock \
MAX_DEMO_AI_COST_USD=5 \
SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
pnpm dev
```

5. Open the demo:

```text
http://127.0.0.1:3000
```

Access code:

```text
anden-demo
```

6. Follow the script:

```text
docs/demo-script.md
```

## Option B: Fast Mock-Only Demo

Use this if Docker/Supabase is not running or you only need to review the UI and
golden paths. Writes are not persisted across server restarts.

```bash
DEMO_ACCESS_CODE=anden-demo \
AI_PROVIDER=mock \
MAX_DEMO_AI_COST_USD=5 \
pnpm dev
```

Open:

```text
http://127.0.0.1:3000
```

Access code:

```text
anden-demo
```

## Verify It Is Running

In another terminal:

```bash
curl -I http://127.0.0.1:3000/login
```

Expected: `HTTP/1.1 200 OK`.

If using Supabase local:

```bash
pnpm validate:db:artifacts
pnpm exec supabase status
```

Supabase Studio:

```text
http://127.0.0.1:55323
```

## Stop Everything

1. Stop the web app with `Ctrl+C` in the terminal running `pnpm dev`.

2. Stop Supabase:

```bash
pnpm db:stop
```

3. Confirm common ports are free:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P || true
lsof -iTCP:55321 -sTCP:LISTEN -n -P || true
```

## Reset Between Manual Demo Runs

Mock-only:

1. Click `Lock demo`.
2. Clear browser site data if you want locale to return to English.
3. Log in again.

Supabase local:

```bash
pnpm db:reset
```

Then refresh the browser and start again from `/dashboard`.

## Troubleshooting

Port `3000` already in use:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P
```

Stop the listed process or run the app on another port:

```bash
DEMO_ACCESS_CODE=anden-demo \
AI_PROVIDER=mock \
pnpm --filter @anden/web exec next dev --hostname 127.0.0.1 --port 3001
```

Supabase is already running:

```bash
pnpm exec supabase status
```

Supabase local state feels stale:

```bash
pnpm db:reset
```
