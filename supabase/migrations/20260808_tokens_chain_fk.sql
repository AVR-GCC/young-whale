-- ============================================================
-- MIGRATION: Seed chains and add foreign key to tokens.chain
-- ============================================================

-- Update any tokens with NULL chain to 'original'
UPDATE tokens SET chain = 'original' WHERE chain IS NULL;

-- Add foreign key constraint from tokens.chain to chains.id
ALTER TABLE tokens ADD CONSTRAINT tokens_chain_fk FOREIGN KEY (chain) REFERENCES chains(id);
