'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import type { TokenWithHashtags } from '@/shared/types'
import type { ReactNode } from 'react'

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

function TokenIcon({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [imageError, setImageError] = useState(false)

  if (logoUrl && !imageError) {
    return (
      <Image
        src={logoUrl}
        alt={`${name} icon`}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        onError={() => setImageError(true)}
        unoptimized
      />
    )
  }

  return (
    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
        {name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export default function TokenCard({ token }: { token: TokenWithHashtags }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const socialEntries = Object.entries(token.social_links).filter(([, url]) => url)

  return (
    <div
      className={`
        border-b border-zinc-200 dark:border-zinc-700 last:border-b-0
        transition-all duration-300 ease-in-out cursor-pointer
        ${isExpanded ? 'bg-zinc-50 dark:bg-zinc-800/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
      `}
      onMouseEnter={expand}
      onMouseLeave={collapse}
      onClick={toggle}
    >
      {/* Collapsed / Header row */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0">
          <TokenIcon name={token.name} logoUrl={token.logo_url} />
          <div className="min-w-0">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {token.name}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {token.short_description}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 text-sm text-zinc-400 dark:text-zinc-500">
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
