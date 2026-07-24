'use client'

import { useState, useCallback } from 'react'
import type { TokenWithHashtags } from '@/shared/types'
import { CustomTooltip } from './CustomTooltip'
import TokenCard from './TokenCard'
import { CategoryType } from '../lib/categories'
import { SkeletonTokenRow } from './SkeletonTokenRow'

interface CategoryContainerProps {
  category: CategoryType
  tokenCount: number
  tokens: TokenWithHashtags[]
  selectedToken: string | null
  setSelectedTokenAction: (st: string | null) => void
  loading: boolean
  renderTitle: boolean
}

// --- Constants for CategoryBlock features with no working-app equivalent ---
// CategoryBlock receives these as props; here they are fixed defaults.
const EMPTY_MESSAGE = 'NO CHANNELS DISCOVERED UNDER ACTIVE SCAN SECTORS'

// CategoryBlock's `limit` / `setLimit` map to these.
const INITIAL_LIMIT = 5
const LIMIT_STEP = 5

export default function CategoryContainer({
  renderTitle,
  category,
  tokens,
  selectedToken,
  loading,
  setSelectedTokenAction
}: CategoryContainerProps) {
  const [limit, setLimit] = useState(INITIAL_LIMIT)

  const handleSurface = useCallback(() => {
    setLimit(INITIAL_LIMIT)
  }, [])

  const handleScanDeeper = useCallback(() => {
    setLimit((prev) => prev + LIMIT_STEP)
  }, [])

  // Sort all tokens by rating (highest first) — homolog of CategoryBlock's scoreValue sort.
  const sortedTokens = [...tokens].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime() ?? 0
    const dateB = new Date(b.created_at).getTime() ?? 0
    return dateB - dateA
  })

  const promotedList = sortedTokens.filter(st => st.is_promoted)
  const sliced = sortedTokens.slice(0, limit)

  return (
    <div className="flex flex-col bg-[#0B0F19] rounded-xl overflow-hidden border border-[#1E293B]/40 transition-colors break-inside-avoid">
      {renderTitle && (
        <div className="px-5 pt-2 pb-1.5 bg-[#0B0F19] flex items-center justify-between border-b border-[#1E293B]/25">
          <div className="flex items-center gap-2">
            <h2
              className="font-oxanium text-[13px] font-extrabold tracking-[2px]"
              style={{ color: category.color }}
            >
              {category.title}
            </h2>
            <CustomTooltip content={category.tooltip} position="bottom" borderColor={category.color}>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1E293B] hover:text-[#0B0F19] font-bold font-serif text-[10px] cursor-default transition-colors leading-none italic pb-[1px]"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = category.color; e.currentTarget.style.color = '#0B0F19'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E293B'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                i
              </div>
            </CustomTooltip>
          </div>
        </div>
      )}

      <div className="flex flex-col bg-[#0B0F19]">
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => <SkeletonTokenRow key={`skeleton-${category.id}-${i}`} />)}
          </>
        ) : (
          sliced.length > 0 ? (
            <>
              {/* Sliced List */}
              <div className="flex flex-col">
                  {sliced.map((token) => (
                    <TokenCard
                      key={token.id}
                      token={token}
                      themeColor={category.color}
                      isExpanded={selectedToken === token.id}
                      setIsExpandedAction={expanded => setSelectedTokenAction(expanded ? token.id : null)}
                    />
                  ))}
              </div>

              {/* Expand/Collapse Separator */}
              {tokens.length > 5 && (
                <div className="relative w-full flex items-center justify-center z-30 h-[10px] my-1">
                  <div className="absolute w-full h-px bg-[#1E293B] left-0 top-1/2 -translate-y-1/2" />
                  <div className="absolute top-1/2 -translate-y-1/2 bg-[#0B0F19] px-2 flex items-center gap-2 rounded-sm border border-[#1E293B]/60 shadow-[0_0_4px_rgba(0,0,0,0.8)] z-10 h-5">
                    {limit > 5 && (
                      <CustomTooltip content="Surface list" position="top" borderColor={category.color}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSurface()
                          }}
                          className="font-oxanium text-[20px] font-black transition-all duration-200 cursor-pointer select-none hover:scale-125 focus:outline-none w-5 h-5 flex items-center justify-center leading-none"
                          style={{
                            color: category.color,
                            opacity: 0.8,
                            textShadow: `0 0 6px ${category.color}66`,
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                          −
                        </button>
                      </CustomTooltip>
                    )}
                    {tokens.length > limit && (
                      <CustomTooltip content="Scan deeper" position="top" borderColor={category.color}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleScanDeeper()
                          }}
                          className="font-oxanium text-[20px] font-black transition-all duration-200 cursor-pointer select-none hover:scale-125 focus:outline-none w-5 h-5 flex items-center justify-center leading-none"
                          style={{
                            color: category.color,
                            opacity: 0.8,
                            textShadow: `0 0 6px ${category.color}66`,
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                          +
                        </button>
                      </CustomTooltip>
                    )}
                  </div>
                </div>
              )}

              {/* Promoted List (not inside the scrollable container) */}
              {promotedList.map((token) => (
                  <TokenCard
                    key={token.id}
                    token={token}
                    themeColor={category.color}
                    isExpanded={selectedToken === token.id}
                    setIsExpandedAction={expanded => setSelectedTokenAction(expanded ? token.id : null)}
                  />
              ))}
            </>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-slate-500 bg-[#070A10]/10 border-b border-[#1E293B]">
              {EMPTY_MESSAGE}
            </div>
          )
        )}
      </div>
    </div>
  )
}
