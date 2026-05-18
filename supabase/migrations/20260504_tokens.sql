-- ============================================================
-- MIGRATION 004: tokens
-- Finalized token records — the main app table
-- Depends on: raw_tokens (001), update_updated_at (002)
-- ============================================================

CREATE TABLE tokens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name              TEXT NOT NULL,
  symbol            TEXT NOT NULL,
  chain             TEXT NOT NULL,
  contract_address  TEXT,
  unique_key        TEXT UNIQUE NOT NULL,   -- chain + contract_address (normalized lowercase)
  slug              TEXT UNIQUE NOT NULL,   -- e.g. 'pepe-ai-coin'

  -- Classification
  category          TEXT NOT NULL CHECK (category IN (
                      'Presale', 'Tech', 'Meme', 'RWA'
                    )),

  -- Descriptions
  short_description TEXT,                   -- max 6 words, beginner-friendly
  full_description  TEXT,

  -- Media
  logo_url          TEXT,                   -- original source URL
  logo_storage_path TEXT,                   -- Supabase Storage path after processing

  -- Links
  website_url       TEXT,
  social_links      JSONB DEFAULT '{}',     -- { twitter, telegram, discord }
  exchange_links    JSONB DEFAULT '[]',

  -- Dates
  start_date        TIMESTAMPTZ,
  end_date          TIMESTAMPTZ,

  -- Pipeline metadata
  source_type       TEXT CHECK (source_type IN ('coinbase', 'dex', 'user_paid')),
  source_url        TEXT,
  confidence        TEXT CHECK (confidence IN ('low', 'medium', 'high')),
  raw_token_id      UUID REFERENCES raw_tokens(id) ON DELETE SET NULL,

  -- Status
  status            TEXT DEFAULT 'pending_review' CHECK (status IN (
                      'approved',
                      'pending_review',
                      'rejected'
                    )),

  -- Promotion flags — quick reads, full detail lives in promotions table
  is_promoted       BOOLEAN DEFAULT FALSE,
  is_verified       BOOLEAN DEFAULT FALSE,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tokens_status      ON tokens(status);
CREATE INDEX idx_tokens_category    ON tokens(category);
CREATE INDEX idx_tokens_created_at  ON tokens(created_at DESC);
CREATE INDEX idx_tokens_is_promoted ON tokens(is_promoted);
CREATE INDEX idx_tokens_slug        ON tokens(slug);
CREATE INDEX idx_tokens_unique_key  ON tokens(unique_key);

CREATE TRIGGER tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
