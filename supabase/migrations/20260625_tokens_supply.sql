-- ============================================================
-- MIGRATION: Add supply column to raw_tokens and tokens
-- Extracted from CMC listing total_supply field
-- ============================================================

ALTER TABLE raw_tokens ADD COLUMN supply NUMERIC;
ALTER TABLE tokens ADD COLUMN supply NUMERIC;
