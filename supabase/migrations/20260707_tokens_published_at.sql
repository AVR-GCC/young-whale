-- ============================================================
-- MIGRATION: tokens published_at
-- Adds a published_at timestamp to control when approved tokens
-- become visible on the public feed.
-- ============================================================

ALTER TABLE tokens
  ADD COLUMN published_at TIMESTAMPTZ;

CREATE INDEX idx_tokens_published_at ON tokens(published_at DESC);
