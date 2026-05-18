-- ============================================================
-- MIGRATION 010: submissions
-- User-paid token submissions awaiting admin approval
-- No dependencies
-- ============================================================

CREATE TABLE submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Token data provided by submitting user
  token_name        TEXT,
  symbol            TEXT,
  chain             TEXT,
  contract_address  TEXT,
  full_description  TEXT,
  logo_url          TEXT,
  website_url       TEXT,
  social_links      JSONB DEFAULT '{}',

  -- Selected promotion package
  promotion_type    TEXT CHECK (promotion_type IN (
                      'listing', 'banner', 'video', 'badge', 'page'
                    )),
  duration_days     INT CHECK (duration_days IN (30, 60, 90)),

  -- Banner or video asset if applicable
  asset_url         TEXT,
  destination_url   TEXT,

  -- Payment — invoice_id is the deduplication key
  invoice_id        TEXT UNIQUE,
  payment_status    TEXT DEFAULT 'pending' CHECK (payment_status IN (
                      'pending', 'confirmed', 'failed'
                    )),
  amount_paid       NUMERIC(10,2),

  -- Admin review
  status            TEXT DEFAULT 'pending' CHECK (status IN (
                      'pending',    -- awaiting admin review
                      'approved',   -- published
                      'rejected'    -- rejected by admin
                    )),
  admin_notes       TEXT,
  reviewed_at       TIMESTAMPTZ,

  created_at        TIMESTAMPTZ DEFAULT NOW()
);
