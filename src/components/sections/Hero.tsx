'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { animations } from '@/lib/animations'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      animations.fadeUp('.hero-avatar', 0)
      animations.fadeUp('.hero-logo', 0.2)
      animations.fadeUp('.hero-tagline', 0.4)
      animations.fadeUp('.hero-title', 0.6)
      animations.fadeUp('.hero-subtitle', 0.8)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] pt-20">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        {/* Founder Avatar Badge */}
        <div className="hero-avatar mb-8 inline-block">
          <a href="#founder" className="group flex items-center gap-3 bg-white/[0.03] border border-white/10 hover:border-amber-500/50 px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 relative">
              <img 
                src="/images/mohamed-moussa.jpg" 
                alt="Arch. Mohamed Moussa" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="text-left pr-2">
              <p className="text-[11px] text-white font-serif tracking-wide">Arch. Mohamed Moussa</p>
              <p className="text-[9px] text-amber-400/80 font-mono tracking-widest uppercase">Founder & Creative Director</p>
            </div>
          </a>
        </div>

        <div className="hero-logo font-serif text-3xl md:text-4xl tracking-[0.35em] text-white/90 mb-6">
          MOUSAA
        </div>

        <p className="hero-tagline text-amber-500/80 tracking-[0.3em] text-xs md:text-sm mb-6 uppercase font-mono">
          Luxury Architecture & Interior Design
        </p>

        <h1 className="hero-title font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-8 leading-none tracking-tight">
          Mohamed<br />Moussa
        </h1>

        <p className="hero-subtitle text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Creating timeless spaces through architecture, emotion and precision across Egypt and the Middle East.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <a 
            href="#projects" 
            className="px-8 py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase hover:bg-amber-400 transition-colors rounded-xs"
          >
            Explore Selected Works
          </a>
          <a 
            href="#founder" 
            className="px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-amber-500/50 hover:text-amber-300 transition-colors rounded-xs"
          >
            The Founder
          </a>
        </div>
      </div>
    </section>
  )
}
