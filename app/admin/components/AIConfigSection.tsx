'use client'

import { useState, useEffect } from 'react'

interface AIConfig {
  ai_model?: string
  available_models?: string[]
  ai_prompt_system?: string
  ai_prompt_category?: string
  ai_prompt_main_hashtag?: string
  ai_prompt_short_description?: string
  ai_prompt_full_description?: string
  ai_prompt_confidence?: string
}

export default function AIConfigSection() {
  const [aiOpen, setAiOpen] = useState(false)
  const [aiExpanding, setAiExpanding] = useState(false)
  const [aiConfig, setAiConfig] = useState<AIConfig>({})
  const [aiUpdateLoading, setAiUpdateLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<string>('')
  const [systemFocused, setSystemFocused] = useState(false)
  const [shortDescFocused, setShortDescFocused] = useState(false)
  const [fullDescFocused, setFullDescFocused] = useState(false)

  useEffect(() => {
    if (!aiExpanding) return

    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/admin/ai-config')
        const data = await res.json()
        if (cancelled) return
        if (res.ok) {
          setAiConfig(data)
          setAiOpen(true)
        } else {
          setAiStatus(`Error loading AI config: ${data.error || 'Unknown error'}`)
        }
      } catch (err) {
        if (!cancelled) {
          setAiStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      } finally {
        if (!cancelled) {
          setAiExpanding(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [aiExpanding])

  const updateAIConfig = async () => {
    setAiUpdateLoading(true)
    setAiStatus('')
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiConfig),
      })
      const data = await res.json()
      if (res.ok) {
        setAiStatus('AI configuration updated successfully')
      } else {
        setAiStatus(`Error updating AI config: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setAiStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setAiUpdateLoading(false)
    }
  }

  const availableModels = Array.isArray(aiConfig.available_models) ? aiConfig.available_models : []

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => {
          if (aiOpen) {
            setAiOpen(false)
          } else {
            setAiExpanding(true)
          }
        }}
        className="w-full px-6 py-4 flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <span className="text-lg font-semibold text-black dark:text-zinc-50">AI Configuration</span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {aiExpanding ? (
            <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : aiOpen ? (
            '▲'
          ) : (
            '▼'
          )}
        </span>
      </button>

      {aiOpen && (
        <div className="p-6 bg-white dark:bg-black space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              AI Model
            </label>
            <select
              value={aiConfig.ai_model || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_model: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
            >
              <option value="">Select a model...</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              System Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_system || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_system: e.target.value })}
              onFocus={() => setSystemFocused(true)}
              onBlur={() => setSystemFocused(false)}
              rows={systemFocused ? 15 : 3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              Category Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_category || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_category: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              Main Hashtag Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_main_hashtag || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_main_hashtag: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              Short Description Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_short_description || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_short_description: e.target.value })}
              onFocus={() => setShortDescFocused(true)}
              onBlur={() => setShortDescFocused(false)}
              rows={shortDescFocused ? 15 : 3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              Full Description Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_full_description || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_full_description: e.target.value })}
              onFocus={() => setFullDescFocused(true)}
              onBlur={() => setFullDescFocused(false)}
              rows={fullDescFocused ? 15 : 3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-zinc-50">
              Confidence Prompt
            </label>
            <textarea
              value={aiConfig.ai_prompt_confidence || ''}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_confidence: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={updateAIConfig}
              disabled={aiUpdateLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiUpdateLoading ? 'Updating...' : 'Update AI Config'}
            </button>
            {aiStatus && (
              <p className={`text-sm ${aiStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                {aiStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
