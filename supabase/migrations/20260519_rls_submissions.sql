-- ============================================================
-- MIGRATION 025: RLS policies — submissions
-- Public: insert only (checkout form submission)
-- Admin: full access
-- ============================================================
 
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
 
-- Anyone can submit (checkout form — no auth required)
CREATE POLICY "public can insert submissions"
ON submissions FOR INSERT
WITH CHECK (true);
 
-- Admins can read and manage all submissions
CREATE POLICY "admins can manage submissions"
ON submissions FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
