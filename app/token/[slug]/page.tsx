import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseService } from '@/lib/supabase/service'
import TokenTerminal from '@/app/components/TokenTerminal'
import { categories } from '@/app/lib/categories'
import type { TokenWithHashtags } from '@/shared/types'

async function getChains(): Promise<{ chainIcons: Record<string, string>, chainExplorers: Record<string, string> }> {
  const { data, error } = await supabaseService
    .from('chains')
    .select('id, icon, explorer_prefix')

  if (error) {
    console.error('Error fetching chains:', error.message)
    return { chainIcons: {}, chainExplorers: {} }
  }

  const chainIcons: Record<string, string> = {}
  const chainExplorers: Record<string, string> = {}
  data?.forEach((chain: { id: string; icon: string | null; explorer_prefix: string | null }) => {
    if (chain.icon) {
      chainIcons[chain.id] = chain.icon
    }
    if (chain.explorer_prefix) {
      chainExplorers[chain.id] = chain.explorer_prefix
    }
  })
  return { chainIcons, chainExplorers }
}

interface TokenPageProps {
  params: Promise<{ slug: string }>
}

async function getToken(slug: string): Promise<TokenWithHashtags | null> {
  const { data, error } = await supabaseService
    .from('tokens')
    .select(
      `*,
      token_hashtags(
        hashtags(id, name, slug)
      )`
    )
    .eq('symbol', slug.toUpperCase())
    .not('published_at', 'is', null)
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    hashtags:
      data.token_hashtags?.map(
        (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
      ) ?? [],
  }
}

export async function generateMetadata({ params }: TokenPageProps): Promise<Metadata> {
  const { slug } = await params
  const token = await getToken(slug)

  if (!token) {
    return {
      title: 'Token Not Found | Young Whale',
      description: 'This token could not be found.',
    }
  }

  const title = `${token.name} (${token.symbol}) on ${token.chain} | Young Whale`
  const description = token.full_description || token.short_description || `Explore ${token.name} (${token.symbol}) token details on ${token.chain}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://youngwhale.io/token/${token.symbol.toLowerCase()}`,
      images: token.logo_url ? [token.logo_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: token.logo_url ? [token.logo_url] : [],
    },
  }
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { slug } = await params
  const token = await getToken(slug)

  if (!token) {
    notFound()
  }

  const { chainIcons, chainExplorers } = await getChains()
  const category = categories.find((c) => c.id === token.category)
  const themeColor = category?.color ?? '#22D3EE'

  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const isExpired = new Date(token.created_at) < oneDayAgo

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${token.name} (${token.symbol})`,
    description: token.full_description || token.short_description || '',
    url: `https://youngwhale.io/token/${token.symbol.toLowerCase()}`,
    image: token.logo_url || undefined,
    datePublished: token.published_at || token.created_at,
    dateModified: token.updated_at,
    mainEntity: {
      '@type': 'Thing',
      name: token.name,
      identifier: token.contract_address || undefined,
      additionalType: `Cryptocurrency on ${token.chain}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TokenTerminal
        token={token}
        themeColor={themeColor}
        isExpired={isExpired}
        isExpanded={true}
        chainIcons={chainIcons}
        chainExplorers={chainExplorers}
      />
    </>
  )
}
