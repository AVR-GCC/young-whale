'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { TokenWithHashtags } from '@/shared/types'
import { getCategoryColor } from '../lib/categories'
import { CustomTooltip } from './CustomTooltip';
import { Compass, Zap } from 'lucide-react';

const ONE_DAY = 24 * 60 * 60 * 1000

/*
 * exchange currencies
 * real supply
 * */
function TimeSince({ date }: { date: string }) {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  let value: number
  let unit: string

  if (seconds < 60) {
    value = seconds
    unit = 's'
  } else if (seconds < 3600) {
    value = Math.floor(seconds / 60)
    unit = 'm'
  } else if (seconds < 86400) {
    value = Math.floor(seconds / 3600)
    unit = 'h'
  } else {
    value = Math.floor(seconds / 86400)
    unit = 'd'
  }

  return <span>{value}{unit}</span>
}

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


// function SocialIcon({ type, url }: { type: string; url: string }) {
//   const icons: Record<string, ReactNode> = {
//     twitter: (
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//       </svg>
//     ),
//     telegram: (
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
//       </svg>
//     ),
//     discord: (
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6521-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0551c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
//       </svg>
//     ),
//     facebook: (
//       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//       </svg>
//     ),
//   }
//
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
//     >
//       {icons[type] || null}
//     </a>
//   )
// }

// function ExchangeIcon({ url }: { url: string }) {
//   const domain = new URL(url).hostname.replace('www.', '')
//   const name = domain.split('.')[0]
//   const displayName = name.charAt(0).toUpperCase() + name.slice(1)
//
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
//     >
//       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//       </svg>
//       {displayName}
//     </a>
//   )
// }

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

