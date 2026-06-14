'use client'

import type { Hashtag } from '@/shared/types'

interface MainHashtagSelectProps {
  availableHashtags: Hashtag[]
  currentMainHashtag: string | null
  onChange: (slug: string | null) => void
}

export default function MainHashtagSelect({
  availableHashtags,
  currentMainHashtag,
  onChange,
}: MainHashtagSelectProps) {
  const selectedId =
    availableHashtags.find((h) => h.slug === currentMainHashtag)?.id ??
    currentMainHashtag ??
    ''

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        Main Hashtag
      </label>
      <select
        value={selectedId}
        onChange={(e) => {
          const selected = availableHashtags.find((h) => h.id === e.target.value)
          if (selected?.slug) {
            onChange(selected.slug)
          } else {
            onChange(null)
          }
        }}
        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
      >
        <option value="">Select main hashtag...</option>
        {availableHashtags.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>
      {availableHashtags.length === 0 && (
        <p className="text-xs text-zinc-400 mt-1">
          Select or add hashtags above to set a main hashtag
        </p>
      )}
    </div>
  )
}
