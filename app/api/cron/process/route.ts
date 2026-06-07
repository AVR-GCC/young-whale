import { NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'
import { getConfigString } from '@/lib/config'
import type {
  ProcessingQueueJob,
  RawToken,
  TokenCategory,
  Confidence,
} from '@/shared/types'

export const maxDuration = 60

const apiKey = process.env.FIREWORKS_API_KEY ?? ''
const fireworks = createOpenAI({
  apiKey,
  baseURL: 'https://api.fireworks.ai/inference/v1',
})

const ALLOWED_CATEGORIES: TokenCategory[] = ['Presale', 'Tech', 'Meme', 'RWA']
const ALLOWED_CONFIDENCES: Confidence[] = ['low', 'medium', 'high']

interface AIResult {
  category: string
  main_hashtag: string
  short_description: string
  full_description: string
  confidence: string
}

async function processJob(
  job: ProcessingQueueJob,
  allowedHashtags: string[]
): Promise<'success' | 'failed'> {
  const { data: rawToken, error: rawError } = await supabaseService
    .from('raw_tokens')
    .select('*')
    .eq('id', job.raw_token_id)
    .single()

  if (rawError || !rawToken) {
    const msg = rawError?.message ?? 'Raw token not found'
    await markJobFailed(job, msg)
    return 'failed'
  }

  const raw = rawToken as RawToken

  if (!raw.name || !raw.symbol || !raw.chain) {
    await markJobFailed(job, 'Missing required fields: name, symbol, or chain')
    return 'failed'
  }

  // Extract CMC tags from raw payload
  const cmcDetails = raw.raw_payload?.cmc_details as Record<string, unknown> | undefined
  const cmcTags = Array.isArray(cmcDetails?.tags)
    ? (cmcDetails.tags as string[]).map((t: string) => t.toLowerCase().trim())
    : []

  const validCmcTags = cmcTags.filter((tag: string) => allowedHashtags.includes(tag))

  let aiResult: AIResult
  try {
    aiResult = await callFireworks(raw, validCmcTags)
  } catch (aiError) {
    const msg = aiError instanceof Error ? aiError.message : 'AI call failed'
    await markJobFailed(job, msg)
    return 'failed'
  }

  const validation = validateAIResult(aiResult, allowedHashtags)
  if (!validation.valid) {
    await markJobFailed(job, validation.error)
    return 'failed'
  }

  const uniqueKey = raw.contract_address
    ? `${raw.chain}_${raw.contract_address}`.toLowerCase()
    : `${raw.website_url ?? ''}_${raw.name}`.toLowerCase().replace(/[^a-z0-9]/g, '_')

  let slug = `${raw.name}-${raw.symbol}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  slug = await ensureUniqueSlug(slug)

  const tokenData = {
    name: raw.name,
    symbol: raw.symbol,
    chain: raw.chain,
    contract_address: raw.contract_address,
    unique_key: uniqueKey,
    slug,
    category: aiResult.category as TokenCategory,
    short_description: aiResult.short_description,
    full_description: aiResult.full_description,
    logo_url: raw.logo_url,
    logo_storage_path: null,
    website_url: raw.website_url,
    social_links: raw.social_links ?? {},
    exchange_links:
      raw.exchange_links && raw.exchange_links.length > 0
        ? raw.exchange_links
        : await fetchDexScreenerLinks(raw),
    start_date: null,
    end_date: null,
    source_type: raw.source_type,
    source_url: raw.source_url,
    confidence: aiResult.confidence as Confidence,
    raw_token_id: raw.id,
    status: aiResult.confidence === 'low' ? 'pending_review' : 'approved' as const,
    is_promoted: false,
    is_verified: false,
    main_hashtag: aiResult.main_hashtag,
  }

  const { data: upserted, error: upsertError } = await supabaseService
    .from('tokens')
    .upsert(tokenData, { onConflict: 'unique_key' })
    .select()
    .single()

  if (upsertError || !upserted) {
    await markJobFailed(
      job,
      upsertError?.message ?? 'Failed to upsert token'
    )
    return 'failed'
  }

  if (validCmcTags.length > 0) {
    const { data: hashtagRows } = await supabaseService
      .from('hashtags')
      .select('id, slug')
      .in('slug', validCmcTags)

    const hashtagMap = new Map(
      (hashtagRows ?? []).map((h: { id: string; slug: string }) => [h.slug, h.id])
    )

    const tokenHashtagRows = validCmcTags
      .map((slug) => {
        const id = hashtagMap.get(slug.toLowerCase())
        if (!id) return null
        return { token_id: upserted.id, hashtag_id: id }
      })
      .filter(Boolean) as { token_id: string; hashtag_id: string }[]

    if (tokenHashtagRows.length > 0) {
      const { error: hashtagError } = await supabaseService
        .from('token_hashtags')
        .upsert(tokenHashtagRows, {
          onConflict: 'token_id,hashtag_id',
        })

      if (hashtagError) {
        console.error('Failed to insert hashtags:', hashtagError.message)
      }
    }
  }

  await supabaseService
    .from('processing_queue')
    .update({ status: 'completed', locked_until: null, error_message: null })
    .eq('id', job.id)

  await supabaseService
    .from('raw_tokens')
    .update({ status: 'processed', error_message: null })
    .eq('id', job.raw_token_id)

  return 'success'
}

async function fetchDexScreenerLinks(raw: RawToken): Promise<string[]> {
  try {
    const query = raw.contract_address
      ? raw.contract_address
      : `${raw.name} ${raw.symbol}`.trim()

    if (!query) return []

    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`
    )

    if (!response.ok) return []

    const data = (await response.json()) as {
      pairs?: Array<{ url: string }>
    }

    if (!data.pairs || data.pairs.length === 0) return []

    const urls = data.pairs.map((pair) => pair.url)
    return [...new Set(urls)]
  } catch {
    return []
  }
}

