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
