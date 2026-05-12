alter table public.reports
add column locale text not null default 'en',
add column citations jsonb not null default '[]'::jsonb,
add column provider text,
add column requested_provider text,
add column model text,
add column estimated_cost_usd numeric(10, 6) not null default 0,
add column legal_review_required boolean not null default false;

alter table public.reports
add constraint reports_locale_check check (locale in ('en', 'es')),
add constraint reports_citations_array_check check (
  jsonb_typeof(citations) = 'array'
),
add constraint reports_estimated_cost_check check (estimated_cost_usd >= 0);

grant select, insert, update on public.reports to service_role;
grant usage, select on sequence public.reports_id_seq to service_role;
