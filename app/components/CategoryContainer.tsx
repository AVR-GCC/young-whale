'use client'

import { useState, useCallback } from 'react'
import type { TokenWithHashtags } from '@/shared/types'
import type { ReactNode } from 'react'
import TokenCard from './TokenCard'

const categoryIcons: Record<string, ReactNode> = {
  Tech: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Meme: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  RWA: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Presale: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

interface CategoryContainerProps {
  category: string
  title: string
  tokenCount: number
  tokens: TokenWithHashtags[]
}

const INITIAL_VISIBLE = 5
const LOAD_MORE_COUNT = 5

export default function CategoryContainer({
  category,
  title,
  tokenCount,
  tokens,
}: CategoryContainerProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
  }, [])

  const visibleTokens = tokens.slice(0, visibleCount)
  const hasMore = tokens.length > visibleCount

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col">
      {/* Titlebar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
        <div className="text-zinc-600 dark:text-zinc-400">
          {categoryIcons[category]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {tokenCount} token{tokenCount !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Token list - height of exactly 5 tokens with scroll */}
      <div className="flex-1 overflow-y-auto max-h-[400px] min-h-[400px]">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {tokens.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              No tokens in this category yet
            </div>
          ) : (
            visibleTokens.map((token) => <TokenCard key={token.id} token={token} />)
          )}
        </div>
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
          <button
            onClick={handleLoadMore}
            className="w-full py-2 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Load more ({tokens.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
