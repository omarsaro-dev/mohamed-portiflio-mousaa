'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'
import LoadingScreen from '@/components/ui/LoadingScreen'
const Background3D = dynamic(() => import('@/components/three/Background3D'), { ssr: false })
const MarqueeStrip = dynamic(() => import('@/components/ui/MarqueeStrip'), { ssr: false })
const AnimatedDivider = dynamic(() => import('@/components/ui/AnimatedDivider'), { ssr: false })

const Founder = dynamic(() => import('@/components/sections/Founder'), { ssr: false })
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: false })
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false })
const StudioProcess = dynamic(() => import('@/components/sections/StudioProcess'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })
const Instagram = dynamic(() => import('@/components/sections/Instagram'), { ssr: false })
const FloatingInstagram = dynamic(() => import('@/components/ui/FloatingInstagram'), { ssr: false })

function SectionPlaceholder() {
  return <div className="min-h-[200px] bg-[#070707]" />
}

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen">
        <Navigation />
        <Background3D />
        <Hero />
        <Suspense fallback={<SectionPlaceholder />}>
          <MarqueeStrip />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <Founder />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <AnimatedDivider variant="ornate" />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <Philosophy />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <MarqueeStrip
            text="PRECISION • ELEGANCE • EMOTION • CRAFT • LIGHT • SPACE •"
            direction="right"
            speed={50}
          />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <AnimatedDivider variant="diamond" />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <StudioProcess />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <Instagram />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <MarqueeStrip
            text="STONE • WOOD • LIGHT • TEXTURE • FORM • SHADOW •"
            speed={45}
          />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <AnimatedDivider variant="double" />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <Contact />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <FloatingInstagram />
      </Suspense>
    </>
  )
}
