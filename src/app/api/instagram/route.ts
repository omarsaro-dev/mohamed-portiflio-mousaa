import { NextResponse } from 'next/server'
import { INSTAGRAM_PLACEHOLDER_STATS } from '@/config/instagram'
import { createPlaceholderFeed } from '@/lib/instagram'
import type { InstagramFeed, InstagramMediaType, InstagramPost, InstagramStats } from '@/lib/instagram'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const GRAPH_BASE = 'https://graph.instagram.com'
const MAX_POSTS = 12
const CACHE_TTL = 5 * 60 * 1000

let cache: { data: InstagramFeed; at: number } | null = null

function hasCredentials(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID)
}

interface GraphUser {
  id: string
  username?: string
  media_count?: number
  follower_count?: number
  following_count?: number
}

interface GraphMediaItem {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp?: string
}

function resolveMediaUrl(item: GraphMediaItem, mediaType: InstagramMediaType): string {
  if (mediaType === 'VIDEO') {
    return item.thumbnail_url || item.media_url || ''
  }
  return item.media_url || ''
}

async function fetchLiveFeed(): Promise<InstagramFeed | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN!
  const userId = process.env.INSTAGRAM_USER_ID!

  const profileRes = await fetch(
    `${GRAPH_BASE}/${userId}?fields=id,username,media_count,follower_count,following_count&access_token=${token}`,
    { next: { revalidate: CACHE_TTL } }
  )
  if (!profileRes.ok) throw new Error(`Instagram profile request failed: ${profileRes.status}`)
  const profile: GraphUser = await profileRes.json()

  const mediaRes = await fetch(
    `${GRAPH_BASE}/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&limit=${MAX_POSTS}&access_token=${token}`,
    { next: { revalidate: CACHE_TTL } }
  )
  if (!mediaRes.ok) throw new Error(`Instagram media request failed: ${mediaRes.status}`)
  const mediaJson: { data?: GraphMediaItem[] } = await mediaRes.json()

  const rawItems = mediaJson.data ?? []
  const posts: InstagramPost[] = rawItems
    .map((item) => {
      const mediaType = (item.media_type as InstagramMediaType) || 'IMAGE'
      return {
        id: item.id,
        mediaUrl: resolveMediaUrl(item, mediaType),
        permalink: item.permalink || '',
        caption: item.caption || '',
        timestamp: item.timestamp || new Date().toISOString(),
        mediaType,
        username: profile.username || 'mousaadesigns',
        source: 'live' as const,
      }
    })
    .filter((p) => p.mediaUrl.length > 0)

  const hasLiveStats =
    typeof profile.follower_count === 'number' && typeof profile.following_count === 'number'

  const stats: InstagramStats = {
    posts: posts.length > 0 ? posts.length : Number(profile.media_count) || 0,
    followers: hasLiveStats ? profile.follower_count! : INSTAGRAM_PLACEHOLDER_STATS.followers,
    following: hasLiveStats ? profile.following_count! : INSTAGRAM_PLACEHOLDER_STATS.following,
    available: hasLiveStats,
  }

  return {
    live: true,
    profile: {
      name: 'Arch. Mohamed Moussa',
      username: profile.username || 'mousaadesigns',
      handle: `@${profile.username || 'mousaadesigns'}`,
      url: 'https://www.instagram.com/mousaadesigns/',
      avatarUrl: '/images/founder-portrait.jpg',
      bio: 'Creating timeless spaces through architecture, emotion and precision.',
      profession: ['Architect', 'Interior Designer', '3D Visualization'],
    },
    posts,
    stats,
  }
}

export async function GET() {
  try {
    if (!hasCredentials()) {
      return NextResponse.json(createPlaceholderFeed())
    }

    if (cache && Date.now() - cache.at < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }

    const feed = await fetchLiveFeed()
    if (!feed || feed.posts.length === 0) {
      return NextResponse.json({ error: 'Instagram feed is empty' }, { status: 503 })
    }

    cache = { data: feed, at: Date.now() }
    return NextResponse.json(feed)
  } catch {
    return NextResponse.json({ error: 'Instagram feed unavailable' }, { status: 503 })
  }
}
