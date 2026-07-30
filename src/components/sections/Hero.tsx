'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { animations } from '@/lib/animations'

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

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
          scrollTl.to(containerRef.current, { yPercent: 15, scale: 0.97, opacity: 0.9, ease: 'none' }, 0)
            .to('.hero-name', { yPercent: -20, opacity: 0.6, scale: 1.05, ease: 'none' }, 0)
            .to('.hero-subtitle', { yPercent: -25, opacity: 0.3, ease: 'none' }, 0)
            .to('.hero-tagline', { yPercent: -30, opacity: 0.2, ease: 'none' }, 0)
        }
      }

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          if (!containerRef.current) return
          const idleCtx = gsap.context(() => {
            animations.mouseParallax('.hero-avatar', 0.12)
          }, containerRef)
          return () => idleCtx.revert()
        }, { timeout: 2000 })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20 will-change-transform">
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90" />
      </div>

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
          <a href="#founder" data-cursor-hover className="group flex items-center gap-3 border border-white/10 hover:border-amber-500/50 px-4 py-2 rounded-full transition-all duration-300">
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

        <h1 className="hero-name font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-8 leading-none tracking-tight">
          Arch. Mohamed Moussa
        </h1>

        <p className="hero-subtitle text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Creating timeless spaces through architecture, emotion and precision across Egypt and the Middle East.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#projects"
            data-cursor-hover
            className="hero-cta relative overflow-hidden group px-8 py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase rounded-xs hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
          >
            <span className="relative z-10">Explore Selected Works</span>
            <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#founder"
            data-cursor-hover
            className="hero-cta relative overflow-hidden group px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase rounded-xs hover:border-amber-500/60 hover:bg-white/[0.06] transition-all duration-300"
          >
            <span className="relative z-10">The Founder</span>
            <span className="absolute inset-0 bg-white/8 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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

export default memo(Hero)
