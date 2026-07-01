'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { CustomTooltip } from './CustomTooltip'

function formatCountdown(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const paddedHrs = String(hrs).padStart(2, '0')
  const paddedMins = String(mins).padStart(2, '0')
  const paddedSecs = String(secs).padStart(2, '0')
  return `${paddedHrs}:${paddedMins}:${paddedSecs}`
}

interface HeaderProps {
  secondsLeft: number
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  timeFilter: 'all' | 'today' | 'yesterday'
  setTimeFilter: (filter: 'all' | 'today' | 'yesterday') => void
  sortBy: 'default' | 'score' | 'hashtag'
  setSortBy: (sort: 'default' | 'score' | 'hashtag') => void
}

export default function Header({
  secondsLeft,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  timeFilter,
  setTimeFilter,
  sortBy,
  setSortBy,
}: HeaderProps) {
  return (
    <header className="pt-2 pb-1.5 w-full border-b border-[#1E293B]/25 bg-[#070A10]/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between gap-4 relative h-10 md:h-12">

        {/* Top Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className="font-oxanium font-bold text-xl tracking-wide text-slate-50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
          >
            YoungWhale.io
          </Link>
        </div>

        {/* Center: Timer */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="relative py-1 px-4.5 bg-[#0A0F1D]/85 min-w-[240px] select-none text-center rounded-sm">
            {/* Custom Corner Brackets */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#51c9e2]/60" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#51c9e2]/60" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#51c9e2]/60" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#51c9e2]/60" />

            <div className="flex items-center justify-center gap-2.5">
              <div className="flex items-center gap-1.5 text-left">
                <span className="font-oxanium text-[11px] leading-none text-[#FFFFFF] tracking-[0.05em] font-bold flex items-center">
                  CRYPTO WHALES START HERE <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-[sonar-pulse_3.5s_ease-in-out_infinite] mx-2 shrink-0" /> <span className="text-[#94A3B8] font-semibold">INCOMING TOKENS & DAILY SCORES</span>
                </span>
                <CustomTooltip content={<div className="text-justify">We surface and filter the newest tokens daily. The Sonar Score is a live snapshot. Scores auto-expire after 24 hours.</div>} position="bottom">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1E293B] hover:bg-[#00F0FF] text-[#94A3B8] hover:text-[#0B0F19] font-bold font-serif text-[10px] cursor-default transition-colors leading-none italic pb-[1px]">
                    i
                  </div>
                </CustomTooltip>
              </div>
              <div className="w-[1px] h-4 bg-[#1E293B]/80" />
              <span
                className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-widest block transition-all leading-none"
                style={{ textShadow: '0 0 8px rgba(81, 201, 226, 0.25)' }}
              >
                {formatCountdown(secondsLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Global Search & Mobile Timer */}
        <div className="flex items-center gap-4 justify-end flex-1 md:flex-none">
          <div className={`flex items-center border-b ${isSearchOpen ? 'border-[#334155]' : 'border-transparent'} transition-all`}>
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 focus:outline-none flex-shrink-0"
              aria-label="Toggle search"
            >
              <Search className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#CBD5E1] transition-colors" />
            </button>
            {isSearchOpen && (
              <div className="flex items-center gap-2 md:gap-3 pl-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-[10px] uppercase font-mono text-[#F8FAFC] w-16 md:w-28 placeholder-[#475569] pb-[1px]"
                />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as 'all' | 'today' | 'yesterday')}
                  className="bg-[#0B0F19] text-[#94A3B8] border-none focus:outline-none text-[9px] uppercase font-mono cursor-pointer outline-none p-0 w-auto"
                >
                  <option value="all">TIME: ALL</option>
                  <option value="today">TODAY</option>
                  <option value="yesterday">1D AGO</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'default' | 'score' | 'hashtag')}
                  className="bg-[#0B0F19] text-[#94A3B8] border-none focus:outline-none text-[9px] uppercase font-mono cursor-pointer outline-none p-0 w-auto"
                >
                  <option value="default">SORT: DFLT</option>
                  <option value="hashtag">HASHTAG</option>
                </select>
              </div>
            )}
          </div>

          {/* Mobile Timer */}
          <div className="md:hidden py-1 px-2.5 bg-[#0A0F1D]/85 rounded-sm border border-[#1E293B]/60 flex items-center gap-1.5">
            <span className="font-oxanium text-[7px] font-bold text-[#FFFFFF] uppercase">NEXT WAVE:</span>
            <span className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-widest leading-none">
              {formatCountdown(secondsLeft)}
            </span>
            <div className="w-1 h-1 rounded-full bg-[#94A3B8] animate-[sonar-pulse_3.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </header>
  )
}
