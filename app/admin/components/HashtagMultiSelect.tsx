'use client'

import type { Hashtag } from '@/shared/types'

interface HashtagMultiSelectProps {
  allHashtags: Hashtag[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export default function HashtagMultiSelect({
  allHashtags,
  selectedIds,
  onToggle,
}: HashtagMultiSelectProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        Hashtags
      </label>
      <div className="border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 p-2 max-h-40 overflow-y-auto">
        {allHashtags.length === 0 ? (
          <p className="text-sm text-zinc-400">Loading hashtags...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allHashtags.map((h) => (
              <button
                key={h.id}
                onClick={() => onToggle(h.id)}
                className={`inline-flex items-center px-2 py-1 rounded text-xs transition-colors ${
                  selectedIds.includes(h.id)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 ring-1 ring-blue-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {h.name}
                {selectedIds.includes(h.id) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedIds.length > 0 && (
        <p className="text-xs text-zinc-400 mt-1">
          {selectedIds.length} selected
        </p>
      )}
    </div>
  )
}
