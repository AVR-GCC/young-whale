import { Suspense } from 'react'
import AdminActions from './components/AdminActions'
import AIConfigSection from './components/AIConfigSection'
import TokensSection from './components/TokensSection'

export default function Admin() {
  return (
    <div className="flex flex-col flex-1 w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col py-8 px-16 bg-white dark:bg-black gap-8">
        <div className="flex items-start justify-between w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Young Whale admin
          </h1>

          <AdminActions />
        </div>

        <AIConfigSection />
        <Suspense fallback={
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-4" />
            <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        }>
          <TokensSection />
        </Suspense>
      </main>
    </div>
  )
}
