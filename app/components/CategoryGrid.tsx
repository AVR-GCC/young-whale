'use client'

import { useState } from 'react'
import CategoryContainer from './CategoryContainer'
import { categories } from '../lib/categories'
import type { TokenWithHashtags } from '@/shared/types'
import MobileCategoryFooter from './MobileCategoryFooter'

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
      <div className={`flex lg:hidden flex-col w-full h-[calc(100vh-80px)] transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 relative'}`}>
        {/* Active Category Content */}
        <div className="flex-1 overflow-y-auto">
          {renderCategory(categories.find(c => c.id === selectedCategory) || categories[0], false)}
        </div>

        {/* Mobile Category Footer */}
        <MobileCategoryFooter selectCategory={selectCategory} selectedCategory={selectedCategory} />
      </div>
    </>
  )
}
