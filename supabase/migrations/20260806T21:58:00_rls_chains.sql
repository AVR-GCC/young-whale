-- ============================================================
-- MIGRATION: Enable RLS on chains table
-- ============================================================

ALTER TABLE chains ENABLE ROW LEVEL SECURITY;

-- Public can read all chains.
CREATE POLICY "public can read chains"
ON chains FOR SELECT
USING (true);

-- Only admins can manage chains.
CREATE POLICY "admins can manage chains"
ON chains FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
