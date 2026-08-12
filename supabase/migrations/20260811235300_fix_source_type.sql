-- ============================================================-- MIGRATION: Fix source_type — rename coinbase → coinmarketcap, add coingecko-- ============================================================

-- 1. raw_tokens: drop constraint, migrate data, then add new constraint
ALTER TABLE raw_tokens DROP CONSTRAINT IF EXISTS raw_tokens_source_type_check;

UPDATE raw_tokens SET source_type = 'coinmarketcap' WHERE source_type = 'coinbase';

ALTER TABLE raw_tokens ADD CONSTRAINT raw_tokens_source_type_check
  CHECK (source_type IN ('coingecko', 'coinmarketcap', 'dex'));

-- 2. tokens: drop constraint, migrate data, then add new constraint
ALTER TABLE tokens DROP CONSTRAINT IF EXISTS tokens_source_type_check;

UPDATE tokens SET source_type = 'coinmarketcap' WHERE source_type = 'coinbase';

ALTER TABLE tokens ADD CONSTRAINT tokens_source_type_check
  CHECK (source_type IN ('coingecko', 'coinmarketcap', 'dex', 'user_paid'));
