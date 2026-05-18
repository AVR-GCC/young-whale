-- ============================================================
-- MIGRATION 009: banners
-- Banner creative assets linked to a promotion record
-- Depends on: promotions (008)
-- ============================================================

CREATE TABLE banners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id    UUID REFERENCES promotions(id) ON DELETE CASCADE,
  desktop_url     TEXT NOT NULL,          -- 728x90
  mobile_url      TEXT NOT NULL,          -- 320x50
  destination_url TEXT NOT NULL,
  is_approved     BOOLEAN DEFAULT FALSE,
  is_placeholder  BOOLEAN DEFAULT FALSE,  -- shown when no active banner exists
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
