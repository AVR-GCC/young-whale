import { MetadataRoute } from 'next'
import { supabaseService } from '@/lib/supabase/service'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

const BASE_URL = 'https://youngwhale.io'
const TOKENS_PER_PAGE = 20

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get total count for pagination
  const { count: totalTokens } = await supabaseService
    .from('tokens')
    .select('*', { count: 'exact', head: true })
    .not('published_at', 'is', null)

  const totalPages = Math.ceil((totalTokens ?? 0) / TOKENS_PER_PAGE)
  const lastModified = (await getLastPublishedAt()) || new Date()

  // Paginated archive pages starting at page 1
  return Array.from({ length: Math.max(0, totalPages) }, (_, i) => {
    const pageNum = i + 1
    return {
      url: `${BASE_URL}/page/${pageNum}`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.4,
    }
  })
}
