'use client'

import { useLenis } from '@/lib/lenis'
import Cursor from '@/components/ui/Cursor'
import Navigation from '@/components/ui/Navigation'
import PageTransition from '@/components/ui/PageTransition'
import Hero from '@/components/sections/Hero'
import Founder from '@/components/sections/Founder'
import Philosophy from '@/components/sections/Philosophy'
import Projects from '@/components/sections/Projects'
import StudioProcess from '@/components/sections/StudioProcess'
import MaterialExperience from '@/components/sections/MaterialExperience'
import Contact from '@/components/sections/Contact'
import Background3D from '@/components/three/Background3D'

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
