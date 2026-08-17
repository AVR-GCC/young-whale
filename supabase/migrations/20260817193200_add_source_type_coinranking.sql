ALTER TABLE raw_tokens DROP CONSTRAINT IF EXISTS raw_tokens_source_type_check;

ALTER TABLE raw_tokens ADD CONSTRAINT raw_tokens_source_type_check
  CHECK (source_type IN ('coingecko', 'coinmarketcap', 'dex', 'coinranking', 'user_paid', 'livecoinwatch'));
