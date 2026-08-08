-- ============================================================
-- MIGRATION: Add explorer column to raw_tokens
-- ============================================================

ALTER TABLE tokens
ADD COLUMN presale_status TEXT;
