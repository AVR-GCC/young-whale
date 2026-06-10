-- ============================================================
-- MIGRATION: Add message column to processing_runs
-- Adds a general message/status field for processing runs
-- ============================================================

ALTER TABLE processing_runs
ADD COLUMN message TEXT;
