-- ============================================================
-- MIGRATION 020: RLS helper function
-- is_admin() checks if the current authenticated user
-- has a row in admin_users. Used by all admin policies.
-- Run this before any RLS policy migrations.
-- ============================================================
 
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
