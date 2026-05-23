-- ============================================================
-- MIGRATION 023: RLS policies — raw_tokens + processing_queue
-- Admin only — never exposed publicly
-- ============================================================
 
ALTER TABLE raw_tokens ENABLE ROW LEVEL SECURITY;
 
CREATE POLICY "admins can manage raw tokens"
ON raw_tokens FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
 
-- processing_queue
ALTER TABLE processing_queue ENABLE ROW LEVEL SECURITY;
 
CREATE POLICY "admins can manage processing queue"
ON processing_queue FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
