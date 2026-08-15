import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'
import { requireAdminApi } from '@/lib/admin-auth'
import { SourceType } from '@/shared/types'
import {
  getChains,
  isTokenInRawTokens,
  isRawTokensTableEmpty,
  syncHashtags,
  ListingEntry,
  sources,
  Listing,
  processToken
} from './helpers'

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    if (!verifyCronRequest(request)) {
      const authResult = await requireAdminApi()
      if (authResult instanceof NextResponse) return authResult
    }
  }

  if (!process.env.COINMARKETCAP_API_KEY) {
    return NextResponse.json(
      { error: 'COINMARKETCAP_API_KEY is not set' },
      { status: 500 }
    )
  }

  try {
    const isEmpty = await isRawTokensTableEmpty()
    const srcListings: Partial<Record<SourceType, Array<Listing>>> = {}

    if (isEmpty) {
      // Table is empty: ingest exactly 20 tokens
      sources.forEach(async src => {
        const lst = await src.getListings(20)
        srcListings[src.name] = lst
      })
    } else {
      // Table is not empty: ingest tokens until we hit one that already exists
      const batchSize = 50
      let start = 1
      const foundSet: Partial<Record<SourceType, boolean>> = {}
      const newListings: Partial<Record<SourceType, Array<Listing>>> = {}

      while (Object.keys(foundSet).length < sources.length) {
        // get batches
        await Promise.all(sources.map(async src => {
          if (foundSet[src.name]) return true
          const lst = await src.getListings(batchSize, start)
          if (lst.length === 0) {
            foundSet[src.name] = true
            return true
          }
          newListings[src.name] = lst
        }))

        // filter existing tokens
        await Promise.all(sources.map(async src => {
          const srcListings = newListings[src.name]
          if (!srcListings) return true
          const sorted = srcListings.sort((a, b) => b.date_added > a.date_added ? -1 : 1)
          const newTokens = await Promise.all(sorted.map(async listing => {
            const exists = await isTokenInRawTokens(listing.symbol, listing.name)
            if (exists) {
              foundSet[src.name] = true
              return null
            }
            return listing
          }))
          const filtered = newTokens.filter(nt => !!nt)
          newListings[src.name] = filtered
        }))

        // attach tokens to final lists
        sources.forEach(source => {
          const nl = newListings[source.name]
          const sl = srcListings[source.name]
          if (!nl) return true
          srcListings[source.name] = sl ? sl.concat(nl) : nl
        })

        if (Object.keys(foundSet).length === sources.length) {
          break
        }
        start += batchSize
      }
    }

    const listingLookup: Record<string, ListingEntry> = {}

    sources.forEach(async source => {
      const srcListing = srcListings[source.name]
      if (!srcListing) return true
      srcListing.forEach(async listing => {
        listingLookup[listing.symbol] = { source: source.name, listing } as ListingEntry
      })
    })

    const listings = Object.keys(listingLookup).map(key => listingLookup[key])

    const results = []
    const rawTokenIds: string[] = []
    const hashtagMap = new Map<string, string>()
    const chains = await getChains()

    for (const entry of listings) {
      const tokenData = await processToken(entry, chains, hashtagMap)

      const { data, error } = await supabaseService
        .from('raw_tokens')
        .insert(tokenData)
        .select()
        .single()

      if (error) {
        console.error(`Failed to insert ${entry.listing.symbol}:`, error.message)
        results.push({ symbol: entry.listing.symbol, success: false, error: error.message })
      } else {
        results.push({ symbol: entry.listing.symbol, success: true, data })
        rawTokenIds.push(data.id)
      }
    }

    await syncHashtags(hashtagMap)

    if (rawTokenIds.length > 0) {
      const queueJobs = rawTokenIds.map((id) => ({ raw_token_id: id }))
      const { error: queueError } = await supabaseService
        .from('processing_queue')
        .insert(queueJobs)

      if (queueError) {
        console.error('Failed to insert processing_queue jobs:', queueError.message)
      }
    }
    return NextResponse.json({ imported: results.length, results })

    // const listingsCG: Array<CGListing> = await getLatestListingsCG(30)
    // console.log('listingsCG', listingsCG.length, listingsCG.map(lcg => lcg.name));
    // return NextResponse.json({ imported: listingsCG.length, listingsCG })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
