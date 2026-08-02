'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`

function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.hero-label, .hero-title, .hero-desc, .hero-cta, .hero-portrait', { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.set('.hero-label', { opacity: 0, y: 20 })
      gsap.set('.hero-title', { opacity: 0, y: 44 })
      gsap.set('.hero-desc', { opacity: 0, y: 28 })
      gsap.set('.hero-cta', { opacity: 0, y: 16 })
      gsap.set('.hero-portrait', { opacity: 0, scale: 1.08 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.4 })
      tl.to('.hero-portrait', { opacity: 1, scale: 1, duration: 2.6, ease: 'power2.out' }, 0.1)
        .to('.hero-label', { opacity: 1, y: 0, duration: 0.9 }, 0.3)
        .to('.hero-title', { opacity: 1, y: 0, duration: 1.1 }, 0.5)
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.9 }, 0.85)
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.05)

      if (!isMobile) {
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top top', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
        })
        scrollTl
          .to('.hero-portrait', { yPercent: -8, ease: 'none' }, 0)
          .to('.hero-copy', { yPercent: 4, opacity: 0.5, ease: 'none' }, 0)

        const portrait = container.querySelector<HTMLElement>('.hero-portrait')
        if (portrait) {
          const handleMouse = (e: MouseEvent) => {
            const rect = portrait.getBoundingClientRect()
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.02
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.02
            gsap.to(portrait, { x: dx, y: dy, duration: 1.4, ease: 'power2.out', overwrite: 'auto' })
          }
          document.addEventListener('mousemove', handleMouse, { passive: true })
          return () => document.removeEventListener('mousemove', handleMouse)
        }
      }
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0A08] pt-28 pb-20 lg:pt-24 lg:pb-24">
      {/* Layer 1 — very dark base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#12100B] via-[#0B0A08] to-[#070605] pointer-events-none" aria-hidden />

      {/* Layer 2 — founder portrait, art-directed as the background centrepiece */}
      <div className="hero-portrait absolute top-0 right-0 w-full h-[70vh] lg:h-auto lg:inset-y-0 lg:w-[56%] lg:right-[-1%] will-change-transform">
        <Image
          src="/images/founder-portrait.jpg"
          alt="Arch. Mohamed Moussa — Founder & Creative Director"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          quality={90}
          className="object-cover"
          style={{ objectPosition: '50% 22%' }}
        />
      </div>

      {/* Layer 3 — cinematic black gradient, darker on the left for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/70 to-[#050505]/45 lg:from-[#050505]/95 lg:via-[#050505]/50 lg:to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" aria-hidden />
      {/* warm bronze undertone */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#241707]/40 via-transparent to-transparent pointer-events-none" aria-hidden />

      {/* Layer 4 — very subtle film grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} aria-hidden />

      <div className="hero-copy relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center lg:items-start text-center lg:text-left">
        <p className="hero-label font-mono text-[11px] md:text-xs tracking-[0.34em] uppercase text-[#C9A962]">
          Luxury Architecture &amp; Interior Design
        </p>

        <h1 className="hero-title font-serif text-[2.7rem] leading-[1.04] tracking-tight text-white sm:text-6xl xl:text-[4.6rem] mt-7 max-w-lg">
          Arch. Mohamed
          <br />
          Moussa
        </h1>

        <p className="hero-desc text-white/70 text-base md:text-lg leading-relaxed max-w-md mt-7 text-pretty">
          Creating timeless spaces through architecture, emotion and precision across Egypt and the Middle East.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 md:gap-5">
          <a
            href="#projects"
            className="hero-cta inline-flex items-center gap-3 px-9 py-4 bg-[#C9A962] text-[#0B0A09] text-[11px] md:text-xs tracking-[0.22em] uppercase font-mono font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] hover:bg-[#D8B878]"
          >
            Explore Selected Works
          </a>
          <a
            href="#founder"
            className="hero-cta inline-flex items-center gap-3 px-9 py-4 border border-white/25 text-white/80 text-[11px] md:text-xs tracking-[0.22em] uppercase font-mono transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] hover:border-white/70 hover:text-white"
          >
            The Founder
          </a>
        </div>
      </div>
    </section>
  )
}

export default memo(Hero)
