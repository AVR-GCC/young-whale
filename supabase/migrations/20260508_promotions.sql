-- ============================================================
-- MIGRATION 008: promotions
-- One record per promotion type per token
-- Depends on: tokens (004), update_updated_at (002)
-- ============================================================

CREATE TABLE promotions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id        UUID REFERENCES tokens(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN (
                    'listing',    -- pinned + highlighted in category feed
                    'banner',     -- bottom banner ad
                    'video',      -- featured YouTube video on homepage
                    'badge',      -- verified badge, forever
                    'page'        -- dedicated token page, forever
                  )),

  -- Pricing snapshot at time of purchase
  amount_paid     NUMERIC(10,2),
  currency        TEXT DEFAULT 'USDC',

  -- Duration: NULL for forever types (badge, page)
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT FALSE,

  -- Payment — invoice_id is the deduplication key
  invoice_id      TEXT UNIQUE,
  payment_status  TEXT DEFAULT 'pending' CHECK (payment_status IN (
                    'pending',
                    'confirmed',
                    'failed'
                  )),

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_promotions_token_id   ON promotions(token_id);
CREATE INDEX idx_promotions_type       ON promotions(type);
CREATE INDEX idx_promotions_expires_at ON promotions(expires_at);
CREATE INDEX idx_promotions_is_active  ON promotions(is_active);

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
