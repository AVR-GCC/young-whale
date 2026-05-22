-- ============================================================
-- MIGRATION 012: logs
-- Full system activity log for admin panel
-- Depends on: tokens (004), admin_users (007)
-- ============================================================

CREATE TABLE logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL CHECK (type IN (
                'ingestion',    -- API fetch events (Coinbase / DEX)
                'processing',   -- AI classification events
                'promotion',    -- promotion activation / expiry
                'webhook',      -- payment webhook events
                'admin',        -- admin panel actions
                'error',        -- system errors
                'system'        -- general system events
              )),
  severity    TEXT DEFAULT 'info' CHECK (severity IN (
                'info', 'warning', 'error'
              )),
  message     TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',         -- any extra context (token name, job id, etc.)
  token_id    UUID REFERENCES tokens(id) ON DELETE SET NULL,
  admin_id    UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes: admin reads recent logs filtered by type or severity
CREATE INDEX idx_logs_type       ON logs(type);
CREATE INDEX idx_logs_severity   ON logs(severity);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
