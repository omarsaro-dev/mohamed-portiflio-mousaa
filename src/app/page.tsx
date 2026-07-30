'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const mainRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
        gsap.fromTo(section, { opacity: 0, y: 30, scale: 0.99 }, {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none', invalidateOnRefresh: true },
        })
      })
    }, mainRef)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <div ref={mainRef} className="min-h-screen">
        <Navigation />
        <Cursor />
        <Background3D />
        <Hero />
        <div className="section-transition">
          <MarqueeStrip />
        </div>
        <Founder />
        <AnimatedDivider variant="ornate" />
        <Philosophy />
        <div className="section-transition">
          <MarqueeStrip
            text="PRECISION • ELEGANCE • EMOTION • CRAFT • LIGHT • SPACE •"
            direction="right"
            speed={50}
          />
        </div>
        <Projects />
        <AnimatedDivider variant="diamond" />
        <StudioProcess />
        <div className="section-transition">
          <MarqueeStrip
            text="STONE • WOOD • LIGHT • TEXTURE • FORM • SHADOW •"
            speed={45}
          />
        </div>
        <MaterialExperience />
        <AnimatedDivider variant="double" />
        <Contact />
      </div>
    </>
  )
}
