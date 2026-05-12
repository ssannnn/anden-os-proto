grant select, insert, update on public.assistant_threads to service_role;
grant select, insert on public.assistant_messages to service_role;
grant usage, select on sequence public.assistant_threads_id_seq to service_role;
grant usage, select on sequence public.assistant_messages_id_seq to service_role;
