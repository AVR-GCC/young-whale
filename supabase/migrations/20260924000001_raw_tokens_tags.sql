-- ============================================================
-- MIGRATION: raw_tokens.tags
-- Source-agnostic hashtag slugs extracted at ingest time
-- (previously read from raw_payload.cmc_details.tags)
-- ============================================================

ALTER TABLE raw_tokens ADD COLUMN tags JSONB NOT NULL DEFAULT '[]';

UPDATE raw_tokens
SET tags = COALESCE(
  (
    SELECT jsonb_agg(lower(trim(tag)))
    FROM jsonb_array_elements_text(raw_payload->'cmc_details'->'tags') AS tag
  ),
  '[]'::jsonb
)
WHERE source_type = 'coinmarketcap'
  AND raw_payload->'cmc_details'->'tags' IS NOT NULL;
