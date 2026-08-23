import { Metadata } from 'next'
import HomePageClient from './components/HomePageClient'

const HOMEPAGE_DESCRIPTION =
  'YoungWhale is your daily Crypto Intelligence Terminal for discovering the newest coins.'

export const metadata: Metadata = {
  description: HOMEPAGE_DESCRIPTION,
  openGraph: {
    description: HOMEPAGE_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://youngwhale.io/',
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Young Whale',
    url: 'https://youngwhale.io/',
    description: HOMEPAGE_DESCRIPTION,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  )
}
