-- ============================================================
-- MIGRATION: Remove slug column, enforce symbol uniqueness
-- Tokens are now identified by their unique symbol (case-insensitive)
-- ============================================================

-- 1. Drop the slug index
DROP INDEX IF EXISTS idx_tokens_slug;

-- 2. Remove the slug column from tokens table
ALTER TABLE tokens DROP COLUMN IF EXISTS slug;

-- 3. Add unique constraint on symbol (case-insensitive via collation or we enforce in app)
--    Note: PostgreSQL unique constraints are case-sensitive by default.
--    We add a unique index on UPPER(symbol) for true case-insensitive uniqueness.
CREATE UNIQUE INDEX idx_tokens_symbol_unique ON tokens(UPPER(symbol));

-- 4. Drop the old non-unique index on symbol if it exists (it shouldn't, but be safe)
DROP INDEX IF EXISTS idx_tokens_symbol;
