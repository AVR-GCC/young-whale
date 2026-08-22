import { RawToken } from '@/shared/types'
import { sleep } from '@/app/lib/utils'

const CR_BASE_URL = 'https://api.coinranking.com/v2'

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let response = await fetch(url, options)

  if (response.status === 429) {
    const resetSeconds = response.headers.get('RateLimit-Reset')
    const waitMs = resetSeconds ? parseInt(resetSeconds) * 1000 : 1000

    console.log(`Rate limited. Waiting ${waitMs}ms...`)
    await sleep(waitMs)

    response = await fetch(url, options)
  }

  return response
}

export type CRListing = {
  uuid: string
  symbol: string
  name: string
  iconUrl: string
  marketCap: string
  price: string
  listedAt: number
  tier: number
  change: string
  rank: number
  '24hVolume': string
  btcPrice: string
  contractAddresses: string[]
}

export type CRDetails = {
  uuid: string
  symbol: string
  name: string
  description: string | null
  color: string
  iconUrl: string
  websiteUrl: string | null
  links: Array<{
    name: string
    url: string
    type: string
  }>
  supply: {
    confirmed: boolean
    supplyAt: number | null
    circulating: string
    total: string
    max: string
  }
  numberOfMarkets: number
  numberOfExchanges: number
  marketCap: string
  fullyDilutedMarketCap: string
  price: string
  btcPrice: string
  priceAt: number | null
  '24hVolume': string
  change: string
  rank: number
  sparkline: string[] | null
  allTimeHigh: {
    price: string | null
    timestamp: number | null
  }
  coinrankingUrl: string
  tier: number
  lowVolume: boolean
  listedAt: number
  notices: Array<{
    type: string
    value: string
  }>
  contractAddresses: string[]
  tags: string[]
  isWrappedTrustless: boolean
  wrappedTo: string | null
  coinGeckoId: string | null
  coinMarketCapId: string | null
}

export async function getLatestListingsCR(limit = 10, offset = 0) {
  const url = new URL(`${CR_BASE_URL}/coins`)
  url.searchParams.set('limit', limit.toString())
  url.searchParams.set('offset', offset.toString())
  url.searchParams.set('orderBy', 'listedAt')
  url.searchParams.set('orderDirection', 'desc')

  const response = await fetchWithRetry(url.toString(), {
    headers: {
      'x-access-token': process.env.COINRANKING_API_KEY!,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errStr = `CR listings error: ${response.status} ${response.statusText}`
    console.log(errStr)
    throw new Error(errStr)
  }

  const json = await response.json()
  return json.data.coins as Array<CRListing>
}

export async function getTokenDetailsCR(uuid: string) {
  const url = new URL(`${CR_BASE_URL}/coin/${uuid}`)

  const response = await fetchWithRetry(url.toString(), {
    headers: {
      'x-access-token': process.env.COINRANKING_API_KEY!,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`CR info error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return json.data.coin as CRDetails
}

function mapToRawTokenCR(
  listing: CRListing,
  details: CRDetails,
  chains: Array<{ id: string; explorer_prefix: string }>
) {
  const socialLinks: Record<string, string> = {}
  if (details.links) {
    for (const link of details.links) {
      if (link.type === 'twitter' && link.url) {
        socialLinks.twitter = link.url
      } else if (link.type === 'reddit' && link.url) {
        socialLinks.reddit = link.url
      } else if (link.type === 'telegram' && link.url) {
        socialLinks.telegram = link.url
      } else if (link.type === 'discord' && link.url) {
        socialLinks.discord = link.url
      } else if (link.type === 'facebook' && link.url) {
        socialLinks.facebook = link.url
      }
    }
  }

  let chain = ''
  let contract_address = ''
  const explorer = ''

  if (details.contractAddresses && details.contractAddresses.length > 0) {
    const firstContract = details.contractAddresses[0]
    const parts = firstContract.split('/')
    if (parts.length === 2) {
      chain = parts[0]
      contract_address = parts[1]
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

  if (!chain) {
    const websiteUrl = details.websiteUrl || ''
    if (websiteUrl) {
      for (const chainRecord of chains) {
        if (
          chainRecord.explorer_prefix &&
          websiteUrl.includes(chainRecord.explorer_prefix)
        ) {
          chain = chainRecord.id
          break
        }
      }
    }
  }

  if (!chain) chain = 'original'

  const supply = details.supply?.total
    ? parseFloat(details.supply.total)
    : null

  return {
    name: details.name,
    symbol: details.symbol,
    chain,
    contract_address,
    explorer,
    website_url: details.websiteUrl ?? null,
    logo_url: details.iconUrl || null,
    social_links: socialLinks,
    exchange_links: [],
    source_type: 'coinranking' as const,
    source_url: details.coinrankingUrl,
    raw_payload: {
      cr_listing: listing,
      cr_details: details,
    },
    status: 'pending' as const,
    supply,
  } as Partial<RawToken>
}

function collectHashtagsCR(
  details: {
    tags: string[]
  },
  hashtagMap: Map<string, string>
) {
  if (!details.tags || !Array.isArray(details.tags)) {
    return
  }

  for (const tag of details.tags) {
    if (tag) {
      const slug = tag.toLowerCase().replace(/\s+/g, '-').trim()
      if (slug) {
        hashtagMap.set(slug, tag)
      }
    }
  }
}

export type CRListingEntry = { source: 'coinranking'; listing: CRListing }

export async function processTokenCR(
  listing: CRListing,
  chains: Array<{ id: string; explorer_prefix: string }>,
  hashtagMap: Map<string, string>
) {
  const details = await getTokenDetailsCR(listing.uuid)
  collectHashtagsCR(details, hashtagMap)
  return mapToRawTokenCR(listing, details, chains)
}

export type CRSourceType = {
  name: 'coinranking'
  getListings: typeof getLatestListingsCR
  processToken: typeof processTokenCR
}
export const CRSource: CRSourceType = {
  name: 'coinranking',
  getListings: getLatestListingsCR,
  processToken: processTokenCR,
}
