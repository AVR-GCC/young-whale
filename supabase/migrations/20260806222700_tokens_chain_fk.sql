-- ============================================================
-- MIGRATION: Seed chains and add foreign key to tokens.chain
-- ============================================================

-- Seed chains table with all existing chain values from tokens
INSERT INTO chains (id, name)
SELECT DISTINCT chain, chain FROM tokens
WHERE chain IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Ensure the 'original' chain exists for NULL values
INSERT INTO chains (id, name) VALUES ('original', 'Original') ON CONFLICT (id) DO NOTHING;

-- Update any tokens with NULL chain to 'original'
UPDATE tokens SET chain = 'original' WHERE chain IS NULL;

-- Add foreign key constraint from tokens.chain to chains.id
ALTER TABLE tokens ADD CONSTRAINT tokens_chain_fk FOREIGN KEY (chain) REFERENCES chains(id);
