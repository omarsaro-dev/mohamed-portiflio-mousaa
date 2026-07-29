'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { animations } from '@/lib/animations'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.hero-avatar', { opacity: 0, y: 30, scale: 0.9, filter: 'blur(5px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 }, 0.1)
        .fromTo('.hero-logo', { opacity: 0, y: 40, scale: 1.2, filter: 'blur(12px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4 }, 0.3)
        .fromTo('.hero-tagline', { opacity: 0, x: -40, skewX: 5 }, { opacity: 1, x: 0, skewX: 0, duration: 1 }, 0.6)
        .fromTo('.hero-title-line', { opacity: 0, y: 80, rotateX: -20, scale: 1.1 }, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.2 }, 0.9)
        .fromTo('.hero-subtitle', { opacity: 0, y: 30, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 1.6)
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 2)

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.2,
          opacity: 0.08,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }

      animations.float('.hero-avatar', 6, 4, 3)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20">
      <div
        ref={bgRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-500/10 via-amber-500/5 to-transparent blur-[180px] pointer-events-none rounded-full"
      />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251, 191, 36, 0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="hero-avatar mb-8 inline-block">
          <a href="#founder" className="group flex items-center gap-3 bg-white/[0.03] border border-white/10 hover:border-amber-500/50 px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 relative shrink-0">
              <Image
                src="/images/mohamed-moussa.jpg"
                alt="Arch. Mohamed Moussa"
                fill
                sizes="40px"
                priority
                className="object-cover group-hover:scale-110 transition-transform duration-500"
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

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-8 leading-none tracking-tight">
          <span className="hero-title-line block">Mohamed</span>
          <span className="hero-title-line block">Moussa</span>
        </h1>

        <p className="hero-subtitle text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Creating timeless spaces through architecture, emotion and precision across Egypt and the Middle East.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#projects"
            className="hero-cta relative overflow-hidden group px-8 py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase rounded-xs"
          >
            <span className="relative z-10">Explore Selected Works</span>
            <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#founder"
            className="hero-cta relative overflow-hidden group px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase rounded-xs"
          >
            <span className="relative z-10">The Founder</span>
            <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[8px] tracking-[0.3em] uppercase font-mono">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
