alter table public.ai_usage_events
add column if not exists locale text not null default 'en';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ai_usage_locale_check'
      and conrelid = 'public.ai_usage_events'::regclass
  ) then
    alter table public.ai_usage_events
    add constraint ai_usage_locale_check check (locale in ('en', 'es'));
  end if;
end $$;

create index if not exists ai_usage_locale_created_idx
on public.ai_usage_events (locale, created_at desc);

grant insert on public.ai_usage_events to service_role;
grant usage, select on sequence public.ai_usage_events_id_seq to service_role;
