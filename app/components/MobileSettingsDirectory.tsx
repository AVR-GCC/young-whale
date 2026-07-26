import { Rocket, Key, MessageSquare, ScrollText, AlertTriangle, EyeOff, ChevronRight } from 'lucide-react';

interface MobileSettingsDirectoryProps {
  setView: (view: string) => void
}

export default function MobileSettingsDirectory({
  setView
}: MobileSettingsDirectoryProps) {
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <div className="flex flex-col w-full mt-2">
        <div className="px-3 mb-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-oxanium">TAKE ACTION</span>
        </div>
        <button onClick={() => setView('invite')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-2 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-2 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Community Invite
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
        <button onClick={() => setView('promote')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-2 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-2 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <Rocket className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Promote Token
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
        <a href="#" className="relative w-full cursor-pointer select-none flex flex-col rounded mb-2 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-2 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                𝕏
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Follow on X
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </a>
        <button onClick={() => setView('contact')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-2 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-2 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Contact Us
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>

        <div className="px-3 mb-2 mt-4">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-oxanium">BEDTIME STORIES</span>
        </div>

        <button onClick={() => setView('legal')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-2 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-2 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Legal Disclaimer
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
        <button onClick={() => setView('tc')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-1 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-1.5 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <ScrollText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Terms & Conditions
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
        <button onClick={() => setView('privacy')} className="relative w-full cursor-pointer select-none flex flex-col rounded mb-1 border border-transparent transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.06] group text-left">
          <div className="flex items-center w-full px-3 py-1.5 gap-2 z-10 bg-transparent rounded">
            <div className="flex-shrink-0 relative">
              <div className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors bg-black">
                <EyeOff className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center gap-0.5 overflow-hidden pr-2">
              <div className="flex items-center gap-1.5 min-w-0 w-full">
                <span className="font-outfit font-bold text-[13px] sm:text-[14px] text-white truncate min-w-0">
                  Privacy Policy
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 justify-center gap-1.5">
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
