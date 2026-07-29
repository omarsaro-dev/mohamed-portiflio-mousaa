'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLenis } from '@/lib/lenis'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollProgress from '@/components/ui/ScrollProgress'
import AnimatedDivider from '@/components/ui/AnimatedDivider'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
const Cursor = dynamic(() => import('@/components/ui/Cursor'), { ssr: false })
const Background3D = dynamic(() => import('@/components/three/Background3D'), { ssr: false })
const Founder = dynamic(() => import('@/components/sections/Founder'), { ssr: false })
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: false })
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false })
const StudioProcess = dynamic(() => import('@/components/sections/StudioProcess'), { ssr: false })
const MaterialExperience = dynamic(() => import('@/components/sections/MaterialExperience'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })

export default function Home() {
  useLenis()

  useEffect(() => {
    const fallback = setTimeout(() => {
      document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.opacity = '1'
          el.style.visibility = 'visible'
        }
      })
    }, 4000)
    return () => clearTimeout(fallback)
  }, [])

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <div className="min-h-screen">
        <Navigation />
        <Cursor />
        <Background3D />
        <Hero />
        <MarqueeStrip />
        <Founder />
        <AnimatedDivider variant="ornate" />
        <Philosophy />
        <MarqueeStrip
          text="PRECISION • ELEGANCE • EMOTION • CRAFT • LIGHT • SPACE •"
          direction="right"
          speed={50}
        />
        <Projects />
        <AnimatedDivider variant="diamond" />
        <StudioProcess />
        <MarqueeStrip
          text="STONE • WOOD • LIGHT • TEXTURE • FORM • SHADOW •"
          speed={45}
        />
        <MaterialExperience />
        <AnimatedDivider variant="double" />
        <Contact />
      </div>
    </>
  )
}
