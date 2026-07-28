-- ============================================================
-- MIGRATION: RLS policies — processing_runs
-- Admin only — internal pipeline tracking
-- ============================================================

ALTER TABLE processing_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins can manage processing runs"
ON processing_runs FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
