-- Add unique constraint on name and symbol jointly for tokens table
ALTER TABLE tokens
ADD CONSTRAINT unique_tokens_name_symbol UNIQUE (name, symbol);
