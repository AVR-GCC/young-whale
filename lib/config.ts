// lib/config.ts
// Platform configuration utility — reads from platform_config table
// Use in API routes to avoid hardcoding values

import { supabaseService } from './supabase/service'

export async function getConfig(key: string): Promise<unknown | null> {
  const { data, error } = await supabaseService
    .from('platform_config')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    console.error(`Failed to fetch config "${key}":`, error?.message)
    return null
  }

  return data.value
}

export async function getConfigString(key: string): Promise<string | null> {
  const value = await getConfig(key)
  if (value === null) return null
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

export async function getConfigNumber(key: string): Promise<number | null> {
  const value = await getConfig(key)
  if (value === null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) return parsed
  }
  return null
}

export async function getConfigBoolean(key: string): Promise<boolean | null> {
  const value = await getConfig(key)
  if (value === null) return null
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }
  return null
}
