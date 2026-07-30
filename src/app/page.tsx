'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/lib/lenis'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Cursor from '@/components/ui/Cursor'

const Background3D = dynamic(() => import('@/components/three/Background3D'), { ssr: false })
const MarqueeStrip = dynamic(() => import('@/components/ui/MarqueeStrip'), { ssr: false })
const AnimatedDivider = dynamic(() => import('@/components/ui/AnimatedDivider'), { ssr: false })
const Founder = dynamic(() => import('@/components/sections/Founder'), { ssr: false })
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: false })
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false })
const StudioProcess = dynamic(() => import('@/components/sections/StudioProcess'), { ssr: false })
const MaterialExperience = dynamic(() => import('@/components/sections/MaterialExperience'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })

export default function Home() {
  useLenis()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => gsap.to(section, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', force3D: true }),
          once: true,
        })
      })
    }, mainRef)

    ScrollTrigger.refresh()

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => { ctx.revert(); cancelAnimationFrame(raf) }
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
