'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import CategoryContainer from './CategoryContainer'
import { categories } from '../lib/categories'
import type { TokenWithHashtags } from '@/shared/types'
import MobileCategoryFooter from './MobileCategoryFooter'
import TokenTerminal from './TokenTerminal'

interface CategoryGridProps {
  tokens: TokenWithHashtags[]
  loading: boolean
  selectedToken: string | null
  setSelectedToken: (token: string | null) => void
  activeFilter: string | null
  sortBy: 'default' | 'score' | 'hashtag'
}

export default function CategoryGrid({
  tokens,
  loading,
  selectedToken,
  setSelectedToken,
  activeFilter,
  sortBy,
}: CategoryGridProps) {
  const [selectedCategory, selectCategory] = useState(categories[0].id)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [mobileOverlayTokenIndex, setMobileOverlayTokenIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Close overlay when switching categories
  useEffect(() => {
    setTimeout(() => setMobileOverlayOpen(false))
  }, [selectedCategory])

  const minSwipeDistance = 50

  const getCategoryTokens = useCallback((categoryId: string) => {
    return tokens
      .filter((token) => token.category === categoryId)
      .sort((a, b) => {
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
  }, [tokens, sortBy])

  const handleMobileTokenClick = useCallback((tokenId: string, categoryId: string) => {
    const categoryTokens = getCategoryTokens(categoryId)
    const index = categoryTokens.findIndex(t => t.id === tokenId)
    if (index !== -1) {
      setMobileOverlayTokenIndex(index)
      setMobileOverlayOpen(true)
    }
  }, [getCategoryTokens])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const categoryTokens = getCategoryTokens(selectedCategory)
    if (isLeftSwipe && mobileOverlayTokenIndex < categoryTokens.length - 1) {
      setMobileOverlayTokenIndex(prev => prev + 1)
    }
    if (isRightSwipe && mobileOverlayTokenIndex > 0) {
      setMobileOverlayTokenIndex(prev => prev - 1)
    }
  }, [touchStart, touchEnd, selectedCategory, mobileOverlayTokenIndex, getCategoryTokens])

  const overlayTokens = useMemo(() => {
    return getCategoryTokens(selectedCategory)
  }, [selectedCategory, getCategoryTokens])

  const currentOverlayToken = overlayTokens[mobileOverlayTokenIndex]
  const overlayCategory = categories.find(c => c.id === selectedCategory)
  const overlayThemeColor = overlayCategory?.color ?? '#22D3EE'

  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const isOverlayExpired = currentOverlayToken ? new Date(currentOverlayToken.created_at) < oneDayAgo : false

  const renderCategory = (category: typeof categories[0], renderTitle: boolean = true) => {
    const categoryTokens = tokens
      .filter((token) => token.category === category.id)
      .sort((a, b) => {
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
      <CategoryContainer
        key={category.id}
        category={category}
        tokenCount={categoryTokens.length}
        tokens={categoryTokens}
        selectedToken={selectedToken}
        setSelectedTokenAction={setSelectedToken}
        loading={loading}
        renderTitle={renderTitle}
        onMobileTokenClick={handleMobileTokenClick}
      />
    )
  }

  return (
    <>
      {/* Desktop Category Layout — grid ensures equal row heights */}
      <div className={`hidden lg:grid lg:grid-cols-2 gap-x-6 gap-y-3 w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 relative'}`}>
        {categories.map(cat => renderCategory(cat, true))}
      </div>

      {/* Mobile Category Layout — single category full screen with footer */}
      <div className={`flex lg:hidden flex-col w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 absolute inset-x-0 bottom-0 top-[80px]'}`}>
        {/* Active Category Content */}
        <div className="flex-1 overflow-y-auto">
          {renderCategory(categories.find(c => c.id === selectedCategory) || categories[0], false)}
        </div>

        {/* Mobile Category Footer */}
        <MobileCategoryFooter selectCategory={selectCategory} selectedCategory={selectedCategory} />
      </div>

      {/* Mobile Token Overlay */}
      {mobileOverlayOpen && currentOverlayToken && (
        <div
          className="fixed inset-x-0 bottom-[81px] top-[80px] z-30 flex flex-col bg-[#0B0F19] lg:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex-1 overflow-y-auto">
            <TokenTerminal
              token={currentOverlayToken}
              themeColor={overlayThemeColor}
              isExpired={isOverlayExpired}
              isExpanded={true}
            />
          </div>
        </div>
      )}
    </>
  )
}
