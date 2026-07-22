// app/robots.ts
// Auto-generates /robots.txt
// Tells Google what to crawl and where the sitemap is

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',       // admin panel
          '/api/',        // all API routes
        ],
      },
    ],
    sitemap: 'https://youngwhale.io/sitemap.xml',
  }
}
