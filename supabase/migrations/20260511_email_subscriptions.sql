-- ============================================================
-- MIGRATION 011: email_subscriptions
-- Crypto Investors Club email capture
-- No dependencies
-- ============================================================

CREATE TABLE email_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
