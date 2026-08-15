import { RawToken } from '@/shared/types'

const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com'

export type CMCListing = {
    id: number
    name: string
    symbol: string
    date_added: string
    quote?: { USD?: { price?: number } }
    total_supply: number
}

export type CMCDetails = {
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

export async function getLatestListingsCMC(limit = 10, start = 1) {
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
    const errStr = `CMC listings error: ${response.status} ${response.statusText}`
    console.log(errStr);
    throw new Error(errStr)
  }

  const json = await response.json()
  return json.data as Array<CMCListing>
}

async function getTokenDetailsCMC(cmcId: number) {
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
  return json.data[cmcId.toString()] as CMCDetails
}

function mapToRawTokenCMC(listing: CMCListing, details: CMCDetails, chains: Array<{ id: string; explorer_prefix: string }>) {
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
    source_type: 'coinmarketcap' as const,
    source_url,
    raw_payload: {
      cmc_listing: listing,
      cmc_details: details,
    },
    status: 'pending' as const,
    supply: listing.total_supply,
  } as Partial<RawToken>
}

function collectHashtagsCMC(
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

export type CMCListingEntry = { source: 'coinmarketcap', listing: CMCListing }

export async function processTokenCMC(
  listing: CMCListing,
  chains: Array<{ id: string; explorer_prefix: string }>,
  hashtagMap: Map<string, string>
) {
  const details = await getTokenDetailsCMC(listing.id)
  collectHashtagsCMC(details, hashtagMap)
  return mapToRawTokenCMC(listing, details, chains) 
}

export type CMCSourceType = { name: 'coinmarketcap', getListings: typeof getLatestListingsCMC, processToken: typeof processTokenCMC }
export const CMCSource: CMCSourceType = {
  name: 'coinmarketcap',
  getListings: getLatestListingsCMC,
  processToken: processTokenCMC
}
