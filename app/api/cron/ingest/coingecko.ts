import { RawToken } from '@/shared/types'

const CG_BASE_URL = 'https://api.coingecko.com/api/v3'

export type CGListing = {
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
}

export type CGDetails = {
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

export async function getLatestListingsCG(limit = 10, start = 1) {
  const page = ((start - 1) / limit) + 1;
  const url = new URL(`${CG_BASE_URL}/coins/markets`)
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', limit.toString())
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

  return await response.json() as Array<CGListing>
}

async function getTokenDetailsCG(coinId: string) {
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

  return await response.json() as CGDetails
}

function mapToRawTokenCG(
  market: CGListing,
  details: CGDetails,
  chains: Array<{ id: string; explorer_prefix: string }>
) {
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

  if (chain) {
    for (const chainRecord of chains) {
      if (chainRecord.id.toLowerCase() === chain.toLowerCase()) {
        chain = chainRecord.id
        break
      }
    }
  }

  let explorer = ''
  if (details.links.blockchain_site?.length) {
    explorer = details.links.blockchain_site[0]
  }

  if (!chain && explorer) {
    for (const chainRecord of chains) {
      if (chainRecord.explorer_prefix && explorer.includes(chainRecord.explorer_prefix)) {
        chain = chainRecord.id
        break
      }
    }
  }

  if (!chain) chain = 'original'

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
  } as Partial<RawToken>
}

function collectHashtagsCG(
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

export type CGListingEntry = { source: 'coingecko', listing: CGListing }

export async function processTokenCG(
  listing: CGListing,
  chains: Array<{ id: string; explorer_prefix: string }>,
  hashtagMap: Map<string, string>
) {
  const details = await getTokenDetailsCG(listing.id)
  collectHashtagsCG(details, hashtagMap)
  return mapToRawTokenCG(listing, details, chains) 
}

export type CGSourceType = { name: 'coingecko', getListings: typeof getLatestListingsCG, processToken: typeof processTokenCG }
export const CGSource: CGSourceType = {
  name: 'coingecko',
  getListings: getLatestListingsCG,
  processToken: processTokenCG
}
