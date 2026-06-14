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

    const hasHashtagChanges = 'hashtags' in body || 'new_hashtags' in body

    if (Object.keys(updates).length === 0 && !hasHashtagChanges) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString()

      const { error } = await supabaseService
        .from('tokens')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error('Failed to update token:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    // Handle hashtag changes
    if (hasHashtagChanges) {
      const hashtagIds: string[] = body.hashtags ?? []
      const newHashtagNames: string[] = body.new_hashtags ?? []

      // Create new hashtags if provided
      if (newHashtagNames.length > 0) {
        const newHashtagData = newHashtagNames.map((name: string) => ({
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          is_active: true,
        }))

        const { data: createdHashtags, error: createError } = await supabaseService
          .from('hashtags')
          .insert(newHashtagData)
          .select('id')

        if (createError) {
          console.error('Failed to create hashtags:', createError.message)
        } else if (createdHashtags) {
          hashtagIds.push(...createdHashtags.map((h: { id: string }) => h.id))
        }
      }

      // Delete existing associations and re-insert
      if (body.hashtags !== undefined) {
        const { error: deleteError } = await supabaseService
          .from('token_hashtags')
          .delete()
          .eq('token_id', id)

        if (deleteError) {
          console.error('Failed to delete token hashtags:', deleteError.message)
        }

        if (hashtagIds.length > 0) {
          const tokenHashtags = hashtagIds.map((hashtagId: string) => ({
            token_id: id,
            hashtag_id: hashtagId,
          }))

          const { error: assocError } = await supabaseService
            .from('token_hashtags')
            .insert(tokenHashtags)

          if (assocError) {
            console.error('Failed to associate hashtags:', assocError.message)
          }
        }
      }
    }

    // Fetch updated token with hashtags
    const { data: updatedToken, error: fetchError } = await supabaseService
      .from('tokens')
      .select(
        `*,
        token_hashtags(
          hashtags(id, name, slug)
        )`
      )
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Failed to fetch updated token:', fetchError.message)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const hashtags =
      updatedToken.token_hashtags?.map(
        (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
      ) ?? []

    return NextResponse.json({
      ...updatedToken,
      hashtags,
    })
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
