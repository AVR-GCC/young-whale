'use client'

interface LinkInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
  placeholder?: string
  readOnly?: boolean
}

export default function LinkInput({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  readOnly = false,
}: LinkInputProps) {
  const handleOpen = () => {
    if (value) {
      window.open(value, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {suggestions && suggestions.length > 0 ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
          >
            <option value="">{placeholder || 'Select...'}</option>
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion}>
                {suggestion}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
          />
        )}
        <button
          onClick={handleOpen}
          disabled={!value}
          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Open
        </button>
      </div>
    </div>
  )
}
