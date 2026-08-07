import {
  INSTAGRAM_PROFILE,
  INSTAGRAM_PLACEHOLDER_POSTS,
  INSTAGRAM_PLACEHOLDER_STATS,
} from '@/config/instagram'

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'

export interface InstagramPost {
  id: string
  mediaUrl: string
  permalink: string
  caption: string
  timestamp: string
  mediaType: InstagramMediaType
  username: string
  source: 'live' | 'placeholder'
}

export interface InstagramStats {
  posts: number
  followers: number
  following: number
  available: boolean
}

export interface InstagramProfile {
  name: string
  username: string
  handle: string
  url: string
  avatarUrl: string
  bio: string
  profession: string[]
}

export interface InstagramFeed {
  live: boolean
  profile: InstagramProfile
  posts: InstagramPost[]
  stats: InstagramStats
}

export const INSTAGRAM_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMTYxNDEyIiAvPjwvc3ZnPg=='

export function createPlaceholderFeed(): InstagramFeed {
  const posts: InstagramPost[] = INSTAGRAM_PLACEHOLDER_POSTS.map((p) => ({
    ...p,
    mediaType: 'IMAGE',
    username: INSTAGRAM_PROFILE.username,
    source: 'placeholder',
  }))

  return {
    live: false,
    profile: {
      name: INSTAGRAM_PROFILE.name,
      username: INSTAGRAM_PROFILE.username,
      handle: INSTAGRAM_PROFILE.handle,
      url: INSTAGRAM_PROFILE.url,
      avatarUrl: INSTAGRAM_PROFILE.avatarUrl,
      bio: INSTAGRAM_PROFILE.bio,
      profession: [...INSTAGRAM_PROFILE.profession],
    },
    posts,
    stats: {
      posts: INSTAGRAM_PLACEHOLDER_STATS.posts,
      followers: INSTAGRAM_PLACEHOLDER_STATS.followers,
      following: INSTAGRAM_PLACEHOLDER_STATS.following,
      available: false,
    },
  }
}
