import { MetadataRoute } from 'next'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

const BASE_URL = 'https://youngwhale.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = (await getLastPublishedAt()) || new Date()

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ]
}
