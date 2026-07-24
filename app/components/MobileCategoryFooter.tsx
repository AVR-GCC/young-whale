'use client'

import { categories } from '../lib/categories'

const categoryIconPaths: Record<string, string> = {
  Tech: '/category-icons/tech.svg',
  Meme: '/category-icons/meme.svg',
  RWA: '/category-icons/rwa.svg',
  Presale: '/category-icons/presale.svg',
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
              <div
                style={{
                  width: 30,
                  height: 30,
                  maskImage: `url(${categoryIconPaths[category.id]})`,
                  WebkitMaskImage: `url(${categoryIconPaths[category.id]})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  backgroundColor: isActive ? category.color : '#64748B',
                }}
              />
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
