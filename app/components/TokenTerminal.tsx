'use client'

import { useState } from 'react'
import type { TokenWithHashtags } from '@/shared/types'
import { TokenIcon } from './TokenCard'
import { CustomTooltip } from './CustomTooltip'
import { Compass, X, Share2 } from 'lucide-react'
import RatingBadge from './RatingBadge'
import { YMYLTrustSignals } from './YMYLTrustSignals'

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

export function getExchangeName(url: string) {
  const match = url.match(/^(?:https?:\/\/)?(?:[^/?#]+\.)*([a-z0-9-]+)\.[a-z]{2,}(?:[/?#]|$)/i)
  return match ? match[1].toUpperCase() : url
}

function LineLabel({ field, themeColor }: { field: string, themeColor: string }) {
  const keyStyle = { color: `${themeColor}99`, textShadow: `0 0 12px ${themeColor}1a` };
  return (
    <div className="flex shrink-0 sm:min-w-[198px] sm:w-40 sm:mr-1 mb-1 sm:mb-0 pt-0.5 text-[14px] font-medium text-left max-sm:!text-[rgb(139,148,158)]" style={keyStyle}>
      <div className="flex items-center">
        {/* <span>${symbol.toUpperCase()}</span> */}
        {/* <span>@</span> */}
        <span className="tracking-wide font-bold">{field}</span>
        <span className="mr-1 font-bold">:</span>
      </div>
    </div>
  )
}

export default function TokenTerminal({
  token,
  themeColor,
  isExpired,
  isExpanded,
  chainIcons,
  chainExplorers,
  closeTerminalAction
}: {
  token: TokenWithHashtags,
  themeColor: string,
  isExpired: boolean,
  isExpanded: boolean,
  chainIcons: Record<string, string>,
  chainExplorers: Record<string, string>,
  closeTerminalAction?: () => void
}) {
  const isPresale = token.category === 'Presale';
  const symbol = token.symbol;
  const socials = token.social_links;

  const labelAndLiveIndicator = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] text-white/50 uppercase bg-white/5 border border-white/5 rounded-full px-2 sm:px-3 py-1 text-center truncate">
        YOUNGWHALE TERMINAL
      </div>
      {!isExpired && !isPresale && (
        <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase shrink-0" style={{ color: themeColor }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
          LIVE
        </div>
      )}
    </div>
  );

  const buttons = (
    <>
      {/* Share */}
      <CustomTooltip content="Share to X" position="bottom" borderColor={themeColor}>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${token.name} on The Next Wave!\n\n#${token.chain.replace(/\s+/g,'')} #${(token.main_hashtag || 'Crypto').replace(/\s+/g,'')}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Xwitter icon */}
          {/* <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-white/50 group-hover:fill-white transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> */}
          <Share2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </a>
      </CustomTooltip>

      {/* Promote */}
      {/* <CustomTooltip content="Token creator or early backer? Promote this project in the homepage featured zone for 30 days." position="bottom-end" borderColor={themeColor}> */}
      {/*   <div */}
      {/*     className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10" */}
      {/*     onClick={(e) => { */}
      {/*       e.stopPropagation(); */}
      {/*       alert('Promote sequence initiated. Gateway connection pending...'); */}
      {/*     }} */}
      {/*   > */}
      {/*     <Zap className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" /> */}
      {/*   </div> */}
      {/* </CustomTooltip> */}

      {/* Close */}
      {!!closeTerminalAction && (
        <div
          className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            closeTerminalAction();
          }}
        >
          <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      )}
    </>
  );

  const linkAProps = {
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation(),
    className: "text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit"
  }

  const displayContractAddress = token.contract_address ? `${token.contract_address.slice(0, 6)}...${token.contract_address.slice(-4)}` : null

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out relative max-sm:h-full ${isExpanded ? 'max-h-[800px] opacity-100 py-0 sm:py-3 pb-0 sm:pb-6 bg-transparent border-transparent sm:border-t sm:border-dashed sm:border-[#1E293B]/30' : 'max-h-0 opacity-0 overflow-hidden border-transparent'}`}
    >
      <div className="px-0 sm:px-5 pb-0 sm:pb-2 max-sm:h-full">
        <div
          className="bg-[#0F1624] max-sm:bg-black rounded-none sm:rounded-xl sm:overflow-hidden font-mono w-full relative max-sm:flex max-sm:flex-col max-sm:h-full"
          style={{ boxShadow: `0 0 0 1px ${themeColor}10, 0 8px 32px -8px ${themeColor}20` }}
        >
          {/* Title bar */}
          <div className="py-2.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 gap-2 sm:gap-0 z-10 relative max-sm:shrink-0">
            <div className="hidden sm:block">
              {labelAndLiveIndicator}
            </div>

            {/* Mobile layout */}
            <div className="flex sm:hidden items-center justify-between w-full">
              <TokenIcon name={token.name} logoUrl={token.logo_url} chain={token.chain} size={80} chainIcons={chainIcons} />
              <div className="flex flex-col flex-1 items-center">
                <span
                  className="text-white text-[26px] sm:text-[102px] font-bold tracking-tight leading-none"
                >
                  ${token.symbol}
                </span>
                <div className="h-1" />
                <span className="font-mono text-[13px] sm:text-[11px] font-bold tracking-widest text-[#E2E8F0]/70 uppercase">
                  #{token.main_hashtag || 'DEFI'}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0 z-10">
                <div className="flex items-center gap-2">
                  {buttons}
                </div>
                <div className="h-1" />
                <RatingBadge
                  isPresale={isPresale}
                  isPromoted={token.is_promoted}
                  isExpired={isExpired}
                  isHovered={false}
                  rating={token.rating}
                  themeColor={themeColor}
                />
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 z-10 self-end sm:self-auto">
              {buttons}
              <div className="shrink-0 ml-2 sm:ml-3">
                <TokenIcon name={token.name} logoUrl={token.logo_url} chain={token.chain} size={64} chainIcons={chainIcons} />
              </div>
            </div>
          </div>

          <div className="max-sm:overflow-x-clip max-sm:overflow-y-auto max-sm:flex-1 max-sm:flex max-sm:flex-col">
            {/* Token Header */}
            <div className="flex flex-col gap-3 p-4 pt-0 sm:p-6 font-mono">
              <div className="flex-wrap text-[20px] sm:text-[22px] font-bold tracking-wide truncate flex items-center gap-2">
                <span className="text-[#E2E8F0] hidden sm:inline">{token.name}</span>
                <span style={{ color: themeColor }} className="text-[17px] hidden sm:inline">${symbol}</span>
                <span className="px-1.5 py-0.5 rounded uppercase text-[10px] sm:text-[11px] font-bold tracking-wider bg-white/10 text-white/70 ml-2 hidden sm:inline-block">
                  {token.chain}
                </span>
              </div>
              <div className="mt-2 text-left">
                <div className="text-[13px] sm:text-[11px] tracking-widest uppercase flex items-center gap-2 mb-3 text-white/50 bg-white/5 inline-flex px-2 py-0.5 rounded">
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
              {(token.website_url || socials.twitter || socials.telegram || socials.discord || socials.facebook) && (
                <div className="flex flex-col sm:flex-row items-start px-1 leading-snug transition-colors group relative">
                  <LineLabel
                    field="socials"
                    themeColor={themeColor}
                  />

                  <div className="flex-1 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1.5 mt-0.5 pl-0 sm:pl-[14px] border-0 sm:border-l sm:border-white/5 content-start max-sm:text-[rgb(229,231,235)]">
                    {token.website_url && (
                      <a href={token.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                        {token.website_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '')}
                      </a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} { ...linkAProps }>
                        X
                      </a>
                    )}
                    {socials.telegram && (
                      <a href={socials.telegram} { ...linkAProps }>
                        TELEGRAM
                      </a>
                    )}
                    {socials.discord && (
                      <a href={socials.discord} { ...linkAProps }>
                        DISCORD
                      </a>
                    )}
                    {socials.facebook && (
                      <a href={socials.facebook} { ...linkAProps }>
                        FACEBOOK
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Trade Row */}
              {!!token.preferred_exchange && (
                <div className="flex flex-col sm:flex-row items-start px-1 leading-snug transition-colors group relative mt-2">
                  <LineLabel
                    // symbol={symbol}
                    field={isPresale ? 'participate' : 'trade'}
                    themeColor={themeColor}
                  />
                  <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-0.5 pl-0 sm:pl-[14px] border-0 sm:border-l sm:border-white/5 content-start max-sm:text-[rgb(229,231,235)]">
                    <a href={token.preferred_exchange} { ...linkAProps }>
                      {getExchangeName(token.preferred_exchange)}
                    </a>
                  </div>
                </div>
              )}

              {/* Contract Row */}
              {!!token.contract_address && (
                <div className="flex flex-col sm:flex-row items-start px-1 leading-snug transition-colors group relative mt-2">
                  <LineLabel
                    field="contract"
                    themeColor={themeColor}
                  />
                  <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-0.5 pl-0 sm:pl-[14px] border-0 sm:border-l sm:border-white/5 content-start max-sm:text-[rgb(229,231,235)]">
                    {!!chainExplorers[token.chain] ? (
                      <a href={`${chainExplorers[token.chain]}${token.contract_address}`} { ...linkAProps }>
                        {displayContractAddress}
                      </a>
                    ) : (
                      <span className="text-[14px] font-mono text-white/90">
                        {displayContractAddress}
                      </span>
                    )}
                    <CopyButton address={token.contract_address} />
                  </div>
                </div>
              )}

              {/* Supply Row */}
              {token.supply && (
                <div className="flex flex-col sm:flex-row items-start px-1 leading-snug transition-colors group relative mt-2">
                  <LineLabel
                    field="supply"
                    themeColor={themeColor}
                  />
                  <div className="flex-1 flex items-center gap-x-6 gap-y-1.5 mt-0.5 pl-0 sm:pl-[14px] border-0 sm:border-l sm:border-white/5 content-start max-sm:text-[rgb(229,231,235)]">
                    <span className="text-[14px] font-mono text-white/90">
                      {token.supply} {symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Cursor */}
              <div className="flex items-start px-1 leading-snug transition-colors relative mt-2 font-mono">
                <LineLabel
                  field="Sonar Score"
                  themeColor={themeColor}
                />

                <div className="flex-1 flex items-center mt-0.5 pl-[7px] border-0 sm:border-l sm:border-white/5 content-start max-sm:text-[rgb(229,231,235)]">
                  {isExpired ? (
                    <span className="text-[14px] ml-2 font-mono tracking-wide text-slate-400 whitespace-nowrap">
                      SIGNAL EXPIRED
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
            {/* Trust signal */}
            <div className="sm:hidden max-sm:mt-auto">
              <YMYLTrustSignals updatedEntity="token" lastPublishedAt={token.published_at ? new Date(token.published_at) : null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
