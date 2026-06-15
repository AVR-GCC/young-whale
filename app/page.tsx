import HeaderBanner from './components/HeaderBanner'
import CategoryContainer from './components/CategoryContainer'
import { categories } from './lib/categories'
import { getAllApprovedTokens, getTokensByCategory, getCategoryCount } from './lib/data'

export default async function Home() {
  const tokens = await getAllApprovedTokens()

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <HeaderBanner />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              category={category.id}
              title={category.name}
              tokenCount={getCategoryCount(tokens, category.id)}
              tokens={getTokensByCategory(tokens, category.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
