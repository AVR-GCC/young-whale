'use client'

import { HeaderProps, formatCountdown, SearchSettings, HeaderTitle } from './HeaderShared'

export default function DesktopHeader({
  secondsLeft,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  isSettingsOpen,
  setSettingsOpen,
  settingsView,
  setSettingsView,
}: HeaderProps) {
  const isInviteModalOpen = settingsView === 'invite' && isSettingsOpen

  return (
    <div className="hidden md:flex items-center justify-between gap-4 w-full h-full">
      <HeaderTitle />

      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out opacity-100 scale-100">
        <div className="relative py-1 px-4.5 bg-[#0A0F1D]/85 min-w-[240px] select-none text-center rounded-sm">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#51c9e2]/60" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#51c9e2]/60" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#51c9e2]/60" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#51c9e2]/60" />

          <div className="flex items-center justify-center gap-2.5">
            <div className="flex items-center gap-1.5 text-left">
              <span className="font-oxanium text-[11px] leading-none text-[#FFFFFF] tracking-[0.05em] font-bold flex items-center">
                CRYPTO WHALES START HERE <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-[sonar-pulse_3.5s_ease-in-out_infinite] mx-2 shrink-0" /> <span className="text-[#94A3B8] font-semibold">INCOMING TOKENS & DAILY SCORES</span>
              </span>
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

      <div className="flex items-center gap-4 justify-end flex-none">
        <div className={`flex items-center border-b ${isSearchOpen ? 'border-[#334155]' : 'border-transparent'} transition-all`}>
          <SearchSettings
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isInviteModalOpen={isInviteModalOpen}
            isSettingsOpen={isSettingsOpen}
            setSettingsOpen={setSettingsOpen}
            settingsView={settingsView}
            setSettingsView={setSettingsView}
          />
        </div>
      </div>
    </div>
  )
}
