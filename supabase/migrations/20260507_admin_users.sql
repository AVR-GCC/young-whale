-- ============================================================
-- MIGRATION 007: admin_users
-- Admin panel access, references Supabase Auth
-- Depends on: Supabase auth.users (built-in)
-- ============================================================

CREATE TABLE admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
