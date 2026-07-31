'use client'

import { HeaderProps, formatCountdown, WhaleIcon, SettingsButton, SearchButton, TerminalPill, HeaderTitle } from './HeaderShared'

export default function MobileHeader({
  secondsLeft,
  isSearchOpen,
  setIsSearchOpenAction,
  searchQuery,
  setSearchQueryAction,
  isMobileOverlayOpen,
  isSettingsOpen,
  setSettingsOpenAction,
  settingsView,
  setSettingsViewAction,
}: HeaderProps) {
  const isInviteModalOpen = settingsView === 'invite' && isSettingsOpen

  return (
    <div className="flex md:hidden items-center justify-between gap-4 w-full relative h-10">
      <HeaderTitle isMobile isMobileOverlayOpen={isMobileOverlayOpen} />

      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out z-10 ${isMobileOverlayOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
        <WhaleIcon
          isInviteModalOpen={isInviteModalOpen}
          onClickAction={() => {
            if (!isSettingsOpen) {
              setSettingsOpenAction(true)
              setSettingsViewAction('invite')
              return
            }
            if (settingsView !== 'invite') {
              setSettingsViewAction('invite')
              return
            }
            setSettingsOpenAction(false)
          }}
        />
      </div>

      <div className={`py-1 px-2.5 flex-1 flex flex-col items-center transition-all duration-1000 ease-in-out ${isMobileOverlayOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <span className="font-oxanium text-[11px] font-bold text-[#FFFFFF] uppercase">NEXT WAVE</span>
        <span className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-widest leading-none">
          {formatCountdown(secondsLeft)}
        </span>
      </div>

      <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out z-10 ${isMobileOverlayOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <TerminalPill />
      </div>

      <div className="flex items-center gap-4 justify-end flex-1">
        <div className={`flex items-center border-b ${isSearchOpen ? 'border-[#334155]' : 'border-transparent'} transition-all`}>
          <div className={`flex items-center transition-all duration-1000 ease-in-out ${isMobileOverlayOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <WhaleIcon
              isInviteModalOpen={isInviteModalOpen}
              onClickAction={() => {
                if (!isSettingsOpen) {
                  setSettingsOpenAction(true)
                  setSettingsViewAction('invite')
                  return
                }
                if (settingsView !== 'invite') {
                  setSettingsViewAction('invite')
                  return
                }
                setSettingsOpenAction(false)
              }}
            />
            <div className="w-3" />
          </div>
          <SettingsButton
            isInviteModalOpen={isInviteModalOpen}
            isSettingsOpen={isSettingsOpen}
            setSettingsOpenAction={setSettingsOpenAction}
            settingsView={settingsView}
            setSettingsViewAction={setSettingsViewAction}
          />
          <div className="w-2" />
          <SearchButton
            isSearchOpen={isSearchOpen}
            setIsSearchOpenAction={setIsSearchOpenAction}
            searchQuery={searchQuery}
            setSearchQueryAction={setSearchQueryAction}
          />
        </div>
      </div>
    </div>
  )
}
