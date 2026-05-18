-- ============================================================
-- MIGRATION 002: update_updated_at trigger function
-- Defined once here, reused by all tables that have updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
