import { Metadata } from 'next'
import HomePageClient from './components/HomePageClient'

const HOMEPAGE_DESCRIPTION =
  'YoungWhale is your daily Crypto Intelligence Terminal for discovering the newest coins'

export const metadata: Metadata = {
  metadataBase: new URL('https://youngwhale.io'),
  description: HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: 'Young Whale - New Token Listings',
    description: HOMEPAGE_DESCRIPTION,
    url: 'https://youngwhale.io',
    siteName: 'Young Whale',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 890,
        alt: 'Young Whale - New Token Listings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Young Whale - New Token Listings',
    description: 'Explore latest cryptocurrency tokens across: Tech, Meme, Real world assets and Presale',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://youngwhale.io/',
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Young Whale',
        url: 'https://youngwhale.io/',
        description: HOMEPAGE_DESCRIPTION,
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Home',
        url: 'https://youngwhale.io/',
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
      {
        '@type': 'SiteNavigationElement',
        name: 'Token Archive',
        url: 'https://youngwhale.io/page/1',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Terms and Conditions',
        url: 'https://youngwhale.io/terms',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Privacy Policy',
        url: 'https://youngwhale.io/privacy',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Legal Disclaimer',
        url: 'https://youngwhale.io/legal',
      },
    ],
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
