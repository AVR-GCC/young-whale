// app/sitemap.ts
// Auto-generates /sitemap.xml with all approved token pages
// Next.js serves this automatically at https://youngwhale.io/sitemap.xml
// Google reads this to discover all token pages

import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client'

const BASE_URL = 'https://youngwhale.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all approved tokens
  const { data: tokens } = await supabase
    .from('tokens')
    .select('slug, updated_at')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })

  // Fetch all active hashtags
  // const { data: hashtags } = await supabase
  //   .from('hashtags')
  //   .select('slug')
  //   .eq('is_active', true)

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',   // homepage updates every 30 min with new tokens
      priority: 1.0,
    },
    // {
    //   url: `${BASE_URL}/category/presale`,
    //   lastModified: new Date(),
    //   changeFrequency: 'hourly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/category/tech`,
    //   lastModified: new Date(),
    //   changeFrequency: 'hourly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/category/meme`,
    //   lastModified: new Date(),
    //   changeFrequency: 'hourly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/category/rwa`,
    //   lastModified: new Date(),
    //   changeFrequency: 'hourly',
    //   priority: 0.8,
    // },
  ]

  // Hashtag pages
  // const hashtagPages: MetadataRoute.Sitemap = (hashtags ?? []).map(hashtag => ({
  //   url: `${BASE_URL}/hashtag/${hashtag.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'hourly' as const,
  //   priority: 0.7,
  // }))

  // Token pages — one per approved token
  const tokenPages: MetadataRoute.Sitemap = (tokens ?? []).map(token => ({
    url: `${BASE_URL}/token/${token.slug}`,
    lastModified: new Date(token.updated_at),
    changeFrequency: 'weekly' as const,  // token data doesn't change often
    priority: 0.6,
  }))

  return [...staticPages, ...tokenPages /* , ...hashtagPages */]
}
