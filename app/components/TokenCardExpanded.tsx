'use client'

import { useState } from 'react'
import type { TokenWithHashtags } from '@/shared/types'
import { TokenIcon } from './TokenCard'
import { CustomTooltip } from './CustomTooltip'
import { Compass, Zap } from 'lucide-react'

const CopyButton = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`text-[12px] font-bold tracking-wider uppercase transition-colors cursor-pointer px-1.5 py-0.5 rounded ${copied ? 'text-[#00E5D2] bg-[#00E5D2]/10' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'}`}>
      [ {copied ? 'COPIED ✓' : 'COPY'} ]
    </button>
  );
};

function getExplorerLink(chain: string, address: string | null) {
  const explorers: Record<string, string> = {
    'Ethereum': 'etherscan.io',
    'BSC': 'bscscan.com',
    'Polygon': 'polygonscan.com',
    'Arbitrum': 'arbiscan.io',
    'Optimism': 'optimistic.etherscan.io',
    'Base': 'basescan.org',
    'Solana': 'solscan.io',
    'Avalanche': 'snowtrace.io',
  }
  const domain = explorers[chain] || 'etherscan.io'
  return {
    label: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A',
    rawAddress: address || '',
    url: address ? `https://${domain}/token/${address}` : '#'
  }
}

function getPairsList(exchangeLinks: string[]) {
  return exchangeLinks.map(str => {
    try {
      const [base, quote, url] = str.split('_');
      const name = `${base}/${quote}`;
      return { url, name }
    } catch {
      return { url: str, name: 'Exchange' }
    }
  })
}

