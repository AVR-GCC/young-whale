-- ============================================================
-- MIGRATION: Create chains table
-- ============================================================
-- run

CREATE TABLE chains (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  icon            TEXT,
  explorer_prefix TEXT
);
