'use client'

import { useState } from 'react'
import CategoryContainer from './CategoryContainer'
import { categories } from '../lib/categories'
import type { TokenWithHashtags } from '@/shared/types'

// Placeholder icon components for mobile footer
const TechIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const MemeIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
)

const RWAIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const PresaleIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const categoryIcons: Record<string, React.FC<{ color: string }>> = {
  Tech: TechIcon,
  Meme: MemeIcon,
  RWA: RWAIcon,
  Presale: PresaleIcon,
}

const categoryLabels: Record<string, string> = {
  Tech: 'TECH\nPROJECTS',
  Meme: 'MEME\nCOINS',
  RWA: 'RWA\nTOKENS',
  Presale: 'PRESALE\n& AIRDROP',
}

export default function MobileCategoryFooter({ selectedCategory, selectCategory }: { selectedCategory: string, selectCategory: (category: string) => void }) {
  return (
    <div className="flex-shrink-0 bg-[#0B0F19] border-t border-[#1E293B]/60 px-2 py-2">
      <div className="flex items-center justify-around">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id]
          const isActive = selectedCategory === category.id
          const labelLines = categoryLabels[category.id].split('\n')

          return (
            <button
              key={category.id}
              onClick={() => selectCategory(category.id)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors"
              style={{
                color: isActive ? category.color : '#64748B',
              }}
            >
              <Icon color={isActive ? category.color : '#64748B'} />
              <div className="flex flex-col items-center leading-tight">
                {labelLines.map((line, i) => (
                  <span key={i} className="text-[9px] font-bold tracking-wider whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
