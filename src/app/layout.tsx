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
  title: 'Arch. Mohamed Moussa - Luxury Architecture & Interior Design',
  description: 'Creating timeless spaces through architecture, emotion and precision. Founder & Creative Director specializing in luxury villas, residential, commercial, and hospitality projects across Egypt and the Middle East.',
  keywords: ['luxury architecture', 'interior design', 'Mohamed Moussa', 'Mousaa', 'Egypt architecture', 'Dubai architecture', 'luxury villas', 'commercial design', 'hospitality design'],
  authors: [{ name: 'Mohamed Moussa' }],
  creator: 'Mohamed Moussa',
  openGraph: {
    title: 'Arch. Mohamed Moussa',
    description: 'Creating timeless spaces through architecture, emotion and precision.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Arch. Mohamed Moussa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arch. Mohamed Moussa',
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
        <link rel="preload" href="/images/founder-portrait.jpg" as="image" type="image/jpeg" fetchPriority="high" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){var e=document.querySelector(".loading-screen");if(e&&getComputedStyle(e).visibility!=="hidden"){e.style.transition="transform 0.35s cubic-bezier(0.65,0,0.35,1), opacity 0.2s ease";e.style.transform="translateY(-100%)";e.style.opacity="0";setTimeout(function(){e.style.visibility="hidden";e.style.pointerEvents="none"},400)}},1500)`
        }} />
        {children}
      </body>
    </html>
  )
}
