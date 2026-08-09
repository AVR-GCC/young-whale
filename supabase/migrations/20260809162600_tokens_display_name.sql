
-- ============================================================
-- MIGRATION: Add explorer column to raw_tokens
-- ============================================================

ALTER TABLE tokens
ADD COLUMN display_name TEXT;

UPDATE tokens
SET display_name = name;
