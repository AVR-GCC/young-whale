'use client'

const DROPLETS = ['💧', '💦', '✨', '💧', '💦']

export default function WhaleSplash({ count }: { count: number }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-end justify-center pb-16 pointer-events-none"
    >
      <div className="whale-splash flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-[#0B0F19]/90 border border-[#00E5D2]/40 shadow-[0_0_30px_rgba(0,229,210,0.35)]">
        <div className="flex gap-1 text-xl h-6">
          {DROPLETS.map((droplet, i) => (
            <span key={i} className="whale-splash-droplet" style={{ animationDelay: `${900 + i * 120}ms` }}>
              {droplet}
            </span>
          ))}
        </div>
        <div className="text-5xl">🐋</div>
        <div className="font-oxanium text-sm font-extrabold tracking-[3px] text-[#00E5D2]">
          {count} NEW TOKEN{count === 1 ? '' : 'S'} SURFACED
        </div>
      </div>
    </div>
  )
}
