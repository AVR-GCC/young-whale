import { getLastPublishedAt } from '@/lib/sitemap-utils'

export async function YMYLTrustSignals() {
  const lastPublishedAt = await getLastPublishedAt()

  const formattedDateTime = lastPublishedAt
    ? lastPublishedAt.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : '—'

  return (
    <div className="w-full bg-[#0B0F19]/95 backdrop-blur-sm border-t border-cyan-400/20 sm:border-b sm:border-cyan-400/10 py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] sm:shadow-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-2 text-center sm:text-left text-xs text-slate-400/60">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
          <span className="font-mono text-[10px] tracking-wider">
            LAST UPDATED: {formattedDateTime}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-[10px] tracking-wider">
            DATA: CoinMarketCap / CoinRanking / On-Chain
          </span>
        </div>
        <div className="text-[10px] tracking-wider text-amber-400/70 font-medium">
          Not financial advice. Cryptocurrency assets involve high risk.
        </div>
      </div>
    </div>
  )
}
