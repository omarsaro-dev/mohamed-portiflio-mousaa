'use client'

import { useEffect } from 'react'
import { useLenis } from '@/lib/lenis'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollProgress from '@/components/ui/ScrollProgress'
import AnimatedDivider from '@/components/ui/AnimatedDivider'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import Founder from '@/components/sections/Founder'
import Philosophy from '@/components/sections/Philosophy'
import Projects from '@/components/sections/Projects'
import StudioProcess from '@/components/sections/StudioProcess'
import MaterialExperience from '@/components/sections/MaterialExperience'
import Contact from '@/components/sections/Contact'
import Cursor from '@/components/ui/Cursor'
import Background3D from '@/components/three/Background3D'

export default function Home() {
  useLenis()

  useEffect(() => {
    const fallback = setTimeout(() => {
      document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => {
        if (el instanceof HTMLElement && !el.classList.contains('loading-screen')) {
          el.style.opacity = '1'
          el.style.visibility = 'visible'
        }
      })
    }, 3000)
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
