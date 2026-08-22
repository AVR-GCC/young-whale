import { supabaseService } from '@/lib/supabase/service'
import { CMCListing, CMCListingEntry, CMCSource, CMCSourceType } from './coinmarketcap'
import { CRListing, CRListingEntry, CRSource, CRSourceType } from './coinranking'

export type { CMCListing, CMCDetails } from './coinmarketcap'
export type { CGListing, CGDetails } from './coingecko'
export type { CRListing, CRDetails } from './coinranking'

export type Listing =
| CMCListing
| CRListing

export type SourceObject =
| CMCSourceType
| CRSourceType

export type ListingEntry =
| CMCListingEntry
| CRListingEntry

export const sources: SourceObject[] = [
  CMCSource,
  CRSource
]

export const sourceLookup = {
  coinmarketcap: CMCSource,
  coinranking: CRSource,
  // coingecko: CGSource,
}

export function processToken(
  listingEntry: ListingEntry,
  chains: Array<{ id: string; explorer_prefix: string }>,
  hashtagMap: Map<string, string>
) {
  switch (listingEntry.source) {
    case 'coinmarketcap': {
      return sourceLookup[listingEntry.source].processToken(listingEntry.listing, chains, hashtagMap)
    }
    case 'coinranking': {
      return sourceLookup[listingEntry.source].processToken(listingEntry.listing, chains, hashtagMap)
    }
    // case 'coingecko': {
    //   return sourceLookup[listingEntry.source].processToken(listingEntry.listing, chains, hashtagMap)
    // }
  } 
}

export async function syncHashtags(hashtagMap: Map<string, string>) {
  if (hashtagMap.size === 0) return

  const slugs = Array.from(hashtagMap.keys())

  const { data: existingRows } = await supabaseService
    .from('hashtags')
    .select('slug')
    .in('slug', slugs)

  const existingSlugs = new Set(
    (existingRows ?? []).map((r: { slug: string }) => r.slug)
  )

  const newHashtags = slugs
    .filter((slug) => !existingSlugs.has(slug))
    .map((slug) => ({ slug, name: hashtagMap.get(slug)! }))

  if (newHashtags.length > 0) {
    const { error } = await supabaseService.from('hashtags').insert(newHashtags)
    if (error) {
      console.error('Failed to bulk insert hashtags:', error.message)
    }
  }
}

export async function getChains() {
  const { data, error } = await supabaseService
    .from('chains')
    .select('id, explorer_prefix')

  if (error) {
    console.error('Error fetching chains:', error.message)
    return []
  }

  return data ?? []
}

export async function isTokenInRawTokens(symbol: string, name: string): Promise<boolean> {
  const { data, error } = await supabaseService
    .from('raw_tokens')
    .select('id')
    .eq('symbol', symbol)
    .eq('name', name)
    .maybeSingle()

  if (error) {
    console.error('Error checking existing token:', error.message)
    return false
  }

  return !!data
}

export async function isRawTokensTableEmpty(): Promise<boolean> {
  const { data, error } = await supabaseService
    .from('raw_tokens')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error checking raw_tokens table:', error.message)
    return true
  }

  return !data
}
