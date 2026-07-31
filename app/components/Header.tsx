'use client'

import { HeaderProps } from './HeaderShared'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

export default function Header(props: HeaderProps) {
  return (
    <header className="pt-2 pb-1.5 w-full sm:border-b border-[#1E293B]/25 bg-[#000000] sm:bg-[#070A10]/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto w-full px-4 relative h-10 md:h-12">
        <DesktopHeader {...props} />
        <MobileHeader {...props} />
      </div>
    </header>
  )
}
