import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export const maxDuration = 60

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: token, error } = await supabaseService
      .from('tokens')
      .select(
        `*,
        token_hashtags(
          hashtags(id, name, slug)
        ),
        raw_token:raw_tokens(id, raw_payload)`
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch token:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    const hashtags =
      token.token_hashtags?.map(
        (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
      ) ?? []

    const rawToken = token.raw_token ?? null

    return NextResponse.json({
      ...token,
      hashtags,
      raw_token: rawToken,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      'slug',
      'category',
      'short_description',
      'full_description',
      'main_hashtag',
      'logo_url',
      'website_url',
      'social_links',
      'exchange_links',
      'preferred_exchange',
      'start_date',
      'end_date',
      'confidence',
      'status',
      'is_promoted',
      'is_verified',
      'rating',
    ]

    const updates: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in body) {
        updates[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabaseService
      .from('tokens')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update token:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token PATCH error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseService.from('tokens').delete().eq('id', id)

    if (error) {
      console.error('Failed to delete token:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token DELETE error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
