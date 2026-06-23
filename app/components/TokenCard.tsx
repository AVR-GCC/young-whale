'use client'

import { useState, useCallback, useMemo } from 'react'

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000
import Image from 'next/image'
import type { TokenWithHashtags } from '@/shared/types'
import type { ReactNode } from 'react'
import { getCategoryColor } from '../lib/categories'

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy to clipboard')
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function SocialIcon({ type, url }: { type: string; url: string }) {
  const icons: Record<string, ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    telegram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    discord: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6521-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0551c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
    >
      {icons[type] || null}
    </a>
  )
}

function ExchangeIcon({ url }: { url: string }) {
  const domain = new URL(url).hostname.replace('www.', '')
  const name = domain.split('.')[0]
  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      {displayName}
    </a>
  )
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

  const socialEntries = Object.entries(token.social_links).filter(([, url]) => url)

  const isPromoted = false
  const [now] = useState(() => Date.now())
  const isExpired = useMemo(() => {
    const fiveDaysAgo = new Date(now - FIVE_DAYS_MS)
    return new Date(token.created_at) < fiveDaysAgo
  }, [token.created_at, now])
  const themeColor = getCategoryColor(token.category);

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
        <div className="flex-shrink-0 relative block">
          <TokenIcon name={token.name} logoUrl={token.logo_url} className="w-8 h-8 rounded-full border-2 border-white transition-transform hover:scale-105" />
        </div>

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

        {/* Time */}
        <div className="w-[42px] md:w-[48px] text-right font-mono text-[10px] uppercase tracking-wider flex-shrink-0 text-[#94A3B8]">
          <TimeSince date={token.created_at} />
        </div>
      </div>

      {/* Expanded content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4 space-y-4">
          {/* Long description */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {token.full_description}
          </p>

          {/* Contract address */}
          {token.contract_address && (
            <div className="flex items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 mr-2">Contract:</span>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-700 dark:text-zinc-300 truncate">
                {token.contract_address}
              </code>
              <CopyButton text={token.contract_address} />
            </div>
          )}

          {/* Hashtags */}
          {token.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {token.hashtags.map((hashtag) => (
                <span
                  key={hashtag.id}
                  className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  #{hashtag.name}
                </span>
              ))}
            </div>
          )}

          {/* Footer: Socials + Exchanges */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
            {/* Social links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Socials:</span>
              {socialEntries.map(([type, url]) => (
                <SocialIcon key={type} type={type} url={url!} />
              ))}
            </div>

            {/* Exchange links */}
            {token.exchange_links.length > 0 && (
              <div className="flex items-center gap-3 flex-nowrap">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Buy on:</span>
                {token.exchange_links.map((url, index) => (
                  <ExchangeIcon key={index} url={url} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
