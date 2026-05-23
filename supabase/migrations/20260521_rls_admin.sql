-- ============================================================
-- MIGRATION 027: RLS policies — admin_users + logs
-- Admin only
-- ============================================================
 
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
 
-- Admins can read the admin users list
CREATE POLICY "admins can read admin users"
ON admin_users FOR SELECT
USING (is_admin());
 
-- Only superadmins can insert or delete admin users
CREATE POLICY "superadmins can manage admin users"
ON admin_users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role = 'superadmin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role = 'superadmin'
  )
);
 
-- logs
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
 
-- Admins can read all logs
CREATE POLICY "admins can read logs"
ON logs FOR SELECT
USING (is_admin());
 
-- Admins can insert logs (manual admin actions)
-- Pipeline inserts via service role so RLS is bypassed there
CREATE POLICY "admins can insert logs"
ON logs FOR INSERT
WITH CHECK (is_admin());
