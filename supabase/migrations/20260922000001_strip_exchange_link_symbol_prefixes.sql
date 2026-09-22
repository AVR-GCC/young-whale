-- ============================================================
-- MIGRATION: Strip "BASE_QUOTE_" symbol prefixes from exchange links
-- DexScreener fallback links were stored as SYMBOL_SYMBOL_url;
-- keep only the URL in exchange_links and preferred_exchange.
-- ============================================================

-- 1. exchange_links array elements (preserve original order)
UPDATE tokens t
SET exchange_links = (
  SELECT array_agg(
           regexp_replace(link, '^[^_]+_[^_]+_(https?://.*)$', '\1')
           ORDER BY ord
         )
  FROM unnest(t.exchange_links) WITH ORDINALITY AS u(link, ord)
)
WHERE EXISTS (
  SELECT 1
  FROM unnest(t.exchange_links) AS l(link)
  WHERE l.link ~ '^[^_]+_[^_]+_https?://'
);

-- 2. preferred_exchange single value
UPDATE tokens
SET preferred_exchange = regexp_replace(preferred_exchange, '^[^_]+_[^_]+_(https?://.*)$', '\1')
WHERE preferred_exchange ~ '^[^_]+_[^_]+_https?://';
