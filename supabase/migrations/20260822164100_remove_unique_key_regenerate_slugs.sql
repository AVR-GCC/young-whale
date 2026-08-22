-- ============================================================  
-- MIGRATION: Remove unique_key, make slug the sole unique identifier
-- and regenerate all slugs as lowercase(symbol) with collision suffixes
-- ============================================================

-- 1. Drop the index on unique_key
DROP INDEX IF EXISTS idx_tokens_unique_key;

-- 2. Remove the unique_key column
ALTER TABLE tokens DROP COLUMN IF EXISTS unique_key;

-- 3. Regenerate all slugs: lowercase(symbol), with -2, -3, ... for collisions
--    Process oldest tokens first so they keep the base slug.
CREATE OR REPLACE FUNCTION __tmp_regenerate_slugs()
RETURNS void AS $$
DECLARE
  rec RECORD;
  base_slug TEXT;
  candidate TEXT;
  suffix INT;
BEGIN
  FOR rec IN
    SELECT id, LOWER(symbol) AS base
    FROM tokens
    ORDER BY created_at ASC
  LOOP
    base_slug := rec.base;
    candidate := base_slug;
    suffix    := 2;

    -- Keep incrementing until the candidate slug is not used by another token
    WHILE EXISTS (
      SELECT 1 FROM tokens
      WHERE slug = candidate AND id <> rec.id
    ) LOOP
      candidate := base_slug || '-' || suffix;
      suffix    := suffix + 1;
    END LOOP;

    UPDATE tokens SET slug = candidate WHERE id = rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT __tmp_regenerate_slugs();

DROP FUNCTION __tmp_regenerate_slugs();
