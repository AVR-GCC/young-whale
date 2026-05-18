-- ============================================================
-- MIGRATION 005: token_hashtags
-- Many-to-many join between tokens and hashtags
-- Depends on: tokens (004), hashtags (003)
-- ============================================================

CREATE TABLE token_hashtags (
  token_id    UUID REFERENCES tokens(id) ON DELETE CASCADE,
  hashtag_id  UUID REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (token_id, hashtag_id)
);
