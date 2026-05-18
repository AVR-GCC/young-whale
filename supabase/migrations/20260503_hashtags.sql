-- ============================================================
-- MIGRATION 003: hashtags
-- Admin-managed discovery tags
-- ============================================================

CREATE TABLE hashtags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,     -- display name: 'AI', 'DeFi', 'GameFi'
  slug        TEXT UNIQUE NOT NULL,     -- url-safe: 'ai', 'defi', 'gamefi'
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default hashtags from spec
INSERT INTO hashtags (name, slug) VALUES
  ('DeFi', 'defi'),
  ('GameFi', 'gamefi'),
  ('AI', 'ai'),
  ('NFT', 'nft'),
  ('Meme', 'meme'),
  ('RWA', 'rwa'),
  ('Infrastructure', 'infrastructure'),
  ('Platform', 'platform'),
  ('Exchange', 'exchange'),
  ('Utility', 'utility'),
  ('Stablecoin', 'stablecoin');
