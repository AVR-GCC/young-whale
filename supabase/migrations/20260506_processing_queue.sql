-- ============================================================
-- MIGRATION 006: processing_queue
-- Job queue for AI classification pipeline
-- Depends on: raw_tokens (001), update_updated_at (002)
-- ============================================================

CREATE TABLE processing_queue (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_token_id  UUID REFERENCES raw_tokens(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'queued' CHECK (status IN (
                  'queued',       -- waiting to be picked up
                  'processing',   -- currently being processed
                  'completed',    -- successfully processed
                  'failed'        -- failed after max retries
                )),
  retry_count   INT DEFAULT 0,
  max_retries   INT DEFAULT 3,
  error_message TEXT,
  -- If a job is picked up but not acknowledged within timeout, it returns to queue
  locked_until  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes: worker queries by status and lock expiry
CREATE INDEX idx_queue_status       ON processing_queue(status);
CREATE INDEX idx_queue_locked_until ON processing_queue(locked_until);

CREATE TRIGGER queue_updated_at
  BEFORE UPDATE ON processing_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
