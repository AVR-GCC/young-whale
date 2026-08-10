import { supabaseService } from '@/lib/supabase/service'

const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com'
const CG_BASE_URL = 'https://api.coingecko.com/api/v3'

export async function getLatestListings(limit = 10, start = 1) {
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
    total_supply: number
  }>
}

export async function getTokenDetails(cmcId: number) {
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
    total_supply: number
    urls: {
      facebook?: string[]
      reddit?: string[]
      website?: string[]
      twitter?: string[]
      telegram?: string[]
      explorer?: string[]
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

export function mapCmcToRawToken(listing: {
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
    explorer?: string[]
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
}, chains: Array<{ id: string; explorer_prefix: string }>) {
  const primaryContract = details.contract_address?.[0]

  const socialLinks: Record<string, string> = {}
  if (details.urls.facebook?.length) socialLinks.facebook = details.urls.facebook[0]
  if (details.urls.reddit?.length) socialLinks.reddit = details.urls.reddit[0]
  if (details.urls.twitter?.length) socialLinks.twitter = details.urls.twitter[0]
  if (details.urls.telegram?.length) socialLinks.telegram = details.urls.telegram[0]
  let explorer = '';
  if (details.urls.explorer?.length) explorer = details.urls.explorer[0]

  if (details.urls.chat?.length) {
    if (!socialLinks.telegram) {
      const telegramUrls = details.urls.chat.filter((url) => url.includes('t.me/'))
      if (telegramUrls.length) socialLinks.telegram = telegramUrls[0]
    }

    const discordUrls = details.urls.chat.filter((url) => url.includes('discord.gg/'))
    if (discordUrls.length) socialLinks.discord = discordUrls[0]
  }
  let chain = primaryContract?.platform?.name ?? '';
  if (chain === '' && explorer !== '') {
    for (const chainRecord of chains) {
      if (chainRecord.explorer_prefix && explorer.includes(chainRecord.explorer_prefix)) {
        chain = chainRecord.id;
        break;
      }
    }
  }
  if (chain === '') chain = 'original';

  const contract_address = primaryContract?.contract_address ?? '';
  const source_url = `https://coinmarketcap.com/currencies/${details.slug}`;

  return {
    name: details.name,
    symbol: details.symbol,
    chain,
    contract_address,
    explorer,
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

export function collectHashtags(
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

export async function getCoinGeckoMarkets(page = 1, perPage = 100) {
  const url = new URL(`${CG_BASE_URL}/coins/markets`)
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', perPage.toString())
  url.searchParams.set('page', page.toString())
  url.searchParams.set('sparkline', 'false')

  const response = await fetch(url.toString(), {
    headers: {
      'x-cg-demo-api-key': process.env.COINGEKO_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CoinGecko markets error: ${response.status} ${response.statusText}`)
  }

  return await response.json() as Array<{
    id: string
    symbol: string
    name: string
    image: string
    current_price: number | null
    market_cap: number | null
    total_volume: number | null
    circulating_supply: number | null
    total_supply: number | null
    max_supply: number | null
  }>
}

export async function getCoinGeckoCoinDetails(coinId: string) {
  const url = new URL(`${CG_BASE_URL}/coins/${coinId}`)
  url.searchParams.set('localization', 'false')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')

  const response = await fetch(url.toString(), {
    headers: {
      'x-cg-demo-api-key': process.env.COINGEKO_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CoinGecko details error: ${response.status} ${response.statusText}`)
  }

  return await response.json() as {
    id: string
    symbol: string
    name: string
    description: { en?: string }
    image: { thumb?: string; small?: string; large?: string }
    links: {
      homepage?: string[]
      twitter_screen_name?: string
      telegram_channel_identifier?: string
      subreddit_url?: string
      facebook_username?: string
      blockchain_site?: string[]
      official_forum_url?: string[]
      chat_url?: string[]
    }
    platforms: Record<string, string | null>
    market_data: {
      circulating_supply: number | null
      total_supply: number | null
      max_supply: number | null
    }
    categories: string[]
  }
}

export function mapCoinGeckoToRawToken(
  market: {
    id: string
    symbol: string
    name: string
    image: string
    total_supply: number | null
  },
  details: {
    id: string
    symbol: string
    name: string
    description: { en?: string }
    image: { thumb?: string; small?: string; large?: string }
    links: {
      homepage?: string[]
      twitter_screen_name?: string
      telegram_channel_identifier?: string
      subreddit_url?: string
      facebook_username?: string
      blockchain_site?: string[]
      official_forum_url?: string[]
      chat_url?: string[]
    }
    platforms: Record<string, string | null>
    market_data: {
      circulating_supply: number | null
      total_supply: number | null
      max_supply: number | null
    }
    categories: string[]
  },
  chains: Array<{ id: string; explorer_prefix: string }>
) {
  // Find primary contract address and chain from platforms
  const platforms = details.platforms || {}
  let chain = ''
  let contract_address = ''

  for (const [platformName, address] of Object.entries(platforms)) {
    if (address && address.trim() !== '') {
      chain = platformName
      contract_address = address
      break
    }
  }

  // Try to match chain with our chains table
  if (chain) {
    for (const chainRecord of chains) {
      if (chainRecord.id.toLowerCase() === chain.toLowerCase()) {
        chain = chainRecord.id
        break
      }
    }
  }

  // Build explorer URL from blockchain_site
  let explorer = ''
  if (details.links.blockchain_site?.length) {
    explorer = details.links.blockchain_site[0]
  }

  // If no chain from platforms, try to infer from explorer
  if (!chain && explorer) {
    for (const chainRecord of chains) {
      if (chainRecord.explorer_prefix && explorer.includes(chainRecord.explorer_prefix)) {
        chain = chainRecord.id
        break
      }
    }
  }

  if (!chain) chain = 'original'

  // Build social links
  const socialLinks: Record<string, string> = {}
  if (details.links.twitter_screen_name) {
    socialLinks.twitter = `https://twitter.com/${details.links.twitter_screen_name}`
  }
  if (details.links.telegram_channel_identifier) {
    socialLinks.telegram = `https://t.me/${details.links.telegram_channel_identifier}`
  }
  if (details.links.subreddit_url) {
    socialLinks.reddit = details.links.subreddit_url
  }
  if (details.links.facebook_username) {
    socialLinks.facebook = `https://facebook.com/${details.links.facebook_username}`
  }

  // Check chat URLs for discord
  if (details.links.chat_url?.length) {
    for (const url of details.links.chat_url) {
      if (url.includes('discord.gg/') && !socialLinks.discord) {
        socialLinks.discord = url
      }
    }
  }

  const website_url = details.links.homepage?.[0] || null
  const logo_url = details.image?.large || details.image?.small || market.image || null
  const supply = market.total_supply ?? details.market_data?.total_supply ?? 0

  return {
    name: details.name,
    symbol: details.symbol.toUpperCase(),
    chain,
    contract_address,
    explorer,
    website_url,
    logo_url,
    social_links: socialLinks,
    exchange_links: [],
    source_type: 'coingecko' as const,
    source_url: `https://www.coingecko.com/en/coins/${details.id}`,
    raw_payload: {
      coingecko_market: market,
      coingecko_details: details,
    },
    status: 'pending' as const,
    supply,
  }
}

export function collectCoinGeckoHashtags(
  details: {
    categories: string[]
  },
  hashtagMap: Map<string, string>
) {
  if (!details.categories || !Array.isArray(details.categories)) {
    return
  }

  for (const category of details.categories) {
    if (category) {
      const slug = category.toLowerCase().replace(/\s+/g, '-').trim()
      if (slug) {
        hashtagMap.set(slug, category)
      }
    }
  }
}
