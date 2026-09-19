'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import CategoryContainer from './CategoryContainer'
import { categories } from '../lib/categories'
import type { TokenWithHashtags } from '@/shared/types'
import MobileCategoryFooter from './MobileCategoryFooter'
import TokenTerminal from './TokenTerminal'
import MobileSettingsMenu from './MobileSettingsMenu'
import { supabase } from '@/lib/supabase/client'

interface CategoryGridProps {
  tokens: TokenWithHashtags[]
  loading: boolean
  selectedToken: string | null
  setSelectedToken: (token: string | null) => void
  activeFilter: string | null
  sortBy: 'default' | 'score' | 'hashtag'
  setIsMobileOverlayOpen: (open: boolean) => void
  setSettingsOpenAction: (val: boolean) => void
  isSettingsOpen: boolean
  setSettingsViewAction: (view: string) => void
  settingsView: string
  selectedCategory: string
  selectCategory: (categoryId: string) => void
}

const bottomClass = 'bottom-[73px]';
const topClass = 'top-[54px]';

const DAY_MS = 24 * 60 * 60 * 1000

const sortTokens = (tokens: TokenWithHashtags[]) => {
  const now = Date.now()
  return [...tokens].sort((a, b) => {
    // if (sortBy === 'score') {
    //   return (b.rating || 0) - (a.rating || 0)
    // }
    // if (sortBy === 'hashtag') {
    //   const tagA = a.hashtags?.[0]?.name || ''
    //   const tagB = b.hashtags?.[0]?.name || ''
    //   if (tagA !== tagB) return tagA.localeCompare(tagB)
    // }
    // Default: tokens published within the last 24 hours sort by rating, older tokens by published_at (newest first)
    if (!a.published_at || !b.published_at) return 1
    const aPublished = new Date(a.published_at).getTime()
    const bPublished = new Date(b.published_at).getTime()
    const aFresh = now - aPublished < DAY_MS
    const bFresh = now - bPublished < DAY_MS
    if (aFresh !== bFresh) return aFresh ? -1 : 1
    if (aFresh) return (b.rating || 0) - (a.rating || 0)
    return bPublished - aPublished
  })
}

