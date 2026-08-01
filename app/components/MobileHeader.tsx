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
    <div className={`fixed left-0 transition-all duration-5000 ease-out ${isMobileOverlayOpen ? '-translate-x-60' : 'translate-x-5'}`}>
      <HeaderTitle isMobile isMobileOverlayOpen={isMobileOverlayOpen} />
    </div>
  );

  const timer = (
    <div className={`fixed left-0 transition-all duration-5000 ease-out ${isMobileOverlayOpen ? 'translate-x-[calc(-10rem_-_50%)]' : 'translate-x-[calc(50vw_-_50%)]'}`}>
      <div className="py-1 px-2.5 flex-1 flex flex-col items-center transition-all duration-5000 ease-in-out">
        <span className="font-oxanium text-[11px] font-bold text-[#FFFFFF] uppercase">NEXT WAVE</span>
        <span className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-widest leading-none">
          {formatCountdown(secondsLeft)}
        </span>
      </div>
    </div>
  );

  const whale = (
    <div className={`fixed left-0 transition-all duration-5000 ease-out ${isMobileOverlayOpen ? 'translate-x-5' : 'translate-x-[calc(100vw_-_4.5rem_-_100%)]'}`}>
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
    <div className={`fixed left-0 transition-all duration-5000 ease-out ${isMobileOverlayOpen ? 'translate-x-[calc(100vw_-_1rem_-_100%)]' : 'translate-x-[calc(100vw_-_2.5rem_-_100%)]'}`}>
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
    <SearchButton
      isSearchOpen={isSearchOpen}
      setIsSearchOpenAction={setIsSearchOpenAction}
      searchQuery={searchQuery}
      setSearchQueryAction={setSearchQueryAction}
      classes={`fixed left-0 flex bg-[#00ff00] transition-all duration-5000 ease-out overflow-hidden w-6 ${isMobileOverlayOpen ? 'translate-x-[100vw]' : (isSearchOpen ? 'translate-x-[94vw] w-[94vw]' : 'translate-x-[calc(100vw_-_0.7rem_-_100%)]')}`}
    />
  );

  const pill = (
    <TerminalPill />
  );

  return (
    <div className={`flex md:hidden bg-[#ff0000] items-center relative w-[196vw] h-10 transition-all duration-5000 ease-out ${isSearchOpen ? '-translate-x-[96vw]' : ''}`}>
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
