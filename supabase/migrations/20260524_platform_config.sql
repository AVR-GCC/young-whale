-- ============================================================
-- MIGRATION 028: platform_config
-- Generic platform configuration key-value store
-- ============================================================

CREATE TABLE platform_config (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  UUID REFERENCES admin_users(id)
);

-- Index for quick lookups
CREATE INDEX idx_platform_config_key ON platform_config(key);

-- Trigger to auto-update updated_at
CREATE TRIGGER platform_config_updated_at
  BEFORE UPDATE ON platform_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS policies
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;

-- Public: no access (default deny)
-- Admin: full read/write
CREATE POLICY "admins can manage config"
ON platform_config FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
