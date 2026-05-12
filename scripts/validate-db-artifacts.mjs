import { readFileSync } from "node:fs";

const migration = readFileSync(
  "supabase/migrations/202605110001_initial_demo_schema.sql",
  "utf8"
);
const seed = readFileSync("supabase/seed.sql", "utf8");
const docs = readFileSync("docs/supabase.md", "utf8");

const requiredTables = [
  "companies",
  "partners",
  "documents",
  "document_chunks",
  "workflows",
  "workflow_runs",
  "assistant_threads",
  "assistant_messages",
  "reports",
  "ai_usage_events",
  "demo_settings",
  "dashboard_metrics"
];

const requiredIndexes = [
  "document_chunks_document_id_idx",
  "workflow_runs_workflow_id_idx",
  "workflow_runs_target_company_id_idx",
  "workflow_runs_target_partner_id_idx",
  "assistant_messages_thread_created_idx",
  "documents_filters_idx"
];

const requiredSeedSlugs = [
  "atlaspay",
  "crecimiento",
  "argentina-knowledge-economy-law",
  "anden-value-proposition",
  "company-onboarding",
  "weekly-operating-brief-2026-05-11"
];

const failures = [];

for (const table of requiredTables) {
  assertIncludes(migration, `create table public.${table}`, `table ${table}`);
  assertIncludes(
    migration,
    `alter table public.${table} enable row level security`,
    `RLS for ${table}`
  );
  assertIncludes(seed, `public.${table}`, `seed reference for ${table}`);
}

for (const index of requiredIndexes) {
  assertIncludes(migration, `create index ${index}`, `index ${index}`);
}

for (const slug of requiredSeedSlugs) {
  assertIncludes(seed, slug, `seed slug ${slug}`);
}

assertIncludes(migration, "extensions.vector(1536)", "pgvector embedding column");
assertIncludes(
  readFileSync("supabase/migrations/202605110002_ai_usage_locale.sql", "utf8"),
  "ai_usage_locale_check",
  "AI usage locale migration"
);
assertIncludes(
  readFileSync("supabase/migrations/202605110002_ai_usage_locale.sql", "utf8"),
  "grant insert on public.ai_usage_events to service_role",
  "AI usage service role insert grant"
);
assertIncludes(
  readFileSync(
    "supabase/migrations/202605110003_rag_document_chunk_writes.sql",
    "utf8"
  ),
  "grant select, insert, update, delete on public.document_chunks to service_role",
  "RAG document chunk service role write grant"
);
assertIncludes(
  readFileSync(
    "supabase/migrations/202605110004_assistant_message_writes.sql",
    "utf8"
  ),
  "grant select, insert on public.assistant_messages to service_role",
  "assistant message service role write grant"
);
assertIncludes(
  readFileSync(
    "supabase/migrations/202605110005_workflow_run_writes.sql",
    "utf8"
  ),
  "grant select, insert, update on public.workflow_runs to service_role",
  "workflow run service role write grant"
);
assertIncludes(seed, "locale", "AI usage locale seed column");
assertIncludes(seed, "source_pack_version", "document chunk source metadata");
assertIncludes(seed, "original_language", "document chunk language metadata");
assertIncludes(docs, "supabase db reset", "reset instructions");
assertIncludes(docs, "SUPABASE_SERVICE_ROLE_KEY", "server env instructions");
assertIncludes(docs, "Mock fallback", "fallback mode docs");

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Supabase schema, seed, and docs artifacts look complete.");

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    failures.push(`Missing ${label}: ${needle}`);
  }
}
