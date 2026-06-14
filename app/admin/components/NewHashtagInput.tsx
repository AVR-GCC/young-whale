'use client'

import { useState } from 'react'

interface NewHashtagInputProps {
  newHashtags: string[]
  onAdd: (name: string) => void
  onRemove: (name: string) => void
}

export default function NewHashtagInput({
  newHashtags,
  onAdd,
  onRemove,
}: NewHashtagInputProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        Add New Hashtags
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Type hashtag and press Enter"
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-2 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {newHashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {newHashtags.map((name) => (
            <span
              key={name}
              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded text-xs"
            >
              {name}
              <button
                onClick={() => onRemove(name)}
                className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
