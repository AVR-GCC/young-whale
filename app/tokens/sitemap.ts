import { MetadataRoute } from 'next'
import { supabaseService } from '@/lib/supabase/service'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

const BASE_URL = 'https://youngwhale.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all approved tokens
  const { data: tokens } = await supabaseService
    .from('tokens')
    .select('symbol')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })

  const lastModified = (await getLastPublishedAt()) || new Date()

  // Token pages — one per approved token
  return (tokens ?? []).map((token) => ({
    url: `${BASE_URL}/token/${token.symbol.toLowerCase()}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
}
