export interface InstagramPlaceholderPost {
  id: string
  mediaUrl: string
  permalink: string
  caption: string
  timestamp: string
}

export const INSTAGRAM_PROFILE = {
  url: 'https://www.instagram.com/mousaadesigns/',
  name: 'Arch. Mohamed Moussa',
  username: 'mousaadesigns',
  handle: '@mousaadesigns',
  avatarUrl: '/images/founder-portrait.jpg',
  profession: ['Architect', 'Interior Designer', '3D Visualization'],
  bio: 'Creating timeless spaces through architecture, emotion and precision. Luxury villas, interiors and photorealistic 3D visualization across Egypt and the Middle East.',
} as const

export const INSTAGRAM_PLACEHOLDER_STATS = {
  posts: 375,
  followers: 33200,
  following: 54,
} as const

export const INSTAGRAM_MARQUEE_WORDS = [
  'Instagram',
  'Architecture',
  'Interiors',
  'Design',
  'Materials',
  'Visualization',
  'Mousaa',
] as const

export const INSTAGRAM_PLACEHOLDER_POSTS: InstagramPlaceholderPost[] = [
  {
    id: 'ph-01',
    mediaUrl: '/images/projects/Exterior/exterior-facade-01.jpeg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cx1aB2cD3eF/',
    caption: 'Stone, light and shadow — the quiet language of materiality.',
    timestamp: '2026-07-28T16:40:00.000Z',
  },
  {
    id: 'ph-02',
    mediaUrl: '/images/projects/new classic/project 1/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cy2bC3dE4gH/',
    caption: 'New classic living — proportion, calm and warm oak.',
    timestamp: '2026-07-20T11:15:00.000Z',
  },
  {
    id: 'ph-03',
    mediaUrl: '/images/projects/modern/project 1/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cz3cD4fG5hJ/',
    caption: 'Modern lines for a modern life. Clean geometry, soft daylight.',
    timestamp: '2026-07-12T09:30:00.000Z',
  },
  {
    id: 'ph-04',
    mediaUrl: '/images/projects/classic/project q/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cw4dE6hJ7kL/',
    caption: 'Ornate moldings meet soft daylight. Classic never ages.',
    timestamp: '2026-07-02T18:05:00.000Z',
  },
  {
    id: 'ph-05',
    mediaUrl: '/images/projects/boho style/project 1/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cv5fG8kM9nP/',
    caption: 'Bohemian warmth — layered textures and earthy tones.',
    timestamp: '2026-06-24T14:50:00.000Z',
  },
  {
    id: 'ph-06',
    mediaUrl: '/images/projects/land scape/project 1/mousa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cu6hJ0mP2qR/',
    caption: 'The landscape extends the home beyond its walls.',
    timestamp: '2026-06-16T07:45:00.000Z',
  },
  {
    id: 'ph-07',
    mediaUrl: '/images/projects/Exterior/1.jpeg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Ct7kL2qS4tV/',
    caption: 'Facade studies at golden hour. Shadow as architecture.',
    timestamp: '2026-06-08T17:20:00.000Z',
  },
  {
    id: 'ph-08',
    mediaUrl: '/images/projects/modern/project 2/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cs8mN4tV6wX/',
    caption: 'Minimal, warm, precise. Less, but better.',
    timestamp: '2026-05-30T13:10:00.000Z',
  },
  {
    id: 'ph-09',
    mediaUrl: '/images/projects/office/project 1/ofice 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cr9pR6wY8zA/',
    caption: 'Workspace design — clarity for the working mind.',
    timestamp: '2026-05-22T10:35:00.000Z',
  },
  {
    id: 'ph-10',
    mediaUrl: '/images/projects/new classic/project 3/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cq0sT8zB0cC/',
    caption: 'Material palette exploration for our latest villa.',
    timestamp: '2026-05-12T15:00:00.000Z',
  },
  {
    id: 'ph-11',
    mediaUrl: '/images/projects/Exterior/exterior-facade-04.jpeg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Cp1uW0bD2eE/',
    caption: 'Sculptural elevation under the evening sky.',
    timestamp: '2026-05-04T19:55:00.000Z',
  },
  {
    id: 'ph-12',
    mediaUrl: '/images/projects/boho style/project 2/mousaa 1.jpg',
    permalink: 'https://www.instagram.com/mousaadesigns/p/Co2xY2fG4hH/',
    caption: 'Texture study — every surface tells a story.',
    timestamp: '2026-04-26T12:25:00.000Z',
  },
]
