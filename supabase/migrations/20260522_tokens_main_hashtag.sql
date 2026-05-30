-- Add main_hashtag column to tokens table
-- This stores the AI-selected primary hashtag from CMC tags

ALTER TABLE tokens
ADD COLUMN main_hashtag TEXT;

-- Index for quick lookups by main hashtag
CREATE INDEX idx_tokens_main_hashtag ON tokens(main_hashtag);
