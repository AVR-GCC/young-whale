CREATE INDEX idx_tokens_category_published_at_id
  ON tokens(category, published_at DESC, id DESC)
  WHERE published_at IS NOT NULL;
