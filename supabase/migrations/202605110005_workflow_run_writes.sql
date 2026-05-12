grant select on public.workflows to service_role;
grant select, insert, update on public.workflow_runs to service_role;
grant usage, select on sequence public.workflow_runs_id_seq to service_role;
