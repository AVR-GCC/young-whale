'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import CategoryGrid from './CategoryGrid'
import FilteredSignals from './FilteredSignals'
import Footer from './Footer'
import type { TokenWithHashtags } from '@/shared/types'
import { SubscriptionTerminal } from './SubscriptionTerminal'

interface HomePageProps {
  tokens: TokenWithHashtags[]
  loading: boolean
}

// --- Hardcoded values for example-app features with no current-app equivalent ---
const INITIAL_SECONDS = 7200 // 2 hours in seconds

const ONE_DAY = 24 * 60 * 60 * 1000
const now = new Date()
const oneDayAgo = new Date(now.getTime() - ONE_DAY)
const twoDayAgo = new Date(now.getTime() - ONE_DAY * 2)

export default function HomePage({ tokens, loading }: HomePageProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'yesterday'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'score' | 'hashtag'>('default')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? INITIAL_SECONDS : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Filter tokens by search query and time filter
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

    // Time filter
    if (timeFilter === 'all') return true
    const tokenTime = new Date(t.created_at)
    if (timeFilter === 'today') return tokenTime > oneDayAgo
    return tokenTime > twoDayAgo && tokenTime <= oneDayAgo
  })

  // Sort tokens based on sortBy selection
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (sortBy === 'score') {
      return (b.rating || 0) - (a.rating || 0)
    }
    if (sortBy === 'hashtag') {
      const tagA = a.hashtags?.[0]?.name || ''
      const tagB = b.hashtags?.[0]?.name || ''
      if (tagA !== tagB) return tagA.localeCompare(tagB)
    }
    // Default: sort by created_at desc (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
        setTimeFilter={setTimeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main className="max-w-7xl mx-auto w-full px-4 pt-2 flex flex-col gap-4">
        <CategoryGrid
          tokens={sortedTokens}
          loading={loading}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          activeFilter={activeFilter}
          sortBy={sortBy}
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
