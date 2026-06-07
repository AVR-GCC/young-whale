-- ============================================================
-- MIGRATION: processing_runs
-- Tracks async processing runs for the AI classification pipeline
-- ============================================================

CREATE TABLE processing_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status        TEXT DEFAULT 'running' CHECK (status IN (
                  'running',      -- currently processing
                  'completed',    -- successfully finished
                  'failed'        -- error occurred
                )),
  processed_count INT DEFAULT 0,
  failed_count   INT DEFAULT 0,
  error_message  TEXT,
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);

-- Index: quickly look up latest runs
CREATE INDEX idx_processing_runs_status ON processing_runs(status);
CREATE INDEX idx_processing_runs_started_at ON processing_runs(started_at DESC);
