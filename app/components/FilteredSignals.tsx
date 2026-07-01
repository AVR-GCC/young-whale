'use client'

import type { TokenWithHashtags } from '@/shared/types'

const playAudioFeedback = (type: 'hover' | 'select' | 'error' = 'hover') => {
  console.log('type', type);
  // No-op: audio feedback not implemented in current app
}

interface FilteredSignalsProps {
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
  loading: boolean
  filteredTokens: TokenWithHashtags[]
}

export default function FilteredSignals({
  activeFilter,
  setActiveFilter,
  loading,
  filteredTokens,
}: FilteredSignalsProps) {
  return (
    <div id="fs" className={`transition-opacity duration-300 w-full ${activeFilter ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute inset-x-0 top-0'}`}>
      <div className="flex flex-col bg-[#0B0F19] rounded-xl overflow-hidden border border-[#1E293B]/40 shadow-lg">
        <div className="px-5 py-2.5 bg-[#0B0F19] flex items-center justify-between border-b border-[#1E293B]">
          <h2 className="font-oxanium text-[13px] font-extrabold uppercase tracking-[2px] text-white flex items-center gap-2">
            FILTERED SIGNALS:
            <button
              onClick={() => {
                playAudioFeedback('select')
                setActiveFilter(null)
              }}
              type="button"
              className="hover:text-[#51c9e2] transition-colors focus:outline-none"
            >
              #{activeFilter}
            </button>
          </h2>
          <button
            onClick={() => {
              playAudioFeedback('select')
              setActiveFilter(null)
            }}
            type="button"
            className="text-slate-400 hover:text-white font-mono text-[10px] flex items-center gap-1.5 transition-colors outline-none cursor-pointer"
          >
            <span className="text-[#51c9e2]">[ x ]</span> CLEAR FILTER
          </button>
        </div>
        <div className="flex flex-col bg-[#0B0F19]">
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={`filter-skel-${i}`} className="h-16 border-b border-[#1E293B] last:border-b-0" />
              ))}
            </>
          ) : (
            <>
              {filteredTokens.filter(t => t.hashtags?.some(h => h.name === activeFilter)).length === 0 && (
                <div className="p-8 text-center font-mono text-xs text-slate-500 bg-[#070A10]/10">
                  NO SIGNALS FOUND FOR THIS TAG
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