async function callFireworks(
  raw: RawToken,
  cmcTags: string[]
): Promise<AIResult> {
  const modelName = (await getConfigString('ai_model')) ?? 'accounts/fireworks/models/gpt-oss-120b'
  const model = fireworks.chat(modelName)

  const system =
    (await getConfigString('ai_prompt_system')) ??
    'You are a crypto token classifier. Analyze the token data provided and return a JSON object only. No explanation, no markdown, just raw JSON.'

  const rawStr = JSON.stringify(raw, null, 2);
  const user = `Analyze this token and return ONLY a JSON object with these exact keys:
{
  "category": "one of: Presale, Tech, Meme, RWA",
  "main_hashtag": "single slug from the CMC tags list below, preferably NOT one that corresponds to the main category. For example, if category is 'Tech', avoid 'technology' or 'infrastructure' tags. Choose something more specific or distinctive.",
  "short_description": "max 6 words, beginner friendly, no jargon",
  "full_description": "2-3 sentences explaining what the token does",
  "confidence": "low | medium | high"
}

Available CMC tags for this token: ${cmcTags.join(', ')}

Token data:
${rawStr}`

  const { text } = await generateText({
    model,
    system,
    prompt: user,
    temperature: 0.2,
  })

  const cleaned = text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '')
  const parsed = JSON.parse(cleaned)

  return parsed as AIResult
}

function validateAIResult(
  result: AIResult,
  allowedHashtags: string[]
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_CATEGORIES.includes(result.category as TokenCategory)) {
    return { valid: false, error: `Invalid category: ${result.category}` }
  }

  if (!result.main_hashtag || typeof result.main_hashtag !== 'string') {
    return { valid: false, error: 'main_hashtag must be a non-empty string' }
  }

  if (!allowedHashtags.includes(result.main_hashtag.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid main_hashtag: ${result.main_hashtag}`,
    }
  }

  if (!result.short_description || result.short_description.trim().length === 0) {
    return { valid: false, error: 'short_description is required' }
  }

  if (!ALLOWED_CONFIDENCES.includes(result.confidence as Confidence)) {
    return { valid: false, error: `Invalid confidence: ${result.confidence}` }
  }

  return { valid: true }
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let suffix = 2

  while (true) {
    const { data, error } = await supabaseService
      .from('tokens')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error('Error checking slug collision:', error.message)
      break
    }

    if (!data) break

    slug = `${baseSlug}-${suffix}`
    suffix++
  }

  return slug
}

async function markJobFailed(job: ProcessingQueueJob, errorMessage: string) {
  const newRetry = job.retry_count + 1
  const shouldRetry = newRetry < job.max_retries

  await supabaseService
    .from('processing_queue')
    .update({
      status: shouldRetry ? 'queued' : 'failed',
      retry_count: newRetry,
      locked_until: shouldRetry ? null : job.locked_until,
      error_message: errorMessage,
    })
    .eq('id', job.id)

  await supabaseService
    .from('raw_tokens')
    .update({
      status: 'failed',
      error_message: errorMessage,
    })
    .eq('id', job.raw_token_id)
}

export async function GET(request: Request) {
  // if (process.env.NODE_ENV !== 'development') {
  if (false) {
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let processed = 0
  let failed = 0

  try {
    const { data: hashtagRows, error: hashtagError } = await supabaseService
      .from('hashtags')
      .select('slug')
      .eq('is_active', true)

    if (hashtagError) {
      console.error('Failed to fetch hashtags:', hashtagError.message)
      return NextResponse.json(
        { error: 'Database error fetching hashtags' },
        { status: 500 }
      )
    }

    const allowedHashtags = (hashtagRows ?? []).map((h: { slug: string }) => h.slug)

    while (true) {
      const now = new Date().toISOString()
      const lockUntil = new Date(Date.now() + 2 * 60 * 1000).toISOString()

      const { data: jobs, error: pickError } = await supabaseService
        .from('processing_queue')
        .select('*')
        .eq('status', 'queued')
        .or('locked_until.is.null,locked_until.lt.' + now)
        .limit(5)

      if (pickError) {
        console.error('Failed to pick up jobs:', pickError.message)
        return NextResponse.json(
          { error: 'Database error picking up jobs' },
          { status: 500 }
        )
      }

      if (!jobs || jobs.length === 0) {
        break
      }

      const jobIds = jobs.map((j) => j.id)
      await supabaseService
        .from('processing_queue')
        .update({ status: 'processing', locked_until: lockUntil })
        .in('id', jobIds)

      for (const job of jobs as ProcessingQueueJob[]) {
        try {
          const result = await processJob(job, allowedHashtags)
          if (result === 'success') {
            processed++
          } else {
            failed++
          }
        } catch (jobError) {
          console.error(`Unhandled error processing job ${job.id}:`, jobError)
          await markJobFailed(
            job,
            jobError instanceof Error ? jobError.message : 'Unhandled error'
          )
          failed++
        }
      }
    }

    return NextResponse.json({
      processed,
      failed,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Cron process error:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
