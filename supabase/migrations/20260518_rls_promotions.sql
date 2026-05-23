-- ============================================================
-- MIGRATION 024: RLS policies — promotions + banners
-- Public: read active approved banners only
-- Admin: full access
-- ============================================================
 
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
 
-- Public can read active confirmed promotions
-- (needed to show promoted tokens and pinned listings)
CREATE POLICY "public can read active promotions"
ON promotions FOR SELECT
USING (
  is_active = true
  AND payment_status = 'confirmed'
);
 
CREATE POLICY "admins can manage promotions"
ON promotions FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
 
-- banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
 
-- Public can read approved banners (including placeholder)
CREATE POLICY "public can read approved banners"
ON banners FOR SELECT
USING (is_approved = true OR is_placeholder = true);
 
CREATE POLICY "admins can manage banners"
ON banners FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
