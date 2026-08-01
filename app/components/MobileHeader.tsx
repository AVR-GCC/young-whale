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

  const title = (
    <div className={`fixed left-0 transition-transform duration-1000 ease-out ${
      isSearchOpen
        ? 'translate-x-[calc(1.25rem_-_100vw)]'
        : isMobileOverlayOpen
        ? '-translate-x-60'
        : 'translate-x-5'
    }`}>
      <HeaderTitle isMobile isMobileOverlayOpen={isMobileOverlayOpen} />
    </div>
  );

  const timer = (
    <div className={`fixed left-0 transition-transform duration-1000 ease-out ${
      isSearchOpen
        ? 'translate-x-[calc(-50vw_-_50%)]'
        : isMobileOverlayOpen
        ? 'translate-x-[calc(-10rem_-_50%)]'
        : 'translate-x-[calc(50vw_-_50%)]'
    }`}>
      <div className="py-1 px-2.5 flex-1 flex flex-col items-center transition-all duration-1000 ease-in-out">
        <span className="font-oxanium text-[11px] font-bold text-[#FFFFFF] uppercase">NEXT WAVE</span>
        <span className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-widest leading-none">
          {formatCountdown(secondsLeft)}
        </span>
      </div>
    </div>
  );

  const whale = (
    <div className={`fixed left-0 transition-transform duration-1000 ease-out ${
      isSearchOpen
        ? 'translate-x-[calc(-4.5rem_-_100%)]'
        : isMobileOverlayOpen
        ? 'translate-x-5'
        : 'translate-x-[calc(100vw_-_4.5rem_-_100%)]'
    }`}>
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
  );

  const settings = (
    <div className={`fixed right-0 transition-transform duration-1000 ease-out ${
      isSearchOpen
        ? 'translate-x-[calc(-2.5rem_-_100vw)]'
        : isMobileOverlayOpen
        ? '-translate-x-5'
        : '-translate-x-10'
    }`}>
      <SettingsButton
        isInviteModalOpen={isInviteModalOpen}
        isSettingsOpen={isSettingsOpen}
        setSettingsOpenAction={setSettingsOpenAction}
        settingsView={settingsView}
        setSettingsViewAction={setSettingsViewAction}
      />
    </div>
  );

  const search = (
    <div className={`fixed right-0 flex transition-transform duration-1000 ease-out ${isMobileOverlayOpen ? 'translate-x-7' : (isSearchOpen ? 'translate-x-[94vw]' : '-translate-x-3')}`}>
      <SearchButton
        isSearchOpen={isSearchOpen}
        setIsSearchOpenAction={setIsSearchOpenAction}
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQueryAction}
      />
    </div>
  );

  const pill = (
    <TerminalPill />
  );

  return (
    <div className={`flex items-center relative w-full h-10 ${isSearchOpen ? '-translate-x-[94vw] ' : ''}transition-all duration-1000 ease-out`}>
      {title}

      {timer}

      {whale}
      {settings}
      {search}


      {/* <div className="flex items-center gap-4 justify-end flex-1"> */}
      {/* </div> */}
    </div>
  )
}
