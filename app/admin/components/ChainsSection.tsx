'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Chain {
  id: string
  name: string
  icon: string | null
  explorer_prefix: string | null
}

export default function ChainsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chains, setChains] = useState<Chain[]>([])
  const [error, setError] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [newChain, setNewChain] = useState<Partial<Chain>>({ id: '', name: '', icon: '', explorer_prefix: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const { data, error } = await supabase
          .from('chains')
          .select('*')
          .order('name')

        if (cancelled) return

        if (error) {
          setError(error.message)
        } else {
          setChains(data ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch chains')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isOpen])

  const updateChain = async (chain: Chain) => {
    setStatus('')
    try {
      const { error } = await supabase
        .from('chains')
        .update({
          name: chain.name,
          icon: chain.icon,
          explorer_prefix: chain.explorer_prefix,
        })
        .eq('id', chain.id)

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Chain updated successfully')
        setChains((prev) =>
          prev.map((c) => (c.id === chain.id ? chain : c))
        )
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const addChain = async () => {
    if (!newChain.id || !newChain.name) {
      setStatus('ID and Name are required')
      return
    }

    setStatus('')
    try {
      const { error } = await supabase
        .from('chains')
        .insert({
          id: newChain.id,
          name: newChain.name,
          icon: newChain.icon || null,
          explorer_prefix: newChain.explorer_prefix || null,
        })

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Chain added successfully')
        setChains((prev) => [
          ...prev,
          {
            id: newChain.id!,
            name: newChain.name!,
            icon: newChain.icon || null,
            explorer_prefix: newChain.explorer_prefix || null,
          },
        ])
        setNewChain({ id: '', name: '', icon: '', explorer_prefix: '' })
        setShowAddForm(false)
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const deleteChain = async (id: string) => {
    if (!confirm(`Are you sure you want to delete chain "${id}"?`)) return

    setStatus('')
    try {
      const { error } = await supabase
        .from('chains')
        .delete()
        .eq('id', id)

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Chain deleted successfully')
        setChains((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            setIsOpen(true)
          }
        }}
        className="w-full px-6 py-4 flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-black dark:text-zinc-50">
            Chains
          </span>
          {chains.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium">
              {chains.length}
            </span>
          )}
        </div>
        <span className="text-zinc-500 dark:text-zinc-400">
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : isOpen ? (
            '▲'
          ) : (
            '▼'
          )}
        </span>
      </button>

      {isOpen && (
        <div className="bg-white dark:bg-black p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {status && (
            <div className={`px-4 py-3 rounded border ${status.startsWith('Error') ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
              <p className={`text-sm ${status.startsWith('Error') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {status}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : '+ Add Chain'}
            </button>
          </div>

          {showAddForm && (
            <div className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-black dark:text-zinc-50">Add New Chain</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChain.id || ''}
                    onChange={(e) => setNewChain({ ...newChain, id: e.target.value })}
                    placeholder="e.g. ethereum"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChain.name || ''}
                    onChange={(e) => setNewChain({ ...newChain, name: e.target.value })}
                    placeholder="e.g. Ethereum"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Icon Filename
                  </label>
                  <input
                    type="text"
                    value={newChain.icon || ''}
                    onChange={(e) => setNewChain({ ...newChain, icon: e.target.value })}
                    placeholder="e.g. ethereum-eth-logo.svg"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Explorer Prefix
                  </label>
                  <input
                    type="text"
                    value={newChain.explorer_prefix || ''}
                    onChange={(e) => setNewChain({ ...newChain, explorer_prefix: e.target.value })}
                    placeholder="e.g. https://etherscan.io/token/"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={addChain}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Add Chain
              </button>
            </div>
          )}

          {isLoading && chains.length === 0 ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          ) : chains.length === 0 ? (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              No chains found
            </div>
          ) : (
            <div className="space-y-4">
              {chains.map((chain) => (
                <div
                  key={chain.id}
                  className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black dark:text-zinc-50">{chain.id}</span>
                    <button
                      onClick={() => deleteChain(chain.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={chain.name}
                        onChange={(e) => {
                          const updated = { ...chain, name: e.target.value }
                          setChains((prev) =>
                            prev.map((c) => (c.id === chain.id ? updated : c))
                          )
                        }}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Icon
                      </label>
                      <input
                        type="text"
                        value={chain.icon || ''}
                        onChange={(e) => {
                          const updated = { ...chain, icon: e.target.value || null }
                          setChains((prev) =>
                            prev.map((c) => (c.id === chain.id ? updated : c))
                          )
                        }}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Explorer Prefix
                      </label>
                      <input
                        type="text"
                        value={chain.explorer_prefix || ''}
                        onChange={(e) => {
                          const updated = { ...chain, explorer_prefix: e.target.value || null }
                          setChains((prev) =>
                            prev.map((c) => (c.id === chain.id ? updated : c))
                          )
                        }}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => updateChain(chain)}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
