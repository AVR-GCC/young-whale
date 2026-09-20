-- ============================================================
-- MIGRATION: Enable Realtime for tokens
-- Broadcasts changes on tokens to subscribed clients (homepage)
-- ============================================================

alter table tokens replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where publication = 'supabase_realtime' and tablename = 'tokens'
  ) then
    alter publication supabase_realtime add table tokens;
  end if;
end $$;
