-- Anden OS AI Backoffice Demo schema.
-- Designed for Supabase/Postgres with read-only anon/authenticated access and
-- server-side service-role writes through migrations or seed scripts.

create schema if not exists extensions;
create extension if not exists vector with schema extensions;

create table public.demo_settings (
  setting_key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dashboard_metrics (
  id bigint generated always as identity primary key,
  metric_key text not null unique,
  value text not null,
  label_en text not null,
  label_es text not null,
  tone text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint dashboard_metrics_tone_check check (
    tone in ('blue', 'lime', 'orange', 'sky', 'periwinkle', 'brown')
  )
);

create table public.companies (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  sector text not null,
  country text not null,
  status text not null,
  priority text not null,
  last_interaction date not null,
  next_step text not null,
  documents text[] not null default '{}'::text[],
  ai_summary text not null,
  ai_recommended_action text not null,
  readiness integer not null,
  partner_relevance text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_slug_lowercase_check check (slug = lower(slug)),
  constraint companies_status_check check (
    status in ('Interested', 'Briefing', 'Qualification', 'Onboarding')
  ),
  constraint companies_priority_check check (priority in ('High', 'Medium', 'Low')),
  constraint companies_readiness_check check (readiness between 0 and 100)
);

create table public.partners (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  partner_type text not null,
  country text not null,
  relevance text not null,
  fintech_relevance integer not null,
  linked_sectors text[] not null default '{}'::text[],
  last_interaction date not null,
  next_step text not null,
  documents text[] not null default '{}'::text[],
  ai_summary text not null,
  recommended_use_cases text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partners_slug_lowercase_check check (slug = lower(slug)),
  constraint partners_relevance_check check (
    relevance in ('Strategic', 'High', 'Medium')
  ),
  constraint partners_fintech_relevance_check check (
    fintech_relevance between 0 and 100
  )
);

create table public.documents (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  document_type text not null,
  source_label text not null,
  source_url text,
  source_pack_path text not null,
  jurisdiction text not null,
  language text not null,
  index_status text not null,
  retrieved_at date,
  updated_at date not null,
  legal_review_required boolean not null default false,
  summary text not null,
  entities text[] not null default '{}'::text[],
  risks text[] not null default '{}'::text[],
  checklist text[] not null default '{}'::text[],
  linked_companies text[] not null default '{}'::text[],
  linked_partners text[] not null default '{}'::text[],
  ai_use_cases text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  record_updated_at timestamptz not null default now(),
  constraint documents_slug_lowercase_check check (slug = lower(slug)),
  constraint documents_type_check check (
    document_type in (
      'Regulation',
      'Official guidance',
      'Internal memo',
      'Partner profile',
      'Playbook',
      'Template'
    )
  ),
  constraint documents_jurisdiction_check check (
    jurisdiction in ('Argentina', 'Internal', 'Global')
  ),
  constraint documents_language_check check (language in ('Spanish', 'English')),
  constraint documents_index_status_check check (
    index_status in ('Indexed', 'Review queued', 'Draft')
  )
);

create table public.document_chunks (
  id bigint generated always as identity primary key,
  document_id bigint not null references public.documents (id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer not null default 0,
  embedding extensions.vector(1536),
  content_tsv tsvector generated always as (to_tsvector('simple', content)) stored,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint document_chunks_chunk_index_check check (chunk_index >= 0),
  constraint document_chunks_token_count_check check (token_count >= 0),
  constraint document_chunks_document_chunk_unique unique (document_id, chunk_index)
);

create table public.workflows (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  status text not null,
  description text not null,
  sort_order integer not null default 0,
  steps jsonb not null default '[]'::jsonb,
  trigger_schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workflows_slug_lowercase_check check (slug = lower(slug)),
  constraint workflows_status_check check (
    status in ('Active', 'Draft', 'Paused')
  ),
  constraint workflows_steps_array_check check (jsonb_typeof(steps) = 'array')
);

create table public.workflow_runs (
  id bigint generated always as identity primary key,
  workflow_id bigint not null references public.workflows (id) on delete cascade,
  target_company_id bigint references public.companies (id) on delete set null,
  target_partner_id bigint references public.partners (id) on delete set null,
  state text not null,
  progress integer not null default 0,
  inputs jsonb not null default '{}'::jsonb,
  outputs jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint workflow_runs_state_check check (
    state in ('Waiting documents', 'Brief draft ready', 'Outline generated', 'Completed')
  ),
  constraint workflow_runs_progress_check check (progress between 0 and 100)
);

create table public.assistant_threads (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  locale text not null default 'en',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assistant_threads_slug_lowercase_check check (slug = lower(slug)),
  constraint assistant_threads_locale_check check (locale in ('en', 'es'))
);

create table public.assistant_messages (
  id bigint generated always as identity primary key,
  thread_id bigint not null references public.assistant_threads (id) on delete cascade,
  role text not null,
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  confidence numeric(5, 2),
  created_at timestamptz not null default now(),
  constraint assistant_messages_role_check check (
    role in ('user', 'assistant', 'system')
  ),
  constraint assistant_messages_citations_array_check check (
    jsonb_typeof(citations) = 'array'
  ),
  constraint assistant_messages_confidence_check check (
    confidence is null or confidence between 0 and 100
  )
);

create table public.reports (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  report_type text not null,
  status text not null,
  period_start date,
  period_end date,
  content jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint reports_slug_lowercase_check check (slug = lower(slug)),
  constraint reports_type_check check (
    report_type in ('weekly_operating_brief', 'meeting_brief', 'content_pack')
  ),
  constraint reports_status_check check (status in ('Draft', 'Generated', 'Archived'))
);

create table public.ai_usage_events (
  id bigint generated always as identity primary key,
  provider text not null,
  model text not null,
  feature text not null,
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  cost_usd numeric(10, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_usage_tokens_check check (
    prompt_tokens >= 0 and completion_tokens >= 0
  ),
  constraint ai_usage_cost_check check (cost_usd >= 0)
);

create or replace function public.set_current_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger demo_settings_set_updated_at
before update on public.demo_settings
for each row execute function public.set_current_updated_at();

create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_current_updated_at();

create trigger partners_set_updated_at
before update on public.partners
for each row execute function public.set_current_updated_at();

create trigger workflows_set_updated_at
before update on public.workflows
for each row execute function public.set_current_updated_at();

create trigger assistant_threads_set_updated_at
before update on public.assistant_threads
for each row execute function public.set_current_updated_at();

create index companies_filters_idx
on public.companies (sector, status, country, priority);

create index companies_partner_relevance_gin_idx
on public.companies using gin (partner_relevance);

create index partners_type_country_idx
on public.partners (partner_type, country);

create index partners_linked_sectors_gin_idx
on public.partners using gin (linked_sectors);

create index documents_filters_idx
on public.documents (document_type, jurisdiction, index_status);

create index documents_legal_review_idx
on public.documents (updated_at desc)
where legal_review_required is true;

create index documents_entities_gin_idx
on public.documents using gin (entities);

create index documents_metadata_gin_idx
on public.documents using gin (metadata jsonb_path_ops);

create index document_chunks_document_id_idx
on public.document_chunks (document_id);

create index document_chunks_content_tsv_idx
on public.document_chunks using gin (content_tsv);

create index workflows_status_sort_idx
on public.workflows (status, sort_order);

create index workflow_runs_workflow_id_idx
on public.workflow_runs (workflow_id);

create index workflow_runs_target_company_id_idx
on public.workflow_runs (target_company_id);

create index workflow_runs_target_partner_id_idx
on public.workflow_runs (target_partner_id);

create index workflow_runs_state_created_idx
on public.workflow_runs (state, created_at desc);

create index assistant_messages_thread_created_idx
on public.assistant_messages (thread_id, created_at);

create index reports_type_generated_idx
on public.reports (report_type, generated_at desc);

create index ai_usage_feature_created_idx
on public.ai_usage_events (feature, created_at desc);

alter table public.demo_settings enable row level security;
alter table public.dashboard_metrics enable row level security;
alter table public.companies enable row level security;
alter table public.partners enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.assistant_threads enable row level security;
alter table public.assistant_messages enable row level security;
alter table public.reports enable row level security;
alter table public.ai_usage_events enable row level security;

create policy read_demo_settings on public.demo_settings
for select to anon, authenticated using (true);

create policy read_dashboard_metrics on public.dashboard_metrics
for select to anon, authenticated using (true);

create policy read_companies on public.companies
for select to anon, authenticated using (true);

create policy read_partners on public.partners
for select to anon, authenticated using (true);

create policy read_documents on public.documents
for select to anon, authenticated using (true);

create policy read_document_chunks on public.document_chunks
for select to anon, authenticated using (true);

create policy read_workflows on public.workflows
for select to anon, authenticated using (true);

create policy read_workflow_runs on public.workflow_runs
for select to anon, authenticated using (true);

create policy read_assistant_threads on public.assistant_threads
for select to anon, authenticated using (true);

create policy read_assistant_messages on public.assistant_messages
for select to anon, authenticated using (true);

create policy read_reports on public.reports
for select to anon, authenticated using (true);

create policy read_ai_usage_events on public.ai_usage_events
for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
