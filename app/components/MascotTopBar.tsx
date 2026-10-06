'use client'

import { useState } from 'react'
import { ArrowUpRight, Copy } from 'lucide-react'

export const MASCOT_CONTRACT_ADDRESS = '0x7f3a9c2e4b8d1f6a5c0e3b7d9f2a4c6e8b1d3f5a'
const TRUNCATED_ADDRESS = `${MASCOT_CONTRACT_ADDRESS.slice(0, 6)}...${MASCOT_CONTRACT_ADDRESS.slice(-4)}`

export default function MascotTopBar() {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(MASCOT_CONTRACT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="w-full bg-[#22D3EE] text-black font-oxanium">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold tracking-wide whitespace-nowrap overflow-hidden">
        <span className="hidden sm:inline-flex items-center bg-black text-[#22D3EE] rounded-md px-3 py-1 uppercase tracking-widest">
          Official Contract Address
        </span>
        <span className="truncate">The YoungWhale mascot</span>
        <span className="hidden sm:inline-flex truncate ml-[-7px]">lives on Robinhood:</span>
        <a
          href={`https://robinhoodchain.blockscout.com/token/${MASCOT_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-black text-[#22D3EE] rounded-md px-3 py-1 hover:bg-[#0A0F1D] transition-colors"
        >
          {TRUNCATED_ADDRESS}
          <ArrowUpRight className="w-3 h-3" />
        </a>
        <button
          type="button"
          onClick={copyAddress}
          aria-label="Copy contract address"
          className="inline-flex items-center gap-1.5 bg-black text-[#22D3EE] rounded-md px-3 py-1 uppercase hover:bg-[#0A0F1D] transition-colors cursor-pointer"
        >
          <Copy className="w-3 h-3" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
