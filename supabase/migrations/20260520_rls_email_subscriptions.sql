-- ============================================================
-- MIGRATION 026: RLS policies — email_subscriptions
-- Public: insert only (subscription form)
-- Admin: full access
-- ============================================================
 
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
 
-- Anyone can subscribe (no auth required)
CREATE POLICY "public can insert email subscriptions"
ON email_subscriptions FOR INSERT
WITH CHECK (true);
 
-- Admins can read and manage the list
CREATE POLICY "admins can manage email subscriptions"
ON email_subscriptions FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
