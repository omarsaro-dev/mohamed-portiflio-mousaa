'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { animations } from '@/lib/animations'

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const accentGlowRef = useRef<HTMLDivElement>(null)
  const mouseGlowRef = useRef<HTMLDivElement>(null)
  const idleCtxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.set('.hero-avatar, .hero-logo, .hero-tagline, .hero-name, .hero-subtitle, .hero-cta, .hero-intro-name', { opacity: 1, y: 0, scale: 1, skewX: 0, rotateX: 0 })
      } else {
        gsap.set('.hero-avatar', { opacity: 0, y: 40 })
        gsap.set('.hero-logo', { opacity: 0, y: 30 })
        gsap.set('.hero-tagline', { opacity: 0, y: 25, x: -20, skewX: 3 })
        gsap.set('.hero-name', { opacity: 0 })
        gsap.set('.hero-subtitle', { opacity: 0, y: 20 })
        gsap.set('.hero-cta', { opacity: 0, y: 15 })

        gsap.set(introRef.current, { opacity: 0, y: 15 })

        const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        introTl
          .to(introRef.current, { opacity: 1, y: 0, duration: 0.8 })
          .to(introRef.current, { opacity: 0, y: -20, duration: 1, ease: 'power2.inOut' }, '+=2.5')

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.3 })

        tl.to('.hero-avatar', { opacity: 1, y: 0, scale: 1, duration: 1.4 }, 0.4)
          .to('.hero-logo', { opacity: 1, y: 0, scale: 1, duration: 1.6 }, 0.6)
          .to('.hero-tagline', { opacity: 1, x: 0, y: 0, skewX: 0, duration: 1.2 }, 0.9)
          .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1.2 }, 1.8)
          .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 2.2)

        animations.splitTextReveal('.hero-name', { type: 'chars', stagger: 0.025, duration: 0.7, delay: 1.2 })

        if (containerRef.current) {
          const scrollTl = gsap.timeline({
            scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 2, invalidateOnRefresh: true },
          })
          scrollTl.to(containerRef.current, { yPercent: 12, scale: 0.97, opacity: 0.9, ease: 'none' }, 0)
            .to(glowRef.current, { scale: 1.4, yPercent: -15, ease: 'none' }, 0)
            .to(accentGlowRef.current, { scale: 1.5, yPercent: -10, ease: 'none' }, 0)
            .to('.hero-name', { yPercent: -25, opacity: 0.5, scale: 1.05, ease: 'none' }, 0)
            .to('.hero-subtitle', { yPercent: -30, opacity: 0.2, ease: 'none' }, 0)
            .to('.hero-tagline', { yPercent: -35, opacity: 0.15, ease: 'none' }, 0)
        }
      }

      if (glowRef.current && accentGlowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.15, opacity: 0.7, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
        gsap.to(glowRef.current, {
          x: 30, y: -20, duration: 10, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
        gsap.to(accentGlowRef.current, {
          scale: 1.2, opacity: 0.6, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
        gsap.to(accentGlowRef.current, {
          x: -20, y: 25, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
      }

      const container = containerRef.current
      if (!isMobile && container && mouseGlowRef.current) {
        const handleMouse = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(mouseGlowRef.current, { x, y, duration: 1.2, ease: 'power2.out', overwrite: 'auto' })
        }
        container.addEventListener('mousemove', handleMouse, { passive: true })
        ctx.add(() => container.removeEventListener('mousemove', handleMouse))
      }

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          if (!containerRef.current) return
          const idleCtx = gsap.context(() => {}, containerRef)
          const cleanMouse = animations.mouseParallax('.hero-avatar', 0.12)
          if (typeof cleanMouse === 'function') idleCtx.add(cleanMouse)
          idleCtxRef.current = idleCtx
        }, { timeout: 2000 })
      }
    }, containerRef)

    return () => {
      ctx.revert()
      if (idleCtxRef.current) { idleCtxRef.current.revert(); idleCtxRef.current = null }
    }
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20 will-change-transform">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C1512] via-[#1A1410] to-[#0F0D0A] pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
      }} />

      <div
        ref={glowRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-500/15 via-amber-500/8 to-transparent pointer-events-none rounded-full will-change-transform"
      />

      <div
        ref={accentGlowRef}
        className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-amber-400/8 via-amber-400/4 to-transparent pointer-events-none rounded-full will-change-transform"
      />

      <div
        ref={mouseGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-amber-400/10 via-amber-400/5 to-transparent pointer-events-none rounded-full will-change-transform"
      />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div
          ref={introRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-amber-400">
            Arch. Mohamed Moussa
          </span>
        </div>

        <div className="hero-avatar mb-8 inline-block">
          <a href="#founder" className="group flex items-center gap-3 border border-white/10 hover:border-amber-500/50 px-4 py-2 rounded-full transition-all duration-300">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 relative shrink-0">
              <Image
                src="/images/mohamed-moussa.jpg"
                alt="Arch. Mohamed Moussa"
                fill
                sizes="40px"
                priority
                decoding="async"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="text-left pr-2">
              <p className="text-[11px] text-white font-serif tracking-wide">Arch. Mohamed Moussa</p>
              <p className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">Founder & Creative Director</p>
            </div>
          </a>
        </div>

        <div className="hero-logo font-serif text-xl md:text-2xl tracking-[0.15em] text-white mb-6 whitespace-nowrap">
          Arch. Mohamed Moussa
        </div>

        <p className="hero-tagline bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent tracking-[0.35em] text-xs md:text-sm mb-6 uppercase font-mono">
          Luxury Architecture & Interior Design
        </p>

        <h1 className="hero-name font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white/95 mb-8 leading-none tracking-tight" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
          Arch. Mohamed Moussa
        </h1>

        <p className="hero-subtitle text-white/75 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Creating timeless spaces through architecture, emotion and precision across Egypt and the Middle East.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#projects"
            className="hero-cta relative overflow-hidden group px-8 py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase rounded-xs hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
          >
            <span className="relative z-10">Explore Selected Works</span>
            <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#founder"
            className="hero-cta relative overflow-hidden group px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase rounded-xs hover:border-amber-500/60 hover:bg-white/[0.06] transition-all duration-300"
          >
            <span className="relative z-10">The Founder</span>
            <span className="absolute inset-0 bg-white/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6">
          <div className="flex items-center justify-center gap-8 md:gap-14 text-white/30 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase">
            <span className="flex items-center gap-2">
              <span className="text-amber-400/60 font-medium">+15</span>
              <span>Years Experience</span>
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <span className="text-amber-400/60 font-medium">50+</span>
              <span>Iconic Projects</span>
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <span className="text-amber-400/60 font-medium">EG · UAE</span>
              <span className="hidden md:inline">Egypt &amp; Middle East</span>
              <span className="md:hidden">Regional</span>
            </span>
            <span className="hidden sm:block w-[1px] h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <span className="text-amber-400/60 font-medium">Luxury</span>
              <span className="hidden md:inline">Residential &amp; Commercial</span>
              <span className="md:hidden">Architecture</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Hero)
