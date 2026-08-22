import { Metadata } from 'next'
import HomePageClient from './components/HomePageClient'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://youngwhale.io/',
  },
}

export default function Home() {
  return <HomePageClient />
}
