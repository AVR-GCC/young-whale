-- ============================================================
-- MIGRATION: messages
-- Contact form submissions from the "contact us" page
-- Public: insert only  |  Admin: full access
-- ============================================================

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for the admin inbox view
CREATE INDEX idx_messages_is_read     ON messages(is_read);
CREATE INDEX idx_messages_created_at  ON messages(created_at DESC);

-- Auto-update updated_at on row modification
CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message (no auth required)
CREATE POLICY "public can insert messages"
ON messages FOR INSERT
WITH CHECK (true);

-- Admins can read and manage all messages
CREATE POLICY "admins can manage messages"
ON messages FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
