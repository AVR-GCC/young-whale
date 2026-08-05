-- ============================================================
-- MIGRATION: Add explorer column to raw_tokens
-- ============================================================

ALTER TABLE raw_tokens
ADD COLUMN explorer TEXT;
