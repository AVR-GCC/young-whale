import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'

const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com'

async function getLatestListings(limit = 10, start = 1) {
  const url = new URL(`${CMC_BASE_URL}/v1/cryptocurrency/listings/latest`)
  url.searchParams.set('limit', limit.toString())
  url.searchParams.set('start', start.toString())
  url.searchParams.set('sort', 'date_added')
  url.searchParams.set('sort_dir', 'desc')
  url.searchParams.set('convert', 'USD')

  const response = await fetch(url.toString(), {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CMC listings error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return json.data as Array<{
    id: number
    name: string
    symbol: string
    date_added: string
    quote?: { USD?: { price?: number } }
  }>
}

async function getTokenDetails(cmcId: number) {
  const url = new URL(`${CMC_BASE_URL}/v2/cryptocurrency/info`)
  url.searchParams.set('id', cmcId.toString())

  const response = await fetch(url.toString(), {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CMC info error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return json.data[cmcId.toString()] as {
    name: string
    symbol: string
    logo: string
    description: string
    urls: {
      website?: string[]
      twitter?: string[]
      telegram?: string[]
      [key: string]: string[] | undefined
    }
    contract_address?: Array<{
      contract_address: string
      platform: {
        name: string
        coin: { id: string; name: string; symbol: string; slug: string }
      }
    }>
    category: string
    tags: string[]
  }
}

function mapCmcToRawToken(listing: {
  id: number
  name: string
  symbol: string
  date_added: string
  quote?: { USD?: { price?: number } }
}, details: {
  name: string
  symbol: string
  logo: string
  description: string
  urls: {
    website?: string[]
    twitter?: string[]
    telegram?: string[]
    [key: string]: string[] | undefined
  }
  contract_address?: Array<{
    contract_address: string
    platform: {
      name: string
      coin: { id: string; name: string; symbol: string; slug: string }
    }
  }>
  category: string
  tags: string[]
}) {
  const primaryContract = details.contract_address?.[0]

  const socialLinks: Record<string, string[]> = {}
  if (details.urls.twitter?.length) socialLinks.twitter = details.urls.twitter
  if (details.urls.telegram?.length) socialLinks.telegram = details.urls.telegram

  return {
    name: details.name,
    symbol: details.symbol,
    chain: primaryContract?.platform?.name ?? null,
    contract_address: primaryContract?.contract_address ?? null,
    website_url: details.urls.website?.[0] ?? null,
    logo_url: details.logo || null,
    social_links: socialLinks,
    exchange_links: [],
    source_type: 'coinbase' as const,
    source_url: `https://coinmarketcap.com/currencies/${details.symbol.toLowerCase()}/`,
    raw_payload: {
      cmc_listing: listing,
      cmc_details: details,
    },
    status: 'pending' as const,
  }
}

async function isTokenInRawTokens(symbol: string, name: string): Promise<boolean> {
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

async function isRawTokensTableEmpty(): Promise<boolean> {
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

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
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

    if (isEmpty) {
      // Table is empty: ingest exactly 10 tokens
      const listings = await getLatestListings(10)

      for (const listing of listings) {
        const details = await getTokenDetails(listing.id)
        const tokenData = mapCmcToRawToken(listing, details)

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
          const tokenData = mapCmcToRawToken(listing, details)

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
          }
        }

        start += batchSize
      }
    }

    return NextResponse.json({ imported: results.length, results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
