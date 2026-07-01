export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0F19] font-mono mt-16 pb-12 pt-12 border-t border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center">

        {/* Brand Sign-off */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="border border-dashed border-slate-600 px-6 h-12 md:h-16 flex items-center justify-center mb-3 text-slate-500 tracking-widest text-xs md:text-sm text-center w-full max-w-sm">
            [ LOGO IMAGE GOES HERE ]
          </div>
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
          All data provided is for informational purposes only and does not constitute financial advice. Tokens are displayed via a 24-hour TTL static snapshot. YoungWhale does not track live prices and is not an exchange. To prevent artificial hype and ensure algorithmic integrity, Sonar Scores are strictly capped at a maximum rating.
        </div>

      </div>
    </footer>
  )
}
