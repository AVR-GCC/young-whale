-- ============================================================
-- MIGRATION 022: RLS policies — hashtags + token_hashtags
-- Public: read active hashtags
-- Admin: full access
-- ============================================================
 
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
 
CREATE POLICY "public can read active hashtags"
ON hashtags FOR SELECT
USING (is_active = true);
 
CREATE POLICY "admins can manage hashtags"
ON hashtags FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
 
-- token_hashtags
ALTER TABLE token_hashtags ENABLE ROW LEVEL SECURITY;
 
-- Public can read hashtags for approved tokens only
CREATE POLICY "public can read token hashtags for approved tokens"
ON token_hashtags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tokens
    WHERE tokens.id = token_hashtags.token_id
    AND tokens.status = 'approved'
  )
);
 
CREATE POLICY "admins can manage token hashtags"
ON token_hashtags FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
