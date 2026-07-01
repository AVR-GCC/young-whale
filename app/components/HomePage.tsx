'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import CategoryGrid from './CategoryGrid'
import FilteredSignals from './FilteredSignals'
import Footer from './Footer'
import type { TokenWithHashtags } from '@/shared/types'

interface HomePageProps {
  tokens: TokenWithHashtags[]
  loading: boolean
}

// --- Hardcoded values for example-app features with no current-app equivalent ---
const INITIAL_SECONDS = 7200 // 2 hours in seconds

// Simple SubscriptionTerminal placeholder matching example appearance
function SubscriptionTerminal() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-[#0B0F19] border border-[#1E293B]/40 rounded-xl p-6 text-center">
        <span className="font-mono text-xs text-slate-500">SUBSCRIPTION TERMINAL PLACEHOLDER</span>
      </div>
    </div>
  )
}

export default function HomePage({ tokens, loading }: HomePageProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter] = useState<'all' | 'today' | 'yesterday'>('all')
  const [sortBy] = useState<'default' | 'score' | 'hashtag'>('default')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? INITIAL_SECONDS : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Filter tokens by search query (example-app logic adapted to current-app props)
  const filteredTokens = tokens.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const nameMatch = t.name?.toLowerCase().includes(q)
      const descMatch =
        t.short_description?.toLowerCase().includes(q) ||
        t.full_description?.toLowerCase().includes(q)
      const tagMatch = t.hashtags?.some((h) => h.name?.toLowerCase().includes(q))
      if (!nameMatch && !descMatch && !tagMatch) return false
    }
    return true
  })

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0B0F19] text-[#F8FAFC] font-outfit pb-10 selection:bg-[#00E5D2]/30 selection:text-[#00E5D2] relative overflow-x-hidden">

      <Header
        secondsLeft={secondsLeft}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        timeFilter={timeFilter}
        sortBy={sortBy}
      />

      <main className="max-w-7xl mx-auto w-full px-4 pt-2 flex flex-col gap-4">
        <CategoryGrid
          tokens={tokens}
          loading={loading}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          activeFilter={activeFilter}
        />

        <FilteredSignals
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          loading={loading}
          filteredTokens={filteredTokens}
        />
      </main>

      <SubscriptionTerminal />

      <Footer />

    </div>
  )
}
