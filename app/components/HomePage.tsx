import HeaderBanner from './HeaderBanner'
import CategoryContainer from './CategoryContainer'
import { categories } from '../lib/categories'
import { getTokensByCategory, getCategoryCount } from '../lib/data'
import type { TokenWithHashtags } from '@/shared/types'

interface HomePageProps {
  tokens: TokenWithHashtags[]
}

export default function HomePage({ tokens }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <HeaderBanner />

      <main className="flex-1 w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and subtitle */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            New Token Listings
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Explore latest cryptocurrency tokens across Tech, Meme, Real world assets and Presale
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryContainer
              key={category.id}
              category={category}
              tokenCount={getCategoryCount(tokens, category.id)}
              tokens={getTokensByCategory(tokens, category.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
