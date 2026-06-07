import AdminActions from './components/AdminActions'
import AIConfigSection from './components/AIConfigSection'

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
      </main>
    </div>
  )
}