export default function CategoryGrid({
  tokens,
  loading,
  selectedToken,
  setSelectedToken,
  activeFilter,
  // sortBy,
  setIsMobileOverlayOpen,
  setSettingsOpenAction,
  isSettingsOpen,
  setSettingsViewAction,
  settingsView,
  selectedCategory,
  selectCategory
}: CategoryGridProps) {
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [mobileOverlayTokenIndex, setMobileOverlayTokenIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideOffset, setSlideOffset] = useState(-100)
  const [chainIcons, setChainIcons] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchChains() {
      const { data, error } = await supabase
        .from('chains')
        .select('id, icon')

      if (error) {
        console.error('Error fetching chains:', error.message)
        return
      }

      const icons: Record<string, string> = {}
      data?.forEach((chain: { id: string; icon: string | null }) => {
        if (chain.icon) {
          icons[chain.id] = chain.icon
        }
      })
      setChainIcons(icons)
    }

    fetchChains()
  }, [])

  const closeOverlay = useCallback(() => {
    setMobileOverlayOpen(false)
    setIsMobileOverlayOpen(false)
    setSettingsOpenAction(false)
  }, [setMobileOverlayOpen, setIsMobileOverlayOpen, setSettingsOpenAction])

  // Close overlay when switching categories
  useEffect(() => {
    setTimeout(closeOverlay)
  }, [selectedCategory, closeOverlay])

  useEffect(() => {
    if (mobileOverlayOpen) {
      setTimeout(() => {
        setSlideOffset(-100)
        setIsTransitioning(false)
      })
    }
  }, [mobileOverlayOpen])

  const minSwipeDistance = 50

  const getCategoryTokens = useCallback((categoryId: string) => {
    const filtered = tokens.filter((token) => token.category === categoryId)
    return sortTokens(filtered)
  }, [tokens])

  const handleMobileTokenClick = useCallback((tokenId: string, categoryId: string) => {
    const categoryTokens = getCategoryTokens(categoryId)
    const index = categoryTokens.findIndex(t => t.id === tokenId)
    if (index !== -1) {
      setMobileOverlayTokenIndex(index)
      setMobileOverlayOpen(true)
      setIsMobileOverlayOpen(true)
    }
  }, [getCategoryTokens, setIsMobileOverlayOpen])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isTransitioning) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const categoryTokens = getCategoryTokens(selectedCategory)
    if (isLeftSwipe && mobileOverlayTokenIndex < categoryTokens.length - 1) {
      setIsTransitioning(true)
      setSlideOffset(-200)
      setTimeout(() => {
        setMobileOverlayTokenIndex(prev => prev + 1)
        setIsTransitioning(false)
        setSlideOffset(-100)
      }, 200)
    }
    if (isRightSwipe && mobileOverlayTokenIndex > 0) {
      setIsTransitioning(true)
      setSlideOffset(0)
      setTimeout(() => {
        setMobileOverlayTokenIndex(prev => prev - 1)
        setIsTransitioning(false)
        setSlideOffset(-100)
      }, 200)
    }
  }, [touchStart, touchEnd, selectedCategory, mobileOverlayTokenIndex, getCategoryTokens, isTransitioning])

  const overlayTokens = useMemo(() => {
    return getCategoryTokens(selectedCategory)
  }, [selectedCategory, getCategoryTokens])

  const currentOverlayToken = overlayTokens[mobileOverlayTokenIndex]
  const prevToken = overlayTokens[mobileOverlayTokenIndex - 1]
  const nextToken = overlayTokens[mobileOverlayTokenIndex + 1]
  const overlayCategory = categories.find(c => c.id === selectedCategory)
  const overlayThemeColor = overlayCategory?.color ?? '#22D3EE'

  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const isExpired = (token: TokenWithHashtags | undefined) => {
    if (!token) return false
    return new Date(token.created_at) < oneDayAgo
  }

  const renderCategory = (category: typeof categories[0], isMobile: boolean = true) => {
    const categoryTokens = getCategoryTokens(category.id)
    return (
      <CategoryContainer
        key={category.id}
        category={category}
        tokenCount={categoryTokens.length}
        tokens={categoryTokens}
        selectedToken={selectedToken}
        setSelectedTokenAction={setSelectedToken}
        loading={loading}
        isMobile={isMobile}
        onMobileTokenClick={handleMobileTokenClick}
        chainIcons={chainIcons}
      />
    )
  }

  return (
    <>
      {/* Desktop Category Layout — grid ensures equal row heights */}
      <div className={`hidden lg:grid lg:grid-cols-2 gap-x-6 gap-y-3 w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 relative'}`}>
        {categories.map(cat => renderCategory(cat, false))}
      </div>

      {/* Mobile Category Layout — single category full screen with footer */}
      <div className={`flex lg:hidden flex-col w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 absolute inset-x-0 bottom-0 top-[80px]'}`}>
        {/* Active Category Content */}
        <div className="flex-1 overflow-y-auto">
          {renderCategory(categories.find(c => c.id === selectedCategory) || categories[0], true)}
        </div>

        {/* Mobile Category Footer */}
        <MobileCategoryFooter selectCategory={selectCategory} selectedCategory={selectedCategory} />
      </div>

      {/* Mobile Settings */}
      {isSettingsOpen && settingsView && (
        <div
          data-testid="mobile-overlay"
          className={`fixed inset-x-0 ${bottomClass} ${topClass} z-31 flex flex-col bg-[#0B0F19] lg:hidden`}
        >
          <div className="flex-1 overflow-y-auto">
            <MobileSettingsMenu view={settingsView} setView={setSettingsViewAction} />
          </div>
        </div>
      )}

      {/* Mobile Token Overlay */}
      {mobileOverlayOpen && currentOverlayToken && (
        <div
          data-testid="mobile-overlay"
          className={`fixed inset-x-0 ${bottomClass} ${topClass} z-30 flex flex-col bg-[#0B0F19] lg:hidden`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex-1 overflow-hidden">
            <div
              className={`flex h-full ${isTransitioning ? 'transition-transform duration-200 ease-out' : ''}`}
              style={{ transform: `translateX(${slideOffset}%)` }}
            >
              {/* Previous Token */}
              <div className="w-full flex-shrink-0 h-full">
                {prevToken ? (
                  <TokenTerminal
                    token={prevToken}
                    themeColor={overlayThemeColor}
                    isExpired={isExpired(prevToken)}
                    isExpanded={true}
                    chainIcons={chainIcons}
                    closeTerminalAction={closeOverlay}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>

              {/* Current Token */}
              <div className="w-full flex-shrink-0 h-full">
                <TokenTerminal
                  token={currentOverlayToken}
                  themeColor={overlayThemeColor}
                  isExpired={isExpired(currentOverlayToken)}
                  isExpanded={true}
                  chainIcons={chainIcons}
                  closeTerminalAction={closeOverlay}
                />
              </div>

              {/* Next Token */}
              <div className="w-full flex-shrink-0 h-full">
                {nextToken ? (
                  <TokenTerminal
                    token={nextToken}
                    themeColor={overlayThemeColor}
                    isExpired={isExpired(nextToken)}
                    isExpanded={true}
                    chainIcons={chainIcons}
                    closeTerminalAction={closeOverlay}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
