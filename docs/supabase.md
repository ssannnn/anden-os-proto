# Supabase Persistence

Anden OS can run in two data modes:

- `Mock fallback`: default local/demo mode when Supabase env vars are absent.
- `Supabase live`: server-side PostgREST reads when Supabase env vars are configured.

The app never needs Supabase credentials to run locally. The current demo keeps all writes in migrations/seeds and reads data from Supabase only from server components.

## Environment Variables

Use either a service-role key for server-only deploys or an anon key for read-only seeded demo data.

```bash
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Fallback option:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

For production deploys, prefer `SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` as server-only variables. Do not expose the service-role key to client code.

## Local Reset

With the Supabase CLI installed:

```bash
supabase start
supabase db reset
```

`supabase db reset` applies migrations from `supabase/migrations/` and then runs `supabase/seed.sql`.

## Remote Apply

After linking a hosted project:

```bash
supabase link --project-ref PROJECT_REF
supabase db push
supabase db reset --linked
```

If you do not want to reset remote data, run only `supabase db push` and apply seed data through the SQL editor after reviewing `supabase/seed.sql`.

## Schema Notes

- RLS is enabled on every demo table.
- `anon` and `authenticated` can read seeded demo data; writes are not granted.
- Foreign keys are indexed for joins and cascades.
- Common filters use composite indexes, and JSONB/array search paths use GIN indexes where useful.
- `document_chunks.embedding` uses `extensions.vector(1536)` for the future RAG slice.

## Seeded Tables

- `companies`
- `partners`
- `documents`
- `document_chunks`
- `dashboard_metrics`
- `workflows`
- `workflow_runs`
- `assistant_threads`
- `assistant_messages`
- `reports`
- `ai_usage_events`
- `demo_settings`
