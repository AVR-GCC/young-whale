// ============================================================
// Shared TypeScript types — mirrors the database schema exactly
// Import in both frontend and backend to stay in sync
// Path: shared/types/index.ts
// ============================================================

// ---------------------------
// Enums
// ---------------------------

export type TokenCategory = 'Presale' | 'Tech' | 'Meme' | 'RWA' | 'Airdrop'

export type TokenStatus = 'approved' | 'pending_review' | 'rejected'

export type SourceType = 'coinbase' | 'dex' | 'user_paid'

export type Confidence = 'low' | 'medium' | 'high'

export type PromotionType = 'listing' | 'banner' | 'video' | 'badge' | 'page'

export type PaymentStatus = 'pending' | 'confirmed' | 'failed'

export type LogType =
  | 'ingestion'
  | 'processing'
  | 'promotion'
  | 'webhook'
  | 'admin'
  | 'error'
  | 'system'

export type LogSeverity = 'info' | 'warning' | 'error'

export type AdminRole = 'admin' | 'superadmin'

// ---------------------------
// Shared sub-shapes
// ---------------------------

export interface SocialLinks {
  twitter?: string
  telegram?: string
  facebook?: string
  discord?: string
}

// ---------------------------
// Tables
// ---------------------------

export interface RawToken {
  id: string
  name: string | null
  symbol: string | null
  chain: string | null
  contract_address: string | null
  website_url: string | null
  logo_url: string | null
  social_links: SocialLinks
  exchange_links: string[]
  source_type: 'coinbase' | 'dex' | null
  source_url: string | null
  raw_payload: Record<string, unknown> | null
  status: 'pending' | 'processing' | 'processed' | 'failed'
  retry_count: number
  error_message: string | null
  created_at: string
}

export interface Hashtag {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface Token {
  id: string
  name: string
  symbol: string
  chain: string
  contract_address: string | null
  unique_key: string
  slug: string
  category: TokenCategory
  short_description: string | null
  full_description: string | null
  logo_url: string | null
  logo_storage_path: string | null
  website_url: string | null
  social_links: SocialLinks
  exchange_links: string[]
  preferred_exchange: string | null
  start_date: string | null
  end_date: string | null
  source_type: SourceType | null
  source_url: string | null
  confidence: Confidence | null
  raw_token_id: string | null
  status: TokenStatus
  is_promoted: boolean
  is_verified: boolean
  main_hashtag: string | null
  rating: number
  created_at: string
  updated_at: string
}

// Token with hashtags joined — used in frontend feeds
export interface TokenWithHashtags extends Token {
  hashtags: Hashtag[]
}

export interface TokenHashtag {
  token_id: string
  hashtag_id: string
}

export interface ProcessingQueueJob {
  id: string
  raw_token_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  retry_count: number
  max_retries: number
  error_message: string | null
  locked_until: string | null
  created_at: string
  updated_at: string
}

export interface ProcessingRun {
  id: string
  status: 'running' | 'completed' | 'failed'
  processed_count: number
  failed_count: number
  error_message: string | null
  message: string | null
  started_at: string
  completed_at: string | null
}

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  created_at: string
}

export interface Promotion {
  id: string
  token_id: string
  type: PromotionType
  amount_paid: number | null
  currency: string
  starts_at: string | null
  expires_at: string | null           // null for forever types (badge, page)
  is_active: boolean
  invoice_id: string | null
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  promotion_id: string
  desktop_url: string                 // 728x90
  mobile_url: string                  // 320x50
  destination_url: string
  is_approved: boolean
  is_placeholder: boolean
  created_at: string
}

export interface Submission {
  id: string
  token_name: string | null
  symbol: string | null
  chain: string | null
  contract_address: string | null
  full_description: string | null
  logo_url: string | null
  website_url: string | null
  social_links: SocialLinks
  promotion_type: PromotionType | null
  duration_days: 30 | 60 | 90 | null
  asset_url: string | null
  destination_url: string | null
  invoice_id: string | null
  payment_status: PaymentStatus
  amount_paid: number | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_at: string | null
  created_at: string
}

export interface EmailSubscription {
  id: string
  email: string
  is_active: boolean
  created_at: string
}

export interface Log {
  id: string
  type: LogType
  severity: LogSeverity
  message: string
  metadata: Record<string, unknown>
  token_id: string | null
  admin_id: string | null
  created_at: string
}

// ---------------------------
// AI Processing payload
// Intermediate shape returned by Fireworks AI
// Validated and mapped into Token before persistence
// ---------------------------

export interface AIProcessingPayload {
  name: string
  symbol: string
  chain: string
  contract_address: string
  category: TokenCategory
  main_hashtag: string                // AI-selected primary hashtag from CMC tags
  short_description: string           // max 6 words
  full_description: string
  logo_url: string
  website_url: string
  social_links: SocialLinks
  exchange_links: string[]
  source_url: string
  confidence: Confidence
  status: 'approved' | 'pending_review'
}
