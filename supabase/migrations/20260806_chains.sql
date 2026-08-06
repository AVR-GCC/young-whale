-- ============================================================
-- MIGRATION: Create chains table
-- ============================================================

CREATE TABLE chains (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  icon            TEXT,
  explorer_prefix TEXT
);
