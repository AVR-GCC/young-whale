import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabaseService } from '@/lib/supabase/service'
import Link from 'next/link'
import type { TokenWithHashtags } from '@/shared/types'

const BASE_URL = 'https://youngwhale.io'
const TOKENS_PER_PAGE = 20

interface PaginatedPageProps {
  params: Promise<{ page: string }>
}

async function getTokensForPage(page: number): Promise<{
  tokens: TokenWithHashtags[]
  totalCount: number
  totalPages: number
}> {
  // Get total count first
  const { count, error: countError } = await supabaseService
    .from('tokens')
    .select('*', { count: 'exact', head: true })
    .not('published_at', 'is', null)

  if (countError) {
    console.error('Error counting tokens:', countError.message)
    return { tokens: [], totalCount: 0, totalPages: 0 }
  }

  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / TOKENS_PER_PAGE)

  // Fetch tokens for this page
  const from = (page - 1) * TOKENS_PER_PAGE
  const to = from + TOKENS_PER_PAGE - 1

  const { data, error } = await supabaseService
    .from('tokens')
    .select(
      `*,
      token_hashtags(
        hashtags(id, name, slug)
      )`
    )
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching paginated tokens:', error.message)
    return { tokens: [], totalCount, totalPages }
  }

  const tokens: TokenWithHashtags[] = (data ?? []).map((token) => ({
    ...token,
    hashtags:
      token.token_hashtags?.map(
        (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
      ) ?? [],
  }))

  return { tokens, totalCount, totalPages }
}

export async function generateMetadata({ params }: PaginatedPageProps): Promise<Metadata> {
  const { page: pageParam } = await params
  const page = parseInt(pageParam, 10)

  if (isNaN(page)) {
    return {
      title: 'Token Archive | Young Whale',
    }
  }

  const { totalPages } = await getTokensForPage(page)

  if (page > totalPages && totalPages > 0) {
    return {
      title: 'Page Not Found | Young Whale',
    }
  }

  const canonicalUrl = `${BASE_URL}/page/${page}`

  return {
    title: `Token Archive - Page ${page} | Young Whale`,
    description: `Browse page ${page} of the latest cryptocurrency token listings on Young Whale.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function PaginatedPage({ params }: PaginatedPageProps) {
  const { page: pageParam } = await params
  const page = parseInt(pageParam, 10)

  // Validate page number
  if (isNaN(page)) {
    notFound()
  }

  const { tokens, totalPages } = await getTokensForPage(page)

  // If page exceeds total pages, return 404
  if (page > totalPages && totalPages > 0) {
    notFound()
  }

  const canonicalUrl = `${BASE_URL}/page/${page}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SiteNavigationElement',
        name: 'Home',
        url: 'https://youngwhale.io/',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Token Archive',
        url: canonicalUrl,
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'New Tech Projects',
        url: 'https://youngwhale.io/?category=tech',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'New Meme Coins',
        url: 'https://youngwhale.io/?category=meme',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Latest RWA Tokens',
        url: 'https://youngwhale.io/?category=rwa',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Upcoming Presales & Airdrops',
        url: 'https://youngwhale.io/?category=presale',
      },
    ],
  }

  return (
    <>
      {/* Self-referencing canonical link */}
      <link rel="canonical" href={canonicalUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-dvh w-full flex flex-col items-center bg-[#0B0F19] text-[#F8FAFC] font-outfit">
        <main className="max-w-7xl mx-auto w-full px-4 pt-8 pb-16 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-oxanium text-2xl font-bold tracking-wider">
              Token Archive - Page {page}
            </h1>
            <p className="text-slate-400 text-sm">
              Browse all published tokens. Page {page} of {totalPages}.
            </p>
          </div>

          {/* Token List */}
          <div className="flex flex-col gap-3">
            {tokens.map((token) => (
              <Link
                key={token.id}
                href={`/token/${token.symbol.toLowerCase()}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-[#1E293B]/40 hover:border-[#1E293B] hover:bg-white/5 transition-all"
              >
                {token.logo_url ? (
                  <Image
                    src={token.logo_url}
                    alt={`${token.name} token logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-zinc-300">
                      {token.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[#E2E8F0] truncate">
                    {token.name} ({token.symbol})
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {token.short_description || token.full_description || 'No description available'}
                  </span>
                </div>
                <span className="ml-auto text-xs text-slate-500 uppercase">
                  {token.category}
                </span>
              </Link>
            ))}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              {page > 1 && (
                <Link
                  href={`/page/${page - 1}`}
                  className="px-4 py-2 rounded-lg border border-[#1E293B]/40 hover:border-[#1E293B] hover:bg-white/5 transition-all text-sm"
                >
                  ← Previous
                </Link>
              )}
              {page > 1 && (
                <Link
                  href="/page/1"
                  className="px-4 py-2 rounded-lg border border-[#1E293B]/40 hover:border-[#1E293B] hover:bg-white/5 transition-all text-sm"
                >
                  First Page
                </Link>
              )}
              <span className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/page/${page + 1}`}
                  className="px-4 py-2 rounded-lg border border-[#1E293B]/40 hover:border-[#1E293B] hover:bg-white/5 transition-all text-sm"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
