import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0F19] font-mono mt-16 pb-12 border-t border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center">

        {/* Brand Sign-off */}
        <div className="flex flex-col items-center mb-8 w-full">
          <Image
            src="/public-master.png"
            alt="logo"
            width={100}
            height={100}
            className="w-50 h-50 object-contain p-0.5"
            unoptimized
          />
          <div className="text-slate-500 text-xs tracking-widest text-center mt-2">
            [ YOUNGWHALE.IO <span className="text-green-400 animate-pulse">●</span> SONAR RADAR ACTIVE ]
          </div>
        </div>

        {/* System Routing / Links */}
        <div className="flex flex-col items-center gap-4 mb-8 text-xs md:text-sm tracking-widest">
          <div className="flex justify-center gap-4 md:gap-6">
            <a href="#" aria-label="X (Twitter)" className="text-white/90 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer">[ 𝕏 ]</a>
            <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer">[ SUBMIT TOKEN ]</a>
            <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer">[ ADVERTISE ]</a>
          </div>
          <div className="flex justify-center gap-4 md:gap-6">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer">[ T&C ]</a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer">[ PRIVACY ]</a>
          </div>
        </div>

        {/* Compliance & Disclaimers */}
        <div className="max-w-4xl text-center text-xs leading-relaxed text-slate-500/40 mb-10 px-4 md:px-0">
            All data provided on youngwhale.io is for informational purposes only and does not constitute financial or investment advice. Users acknowledge that youngwhale.io is an independent data aggregator; we are not affiliated or associated, directly or indirectly, with any token, cryptocurrency project, or exchange. Token data is displayed via a 24-hour TTL static snapshot; youngwhale.io does not track live prices, nor do we operate as an exchange. To prevent artificial hype, Sonar Scores are strictly capped at a maximum rating and remain valid exclusively for the initial 24-hour period. Please note: Sonar Scores reflect automated activity metrics, not project legitimacy, safety, or endorsement.
        </div>

      </div>
    </footer>
  )
}
