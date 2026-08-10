import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'
import { requireAdminApi } from '@/lib/admin-auth'
import {
  getLatestListings,
  getTokenDetails,
  getChains,
  mapCmcToRawToken,
  isTokenInRawTokens,
  isRawTokensTableEmpty,
  collectHashtags,
  syncHashtags,
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
    const results = []
    const rawTokenIds: string[] = []
    const hashtagMap = new Map<string, string>()
    const chains = await getChains()

    if (isEmpty) {
      // Table is empty: ingest exactly 20 tokens
      const listings = await getLatestListings(20)

      for (const listing of listings) {
        const details = await getTokenDetails(listing.id)
        collectHashtags(details, hashtagMap)
        const tokenData = mapCmcToRawToken(listing, details, chains)

        const { data, error } = await supabaseService
          .from('raw_tokens')
          .insert(tokenData)
          .select()
          .single()

        if (error) {
          console.error(`Failed to insert ${listing.symbol}:`, error.message)
          results.push({ symbol: listing.symbol, success: false, error: error.message })
        } else {
          results.push({ symbol: listing.symbol, success: true, data })
          rawTokenIds.push(data.id)
        }
      }
    } else {
      // Table is not empty: ingest tokens until we hit one that already exists
      const batchSize = 50
      let start = 1
      let foundExisting = false

      while (!foundExisting) {
        const listings = await getLatestListings(batchSize, start)

        if (listings.length === 0) {
          break
        }

        for (const listing of listings) {
          const exists = await isTokenInRawTokens(listing.symbol, listing.name)

          if (exists) {
            foundExisting = true
            break
          }

          const details = await getTokenDetails(listing.id)
          collectHashtags(details, hashtagMap)
          const tokenData = mapCmcToRawToken(listing, details, chains)

          const { data, error } = await supabaseService
            .from('raw_tokens')
            .insert(tokenData)
            .select()
            .single()

          if (error) {
            console.error(`Failed to insert ${listing.symbol}:`, error.message)
            results.push({ symbol: listing.symbol, success: false, error: error.message })
          } else {
            results.push({ symbol: listing.symbol, success: true, data })
            rawTokenIds.push(data.id)
          }
        }

        start += batchSize
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
