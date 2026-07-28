'use client'

import dynamic from 'next/dynamic'
import { useLenis } from '@/lib/lenis'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'

const Cursor = dynamic(() => import('@/components/ui/Cursor'), { ssr: false })
const Background3D = dynamic(() => import('@/components/three/Background3D'), { ssr: false })
const PageTransition = dynamic(() => import('@/components/ui/PageTransition'), { ssr: false })
const Founder = dynamic(() => import('@/components/sections/Founder'), { ssr: false })
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: false })
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false })
const StudioProcess = dynamic(() => import('@/components/sections/StudioProcess'), { ssr: false })
const MaterialExperience = dynamic(() => import('@/components/sections/MaterialExperience'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })

export default function Home() {
  useLenis()

  return (
    <main className="min-h-screen">
      <Navigation />
      <Cursor />
      <Background3D />
      <PageTransition>
        <Hero />
        <Founder />
        <Philosophy />
        <Projects />
        <StudioProcess />
        <MaterialExperience />
        <Contact />
      </PageTransition>
    </main>
  )
}
