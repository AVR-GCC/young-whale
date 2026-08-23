-- Remove duplicate raw_tokens entries based on name and symbol,
-- keeping the earliest created_at record (or lowest id as tie-breaker).
-- Related records in other tables are handled by existing FK constraints:
--   - processing_queue: ON DELETE CASCADE
--   - tokens: ON DELETE SET NULL

WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY name, symbol
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM raw_tokens
  WHERE name IS NOT NULL AND symbol IS NOT NULL
)
DELETE FROM raw_tokens
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Add unique constraint on name and symbol jointly for raw_tokens table
ALTER TABLE raw_tokens
ADD CONSTRAINT unique_raw_tokens_name_symbol UNIQUE (name, symbol);
