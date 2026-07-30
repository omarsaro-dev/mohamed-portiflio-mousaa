import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Mousaa | Mohamed Moussa - Luxury Architecture & Interior Design',
  description: 'Creating timeless spaces through architecture, emotion and precision. Founder & Creative Director specializing in luxury villas, residential, commercial, and hospitality projects across Egypt and the Middle East.',
  keywords: ['luxury architecture', 'interior design', 'Mohamed Moussa', 'Mousaa', 'Egypt architecture', 'Dubai architecture', 'luxury villas', 'commercial design', 'hospitality design'],
  authors: [{ name: 'Mohamed Moussa' }],
  creator: 'Mohamed Moussa',
  openGraph: {
    title: 'Mousaa | Mohamed Moussa',
    description: 'Creating timeless spaces through architecture, emotion and precision.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mousaa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mousaa | Mohamed Moussa',
    description: 'Creating timeless spaces through architecture, emotion and precision.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preload" href="/images/mohamed-moussa.jpg" as="image" type="image/jpeg" fetchPriority="high" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){var e=document.querySelector(".loading-screen");if(e&&getComputedStyle(e).visibility!=="hidden"){e.style.transition="transform 0.5s ease, opacity 0.3s ease";e.style.transform="translateY(-100%)";e.style.opacity="0";setTimeout(function(){e.style.visibility="hidden";e.style.pointerEvents="none"},600)}},3000)`
        }} />
        {children}
      </body>
    </html>
  )
}
