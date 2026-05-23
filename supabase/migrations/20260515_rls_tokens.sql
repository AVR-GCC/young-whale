-- ============================================================
-- MIGRATION 021: RLS policies — tokens
-- Public: read approved tokens only
-- Admin: full access
-- ============================================================
 
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
 
-- Anyone can read approved tokens (public website)
CREATE POLICY "public can read approved tokens"
ON tokens FOR SELECT
USING (status = 'approved');
 
-- Admins can read all tokens regardless of status
CREATE POLICY "admins can read all tokens"
ON tokens FOR SELECT
USING (is_admin());
 
-- Admins can insert new tokens
CREATE POLICY "admins can insert tokens"
ON tokens FOR INSERT
WITH CHECK (is_admin());
 
-- Admins can update tokens (approve, reject, edit)
CREATE POLICY "admins can update tokens"
ON tokens FOR UPDATE
USING (is_admin());
 
-- Admins can delete tokens
CREATE POLICY "admins can delete tokens"
ON tokens FOR DELETE
USING (is_admin());
 
