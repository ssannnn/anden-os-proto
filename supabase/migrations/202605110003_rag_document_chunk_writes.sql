grant select on public.documents to service_role;
grant select, insert, update, delete on public.document_chunks to service_role;
grant usage, select on sequence public.document_chunks_id_seq to service_role;