export default function TokenCardExpanded({ token, themeColor, isExpired, isExpanded }: { token: TokenWithHashtags, themeColor: string, isExpired: boolean, isExpanded: boolean }) {
  const explorer = getExplorerLink(token.chain, token.contract_address);
  const symbol = token.symbol;
  const pairs = getPairsList(token.exchange_links);
  const socials = token.social_links;
  const keyStyle = { color: `${themeColor}99`, textShadow: `0 0 12px ${themeColor}1a` };

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out relative ${isExpanded ? 'max-h-[800px] opacity-100 py-3 pb-6 bg-transparent border-t border-dashed border-[#1E293B]/30' : 'max-h-0 opacity-0 overflow-hidden border-transparent'}`}
    >
      <div className="px-3 sm:px-5 pb-2">
        <div
          className="bg-[#0F1624] rounded-xl overflow-hidden font-mono shadow-2xl w-full relative"
          style={{
            boxShadow: `0 0 0 1px ${themeColor}10, 0 8px 32px -8px ${themeColor}20`
          }}
        >
          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          {/* Title bar */}
          <div className="py-2.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 gap-2 sm:gap-0 z-10 relative">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] text-white/50 uppercase bg-white/5 border border-white/5 rounded-full px-2 sm:px-3 py-1 text-center truncate">
                YOUNGWHALE TERMINAL
              </div>
              {!isExpired && (
                <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase shrink-0" style={{ color: themeColor }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                  LIVE
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 z-10 self-end sm:self-auto">
              <CustomTooltip content="Share to X" position="bottom" borderColor={themeColor}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${token.name} on The Next Wave!\n\n#${token.chain.replace(/\s+/g,'')} #${(token.main_hashtag || 'Crypto').replace(/\s+/g,'')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-white/50 group-hover:fill-white transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
              </CustomTooltip>

              <CustomTooltip content="Token creator or early backer? Promote this project in the homepage featured zone for 30 days." position="bottom-end" borderColor={themeColor}>
                <div
                  className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Promote sequence initiated. Gateway connection pending...');
                  }}
                >
                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </CustomTooltip>

              <div className="shrink-0 ml-2 sm:ml-3">
                <TokenIcon name={token.name} logoUrl={token.logo_url} chain={token.chain} size={64} />
              </div>
            </div>
          </div>

          {/* Token Header */}
          <div className="flex flex-col gap-3 p-4 sm:p-6 font-mono">
            <div className="text-[20px] sm:text-[22px] font-bold tracking-wide truncate flex items-center gap-2">
              <span className="text-[#E2E8F0]">{token.name}</span>
              <span style={{ color: themeColor }} className="text-[17px]">${symbol}</span>
              <span className="px-1.5 py-0.5 rounded uppercase text-[10px] sm:text-[11px] font-bold tracking-wider bg-white/10 text-white/70 ml-2">
                {token.chain}
              </span>
            </div>
            <div className="mt-2 text-left">
              <div className="text-[11px] tracking-widest uppercase flex items-center gap-2 mb-3 text-white/50 bg-white/5 inline-flex px-2 py-0.5 rounded">
                <Compass className="w-3.5 h-3.5" />
                WHALE INTELLIGENCE BRIEF
              </div>
              <div className="text-[14px] sm:text-[15px] text-white/90 tracking-wide leading-[1.7] text-justify">
                {token.full_description || token.short_description || 'No description available.'}
              </div>
            </div>
          </div>

          {/* Shell */}
          <div className="p-4 sm:p-6 pt-0 flex flex-col gap-2.5 font-mono">
            {/* Socials Section */}
            <div className="flex items-start px-1 leading-snug transition-colors group relative">
              <div className="flex shrink-0 min-w-[180px] w-40 mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                <div className="flex items-center">
                  <span>${symbol.toUpperCase()}</span>
                  <span>@</span>
                  <span className="tracking-wide font-bold">socials</span>
                  <span className="mr-1 font-bold">:</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                {token.website_url && (
                  <a href={token.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                    {token.website_url.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                    x.com/{socials.twitter.replace(/^https?:\/\/[^/]+\//, '').replace(/^@/, '')}
                  </a>
                )}
                {socials.telegram && (
                  <a href={socials.telegram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                    t.me/{socials.telegram.replace(/^https?:\/\/[^/]+\//, '').replace(/^@/, '')}
                  </a>
                )}
                {socials.discord && (
                  <a href={socials.discord} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                    discord
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                    facebook
                  </a>
                )}
              </div>
            </div>

            {/* Trade Row */}
            <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
              <div className="flex shrink-0 min-w-[180px] w-40 mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                <div className="flex items-center">
                  <span>${symbol.toUpperCase()}</span>
                  <span>@</span>
                  <span className="tracking-wide font-bold">trade</span>
                  <span className="mr-1 font-bold">:</span>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap gap-x-6 gap-y-1.5 text-white/90 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                {pairs.length > 0 ? pairs.map((pair, idx) => (
                  <a key={idx} href={pair.url} target="_blank" rel="noopener noreferrer" className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit" onClick={(e) => e.stopPropagation()}>
                    [{pair.name}]
                  </a>
                )) : (
                  <span className="text-white/40 font-mono text-[14px]">[NO PAIRS FOUND]</span>
                )}
              </div>
            </div>

            {/* Contract Row */}
            <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
              <div className="flex shrink-0 min-w-[180px] w-40 mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                <div className="flex items-center">
                  <span>${symbol.toUpperCase()}</span>
                  <span>@</span>
                  <span className="tracking-wide font-bold">contract</span>
                  <span className="mr-1 font-bold">:</span>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                <span className="text-[14px] font-mono text-white/90">
                  [ {explorer.label} ]
                </span>
                <CopyButton address={explorer.rawAddress} />
              </div>
            </div>

            {/* Supply Row */}
            <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
              <div className="flex shrink-0 min-w-[180px] w-40 mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                <div className="flex items-center">
                  <span>${symbol.toUpperCase()}</span>
                  <span>@</span>
                  <span className="tracking-wide font-bold">supply</span>
                  <span className="mr-1 font-bold">:</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                <span className="text-[14px] font-mono text-white/90">
                  {token.supply} {symbol.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Cursor */}
            <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2 font-mono">
              <div className="flex shrink-0 min-w-[180px] w-40 mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                <div className="flex items-center">
                  <span>${symbol.toUpperCase()}</span>
                  <span>@</span>
                  <span className="tracking-wide font-bold">Sonar Score</span>
                  <span className="mr-1 font-bold">:</span>
                </div>
              </div>
              <div className="flex-1 flex items-center mt-0.5 pl-[14px] border-l border-white/5 content-start">
                {isExpired ? (
                  <span className="text-[14px] font-mono tracking-wide text-slate-400 whitespace-nowrap">
                    [ SIGNAL EXPIRED ]
                  </span>
                ) : (
                    <span className="text-[14px] font-mono tracking-wide text-white/90">
                      {`${token.rating}/10`}
                    </span>
                  )}
                {!isExpired && <span className="inline-block w-[7px] h-[14px] align-[-2px] ml-1.5 animate-[pulse_1.5s_infinite]" style={{ backgroundColor: `${themeColor}99` }}></span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
