-- Add rating column to tokens table
-- Numeric rating score for tokens

ALTER TABLE tokens
ADD COLUMN rating NUMERIC;
