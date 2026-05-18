-- ============================================================
-- MIGRATION 001: raw_tokens
-- Staging area for raw data from Coinbase / DEX APIs
-- ============================================================

CREATE TABLE raw_tokens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT,
  symbol            TEXT,
  chain             TEXT,
  contract_address  TEXT,
  website_url       TEXT,
  logo_url          TEXT,
  social_links      JSONB DEFAULT '{}',
  exchange_links    JSONB DEFAULT '[]',
  source_type       TEXT CHECK (source_type IN ('coinbase', 'dex')),
  source_url        TEXT,
  raw_payload       JSONB,              -- full original API response
  status            TEXT DEFAULT 'pending' CHECK (status IN (
                      'pending',        -- waiting to be processed
                      'processing',     -- currently being processed
                      'processed',      -- successfully written to tokens
                      'failed'          -- AI processing failed
                    )),
  retry_count       INT DEFAULT 0,
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
