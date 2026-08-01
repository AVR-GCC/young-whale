'use client'

import Link from 'next/link'
import { Search, Settings } from 'lucide-react'
import { useRef, useEffect } from 'react'

export function formatCountdown(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const paddedHrs = String(hrs).padStart(2, '0')
  const paddedMins = String(mins).padStart(2, '0')
  const paddedSecs = String(secs).padStart(2, '0')
  return `${paddedHrs}:${paddedMins}:${paddedSecs}`
}

export interface HeaderProps {
  secondsLeft: number
  isSearchOpen: boolean
  setIsSearchOpenAction: (open: boolean) => void
  searchQuery: string
  setSearchQueryAction: (query: string) => void
  timeFilter: 'all' | 'today' | 'yesterday'
  setTimeFilterAction: (filter: 'all' | 'today' | 'yesterday') => void
  sortBy: 'default' | 'score' | 'hashtag'
  setSortByAction: (sort: 'default' | 'score' | 'hashtag') => void
  isMobileOverlayOpen: boolean
  isSettingsOpen: boolean
  setSettingsOpenAction: (val: boolean) => void
  settingsView: string
  setSettingsViewAction: (view: string) => void
}

export function WhaleIcon({
  isInviteModalOpen,
  onClickAction,
}: {
  isInviteModalOpen: boolean
  onClickAction?: () => void
}) {
  return (
    <div
      style={{
        filter: isInviteModalOpen ? 'drop-shadow(0 0 2px #22d3ee) drop-shadow(0 0 5px #22d3ee)' : 'none',
      }}
    >
      <div
        onClick={onClickAction}
        style={{
          width: 24,
          height: 35,
          maskImage: `url(/whale-trans.svg)`,
          WebkitMaskImage: `url(/whale-trans.svg)`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: isInviteModalOpen ? '#33FFFF' : '#94A3B8',
          cursor: onClickAction ? 'pointer' : 'default',
        }}
      />
    </div>
  )
}

export function SettingsButton({
  isInviteModalOpen,
  isSettingsOpen,
  setSettingsOpenAction,
  settingsView,
  setSettingsViewAction,
}: {
  isInviteModalOpen: boolean
  isSettingsOpen: boolean
  setSettingsOpenAction: (val: boolean) => void
  settingsView: string
  setSettingsViewAction: (view: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!isSettingsOpen) {
          setSettingsOpenAction(true)
          setSettingsViewAction('directory')
          return
        }
        if (settingsView !== 'directory') {
          setSettingsViewAction('directory')
          return
        }
        setSettingsOpenAction(false)
      }}
      className="flex p-1 focus:outline-none flex-shrink-0"
      style={{
        filter: !isInviteModalOpen && isSettingsOpen ? 'drop-shadow(0 0 2px #22d3ee) drop-shadow(0 0 5px #22d3ee)' : 'none',
      }}
      aria-label="Toggle settings"
    >
      <Settings className="w-4 h-4 text-[#94A3B8] hover:text-[#CBD5E1] transition-colors" />
    </button>
  )
}

export function SearchButton({
  isSearchOpen,
  setIsSearchOpenAction,
  searchQuery,
  setSearchQueryAction,
  classes,
}: {
  isSearchOpen: boolean
  setIsSearchOpenAction: (open: boolean) => void
  searchQuery: string
  setSearchQueryAction: (query: string) => void
  classes?: string
}) {
  useEffect(() => {
    if (!isSearchOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-search-container]')) {
        setIsSearchOpenAction(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen, setIsSearchOpenAction])

  return (
    <div className={classes}>
      <button
        type="button"
        onClick={() => setIsSearchOpenAction(!isSearchOpen)}
        className="p-1 focus:outline-none flex-shrink-0"
        aria-label="Toggle search"
      >
        <Search className="w-4 h-4 text-[#94A3B8] hover:text-[#CBD5E1] transition-colors" />
      </button>
      <div className="flex items-center gap-2 md:gap-3 pl-1">
        <input
          autoFocus
          type="text"
          placeholder="SEARCH..."
          value={searchQuery}
          onChange={(e) => setSearchQueryAction(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-[10px] uppercase font-mono text-[#F8FAFC] w-full placeholder-[#475569] pb-[1px]"
        />
      </div>
    </div>
  )
}

export function TerminalPill() {
  return (
    <div className="px-4 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[#F8FAFC] font-oxanium text-xs font-semibold tracking-wide">
      YoungWhale Terminal
    </div>
  )
}

export function HeaderTitle({
  isMobileOverlayOpen = false,
  isMobile = false,
}: {
  isMobileOverlayOpen?: boolean
  isMobile?: boolean
}) {
  return (
    <div
      className={`flex-shrink-0 flex-1 flex items-center transition-all duration-1000 ease-in-out ${
        isMobile && isMobileOverlayOpen
          ? 'opacity-0 -translate-x-4 pointer-events-none'
          : 'opacity-100 translate-x-0'
      }`}
    >
      <Link
        href="/"
        className={`font-oxanium font-bold tracking-wide text-slate-50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-600 ${
          isMobile ? 'text-[10px]' : 'text-xl'
        }`}
      >
        YoungWhale.io
      </Link>
    </div>
  )
}
