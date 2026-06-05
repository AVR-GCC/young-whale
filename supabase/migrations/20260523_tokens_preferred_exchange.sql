-- Add preferred_exchange column to tokens table
-- Stores the pair address of the chosen exchange link from exchange_links

ALTER TABLE tokens
ADD COLUMN preferred_exchange TEXT;