function TokenIcon({ name, logoUrl, className = "w-10 h-10" }: { name: string; logoUrl: string | null; className?: string }) {
  const [imageError, setImageError] = useState(false)

  if (logoUrl && !imageError) {
    return (
      <Image
        src={logoUrl}
        alt={`${name} icon`}
        width={40}
        height={40}
        className={`${className} rounded-full object-cover flex-shrink-0`}
        onError={() => setImageError(true)}
        unoptimized
      />
    )
  }

  return (
    <div className={`${className} rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0`}>
      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
        {name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export default function TokenCard({ token }: { token: TokenWithHashtags }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // const expand = useCallback(() => {
  //   setIsExpanded(true);
  // }, []);
  //
  // const collapse = useCallback(() => {
  //   setIsExpanded(false);
  // }, []);

  // const socialEntries = Object.entries(token.social_links).filter(([, url]) => url)

  const isPromoted = false
  const [now] = useState(() => Date.now())
  const isExpired = useMemo(() => {
    const oneDayAgo = new Date(now - ONE_DAY)
    return new Date(token.created_at) < oneDayAgo
  }, [token.created_at, now])

  const isBeforeYesterday = useMemo(() => {
    const twoDaysAgo = new Date(now - (ONE_DAY * 2))
    return new Date(token.created_at) < twoDaysAgo;
  }, [token.created_at, now])

  const themeColor = getCategoryColor(token.category);
  let timeLabel = <TimeSince date={token.created_at} />;
  if (isPromoted) {
    timeLabel = <>FEATURED</>;
  }
  if (!isBeforeYesterday) {
    timeLabel = <>1D AGO</>;
  }
  if (!isExpired) {
    timeLabel = <>TODAY</>;
  }

  return (
    <div
      className={`
        relative border-b border-zinc-200 dark:border-zinc-700 last:border-b-0
        transition-all duration-300 ease-in-out cursor-pointer
        ${isExpanded ? 'bg-zinc-50 dark:bg-zinc-800/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
      `}
      style={{
        borderColor: (isExpanded || isHovered) ? `${themeColor}20` : undefined,
        boxShadow: (isExpanded || isHovered) ? `0 0 15px ${themeColor}10` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggle}
    >
      {/* 2px Left vertical laser locked-on guides (on hover) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundColor: themeColor
        }}
      />
      {/* Collapsed / Header row */}
      <div
        className="flex items-center h-[46px] w-full px-3 md:px-4 py-1.5 gap-3 overflow-hidden"
      >
        {/* Token Logo */}
        <CustomTooltip content={`${token.name} launched on ${token.chain} Network`} position="right" borderColor={themeColor}>
          <div className="flex-shrink-0 relative block">
            <TokenIcon name={token.name} logoUrl={token.logo_url} className="w-8 h-8 rounded-full border-2 border-white transition-transform hover:scale-105" />
          </div>
        </CustomTooltip>

        {/* Token Name */}
        <span className="font-outfit text-[13px] font-semibold tracking-wide text-[#E2E8F0] w-[66px] md:w-[86px] flex-shrink-0 text-left truncate">
          {token.name}
        </span>

        {/* Description */}
        <div
          className="flex-grow min-w-0 overflow-hidden text-[11px] text-[#CBD5E1] font-normal whitespace-nowrap text-left ml-1.5 md:ml-2 mr-1 md:mr-2"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)'
          }}
        >
          {token.short_description}
        </div>

        {/* Hashtag */}
        <div className="hidden sm:block flex-shrink-0 mr-1 sm:mr-2">
          {token.hashtags.slice(0, 1).map((hashtag) => (
            <button
              key={hashtag.id}
              type="button"
              className="text-[9px] font-mono font-semibold tracking-wider uppercase text-[#94A3B8] bg-[#2A3441] rounded-[4px] px-1.5 py-0.5 truncate transition-colors focus:outline-none"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
                e.currentTarget.style.color = '#0B0F19';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2A3441';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              #{hashtag.name}
            </button>
          ))}
        </div>

        {/* Rating */}
        <CustomTooltip content={isPromoted ? 'Sponsored Ping.' : (isExpired ? 'Expired score. Sonar ping timed out.' : <div className="text-center">Live Sonar Score.<br/>Valid for 24 hours only.</div>)} position="left" borderColor={themeColor}>
          <div className="flex-shrink-0 flex items-center justify-center w-7 mr-1 sm:mr-2 ml-0 sm:ml-1 h-7">
            {isExpired ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white/40 transition-colors"
              >
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                <path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414 4.414a2 2 0 0 1 .586 1.414V22H7z" fill="currentColor" stroke="none" />
              </svg>
            ) : (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-950/50 font-oxanium text-[14px] font-extrabold select-none border-2 border-solid transition-all duration-300 ${isHovered && !isPromoted ? 'scale-105' : ''}`}
                  style={{
                    borderColor: isPromoted ? 'rgba(255, 255, 255, 0.2)' : (isExpired ? '#FFD700' : '#FFFFFF'),
                    color: isPromoted ? 'rgba(255, 255, 255, 0.3)' : (isExpired ? '#FFD700' : '#FFFFFF'),
                    boxShadow: (!isPromoted && token.rating && token.rating >= 9) ? `0 0 12px ${themeColor}40` : (isHovered && !isPromoted ? `0 0 10px ${themeColor}60` : 'none'),
                  }}
                >
                  {isPromoted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M12 2v10" />
                      <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9z" />
                    </svg>
                  ) : (isExpired ? '★' : token.rating)}
                </div>
              )}
          </div>
        </CustomTooltip>

        {/* Time */}
        <div
          className="w-[42px] md:w-[48px] text-right font-mono text-[10px] uppercase tracking-wider flex-shrink-0"
          style={{
            color: (!isPromoted && !isExpired) ? themeColor : '#94A3B8'
          }}
        >
          {timeLabel}
        </div>
      </div>

      {/* Expanded content */}
      <div
        className={`w-full transition-all duration-300 ease-in-out relative ${isExpanded ? 'max-h-[800px] opacity-100 py-3 pb-6 bg-transparent border-t border-dashed border-[#1E293B]/30' : 'max-h-0 opacity-0 overflow-hidden border-transparent'}`}
      >
        <div className="px-3 sm:px-5 pb-2">
          {(() => {
            const explorer = getExplorerLink(token.chain, token.contract_address);
            const symbol = token.symbol;
            const pairs = getPairsList(token.exchange_links);
            const socials = token.social_links;

            return (
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

                    <div className="relative block shrink-0 ml-2 sm:ml-3">
                      <TokenIcon name={token.name} logoUrl={token.logo_url} className="w-16 h-16 rounded-full border-[3px] border-white z-10 box-border bg-black" />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-6 h-6 flex items-center justify-center rounded bg-[#0F1624] border-[1.5px] border-white text-slate-400 p-0.5 shadow-md z-15 pointer-events-none">
                        <span className="text-[8px] font-bold uppercase">{token.chain.slice(0, 3)}</span>
                      </div>
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
                  {(() => {
                    const keyStyle = { color: `${themeColor}99`, textShadow: `0 0 12px ${themeColor}1a` };
                    return (
                      <>
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
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  )
}
