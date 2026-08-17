ALTER TABLE tokens DROP CONSTRAINT IF EXISTS tokens_source_type_check;

ALTER TABLE tokens ADD CONSTRAINT tokens_source_type_check
  CHECK (source_type IN ('coingecko', 'coinmarketcap', 'dex', 'coinranking', 'user_paid', 'livecoinwatch'));
