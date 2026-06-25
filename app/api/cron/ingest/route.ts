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
    slug: string
    logo: string
    description: string
    urls: {
      facebook?: string[]
      reddit?: string[]
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
    'tag-names': string[]
  }
}

function mapCmcToRawToken(listing: {
  id: number
  name: string
  symbol: string
  date_added: string
  quote?: { USD?: { price?: number } }
  total_supply: number
}, details: {
  name: string
  symbol: string
  slug: string
  logo: string
  description: string
  urls: {
    facebook?: string[]
    reddit?: string[]
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
  'tag-names': string[]
}) {
  const primaryContract = details.contract_address?.[0]

  const socialLinks: Record<string, string[]> = {}
  if (details.urls.facebook?.length) socialLinks.facebook = details.urls.facebook
  if (details.urls.reddit?.length) socialLinks.reddit = details.urls.reddit
  if (details.urls.twitter?.length) socialLinks.twitter = details.urls.twitter
  if (details.urls.telegram?.length) socialLinks.telegram = details.urls.telegram

  if (details.urls.chat?.length) {
    if (!socialLinks.telegram) {
      const telegramUrls = details.urls.chat.filter((url) => url.includes('t.me/'))
      if (telegramUrls.length) socialLinks.telegram = telegramUrls
    }

    const discordUrls = details.urls.chat.filter((url) => url.includes('discord.gg/'))
    if (discordUrls.length) socialLinks.discord = discordUrls
  }
  const chain = primaryContract?.platform?.name ?? '';
  const contract_address = primaryContract?.contract_address ?? '';
  const source_url = `https://coinmarketcap.com/currencies/${details.slug}`;

  return {
    name: details.name,
    symbol: details.symbol,
    chain,
    contract_address,
    website_url: details.urls.website?.[0] ?? null,
    logo_url: details.logo || null,
    social_links: socialLinks,
    exchange_links: [],
    source_type: 'coinbase' as const,
    source_url,
    raw_payload: {
      cmc_listing: listing,
      cmc_details: details,
    },
    status: 'pending' as const,
    supply: listing.total_supply,
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

function collectHashtags(
  details: {
    tags: string[]
    'tag-names': string[]
  },
  hashtagMap: Map<string, string>
) {
  if (
    !details.tags ||
    !details['tag-names'] ||
    details.tags.length !== details['tag-names'].length
  ) {
    return
  }

  for (let i = 0; i < details.tags.length; i++) {
    const slug = details.tags[i].toLowerCase().trim()
    const name = details['tag-names'][i]
    if (slug && name) {
      hashtagMap.set(slug, name)
    }
  }
}

async function syncHashtags(hashtagMap: Map<string, string>) {
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

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    if (isEmpty) {
      // Table is empty: ingest exactly 20 tokens
      const listings = await getLatestListings(20)

      for (const listing of listings) {
        const details = await getTokenDetails(listing.id)
        collectHashtags(details, hashtagMap)
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
