'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

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

export default function Admin() {
  const [resetStatus, setResetStatus] = useState<string>('')
  const [processStatus, setProcessStatus] = useState<string>('')
  const [resetLoading, setResetLoading] = useState(false)
  const [processLoading, setProcessLoading] = useState(false)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [aiOpen, setAiOpen] = useState(false)
  const [aiExpanding, setAiExpanding] = useState(false)
  const [aiConfig, setAiConfig] = useState<AIConfig>({})
  const [aiUpdateLoading, setAiUpdateLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<string>('')

  const clearPollInterval = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearPollInterval
  }, [clearPollInterval])

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

  const updateAIConfig = useCallback(async () => {
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
  }, [aiConfig])

  const runReset = useCallback(async () => {
    setResetLoading(true)
    setResetStatus('')
    try {
      const res = await fetch('/api/admin/reset')
      const data = await res.json()
      if (res.ok) {
        setResetStatus(`Success: ${data.message}`)
      } else {
        setResetStatus(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setResetStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setResetLoading(false)
    }
  }, [])

  const pollStatus = useCallback((runId: string) => {
    clearPollInterval()

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/cron/process/status?runId=${runId}`)
        const data = await res.json()

        if (!res.ok) {
          setProcessStatus(`Error checking status: ${data.error || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
          return
        }

        if (data.status === 'completed') {
          setProcessStatus(`Completed! Processed: ${data.processed}, Failed: ${data.failed}`)
          setProcessLoading(false)
          clearPollInterval()
        } else if (data.status === 'failed') {
          setProcessStatus(`Failed: ${data.errorMessage || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
        } else {
          setProcessStatus('Processing...')
        }
      } catch (err) {
        setProcessStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setProcessLoading(false)
        clearPollInterval()
      }
    }, 2000)
  }, [clearPollInterval])

  const runProcess = useCallback(async () => {
    setProcessLoading(true)
    setProcessStatus('Starting...')
    try {
      const res = await fetch('/api/cron/process')
      const data = await res.json()

      if (!res.ok) {
        setProcessStatus(`Error: ${data.error || 'Unknown error'}`)
        setProcessLoading(false)
        return
      }

      if (data.runId) {
        pollStatus(data.runId)
      } else {
        setProcessStatus('Started but no run ID received')
        setProcessLoading(false)
      }
    } catch (err) {
      setProcessStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setProcessLoading(false)
    }
  }, [pollStatus])

  const availableModels = Array.isArray(aiConfig.available_models) ? aiConfig.available_models : []

  return (
    <div className="flex flex-col flex-1 w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col py-8 px-16 bg-white dark:bg-black gap-8">
        <div className="flex items-start justify-between w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Young Whale admin
          </h1>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 w-80">
              <button
                onClick={runReset}
                disabled={resetLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
              >
                {resetLoading ? 'Running Reset...' : 'Run Reset'}
              </button>
              {resetStatus && (
                <p className={`text-sm text-center ${resetStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {resetStatus}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 w-80">
              <button
                onClick={runProcess}
                disabled={processLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
              >
                {processLoading ? 'Running Process...' : 'Run Process'}
              </button>
              {processStatus && (
                <p className={`text-sm text-center ${processStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {processStatus}
                </p>
              )}
            </div>
          </div>
        </div>

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
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
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
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black dark:text-zinc-50">
                      Full Description Prompt
                    </label>
                    <textarea
                      value={aiConfig.ai_prompt_full_description || ''}
                      onChange={(e) => setAiConfig({ ...aiConfig, ai_prompt_full_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
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
      </main>
    </div>
  )
}
