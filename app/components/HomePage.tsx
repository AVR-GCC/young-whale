'use client'

import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import Header from './Header'
import CategoryGrid from './CategoryGrid'
// import FilteredSignals from './FilteredSignals'
import Footer from './Footer'
import type { TokenWithHashtags } from '@/shared/types'
import { categories } from '../lib/categories'
import { SubscriptionTerminal } from './SubscriptionTerminal'
import { LegalModal, LegalTab } from './LegalModal'
import { ContactFormModal } from './ContactForm'

interface HomePageProps {
  tokens: TokenWithHashtags[]
  loading: boolean
  newTokenIds?: ReadonlySet<string>
}

// --- Hardcoded values for example-app features with no current-app equivalent ---
const getSecondsUntilMidnightUTC = () => {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
}

const ONE_DAY = 24 * 60 * 60 * 1000
const now = new Date()
const oneDayAgo = new Date(now.getTime() - ONE_DAY)
const twoDayAgo = new Date(now.getTime() - ONE_DAY * 2)

export default function HomePage({ tokens, loading, newTokenIds }: HomePageProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [selectedCategory, selectCategory] = useState(categories[0].id)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'yesterday'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'score' | 'hashtag'>('default')
  // const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null)
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false)
  const [isFooterOpen, setIsFooterOpen] = useState(false)
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState('directory');

  const toggleSearchOpen = (open: boolean) => {
    if (isSearchOpen && !open) {
      setSearchQuery('')
    }
    setIsSearchOpen(open)
  }

  const setToDefaultCategory = () => {
    selectCategory(categories[0].id);
  }

  const openSubmitModal = () => {
    // No-op: submit modal placeholder
  }

  useEffect(() => {
    setTimeout(() => setSecondsLeft(getSecondsUntilMidnightUTC()))
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? getSecondsUntilMidnightUTC() : prev - 1))
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
    <div className="min-h-dvh w-full flex flex-col items-center bg-[#0B0F19] text-[#F8FAFC] font-outfit selection:bg-[#00E5D2]/30 selection:text-[#00E5D2] relative overflow-x-hidden">
      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalTab !== null}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'tc'}
      />

      {/* Contact Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <Header
        secondsLeft={secondsLeft}
        isSearchOpen={isSearchOpen}
        setIsSearchOpenAction={toggleSearchOpen}
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQuery}
        timeFilter={timeFilter}
        setTimeFilterAction={setTimeFilter}
        sortBy={sortBy}
        setSortByAction={setSortBy}
        isMobileOverlayOpen={isMobileOverlayOpen}
        isSettingsOpen={isSettingsOpen}
        setSettingsOpenAction={setSettingsOpen}
        settingsView={settingsView}
        setSettingsViewAction={setSettingsView}
        setToDefaultCategory={setToDefaultCategory}
      />

      <main className="max-w-7xl mx-auto w-full px-4 pt-2 flex flex-col gap-4">
        <CategoryGrid
          tokens={sortedTokens}
          loading={loading}
          newTokenIds={newTokenIds}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          activeFilter={null}
          sortBy={sortBy}
          setIsMobileOverlayOpen={setIsMobileOverlayOpen}
          setSettingsOpenAction={setSettingsOpen}
          isSettingsOpen={isSettingsOpen}
          setSettingsViewAction={setSettingsView}
          settingsView={settingsView}
          selectedCategory={selectedCategory}
          selectCategory={selectCategory}
        />

        {/* <FilteredSignals */}
        {/*   activeFilter={activeFilter} */}
        {/*   setActiveFilter={setActiveFilter} */}
        {/*   loading={loading} */}
        {/*   filteredTokens={filteredTokens} */}
        {/* /> */}
      </main>

      <div className="hidden md:block pb-10" data-testid="desktop-footer-container">
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setIsFooterOpen((v) => !v)}
            aria-expanded={isFooterOpen}
            aria-controls="desktop-footer-panel"
            aria-label="Toggle footer settings"
            className="p-2 rounded-md border border-slate-700 bg-black/40 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/40 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-[120ms] cursor-pointer"
          >
            <Settings
              className={`w-4 h-4 transition-transform duration-300 ${isFooterOpen ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        <div
          id="desktop-footer-panel"
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isFooterOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <SubscriptionTerminal />

            <Footer
              openSubmitModal={openSubmitModal}
              setIsContactModalOpen={setIsContactModalOpen}
              setLegalModalTab={setLegalModalTab}
            />
          </div>
        </div>
      </div>

      {/* Mobile SEO Footer - always rendered but visually hidden, ensuring crawlers see the links in initial HTML */}
      <div className="md:hidden sr-only" aria-hidden="true">
        <a href="/terms">Terms and Conditions</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/legal">Legal Disclaimer</a>
        <a href="https://x.com/YoungWhaleLabs" target="_blank" rel="noopener">Follow on X</a>
      </div>
    </div>
  )
}
