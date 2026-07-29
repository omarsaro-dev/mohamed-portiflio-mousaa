'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { animations } from '@/lib/animations'
import { siteConfig } from '@/config/site'

export default function Founder() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        defaults: { ease: 'power3.out', force3D: true, overwrite: 'auto' },
      })

      tl.fromTo('.founder-tag', { opacity: 0, x: -40, skewX: 5 }, { opacity: 1, x: 0, skewX: 0, duration: 0.8 })
        .fromTo('.founder-text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
        .fromTo('.founder-pillar', { opacity: 0, y: 50, scale: 0.85, rotation: -3 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.9, stagger: 0.12 }, '-=0.4')
        .fromTo('.founder-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.2')

      animations.staggerWords('.founder-title', 0.2, 1.2)

      gsap.fromTo('.founder-image-wrapper', {
        opacity: 0,
        scale: 0.8,
        rotation: -5,
        filter: 'blur(10px)',
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power4.out',
        force3D: true,
        overwrite: 'auto',
        scrollTrigger: {
          trigger: '.founder-image-wrapper',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      })

      animations.imageParallax('.founder-image-wrapper img', 0.25)
      animations.float('.founder-image-wrapper .arch-lines', 4, 4, 1.5)
      animations.mouseParallax('.founder-image-wrapper', 0.1)

      gsap.utils.toArray('.founder-pillar').forEach((p) => {
        if (p instanceof HTMLElement) animations.tilt3d(p, 6)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="founder" ref={containerRef} className="relative min-h-screen py-32 bg-[#060606] overflow-hidden border-b border-white/5">
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="founder-image-wrapper relative aspect-[3/4] min-h-[360px] group rounded-sm overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-neutral-900">
              
              <div className="arch-lines absolute -inset-3 border border-amber-500/15 rounded-sm pointer-events-none opacity-40 group-hover:opacity-100 group-hover:border-amber-500/50 transition-all duration-700" />
              <div className="arch-lines absolute -inset-5 border border-white/5 rounded-sm pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700" />

              <Image
                src="/images/founder-portrait.jpg"
                alt="Arch. Mohamed Moussa"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />

              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] tracking-[0.2em] text-amber-300 uppercase border border-amber-500/30">
                  Principal Architect
                </span>
                <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                  Mousaa Studio
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-amber-400/80 text-[10px] tracking-[0.3em] uppercase mb-1 font-mono">
                  Creative Director
                </p>
                <h3 className="font-serif text-2xl text-white tracking-wide">
                  Arch. Mohamed Moussa
                </h3>
                <p className="text-white/50 text-xs mt-1 font-light italic">
                  &ldquo;Architecture is spatial emotion rendered in solid form.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="founder-tag text-amber-500/90 tracking-[0.3em] text-xs mb-3 uppercase font-mono">
              The Founder & Design Visionary
            </p>

            <h2 className="founder-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5] mb-8 leading-[1.1]">
              Crafting Spaces That Touch The Soul
            </h2>

            <p className="founder-text text-white/70 text-base md:text-lg leading-relaxed mb-6">
              Founded by <span className="text-amber-200 font-medium">Arch. Mohamed Moussa</span>, Mousaa Studio approaches luxury architecture and interior design as an intimate dialogue between light, material, and human sensation.
            </p>

            <p className="founder-text text-white/50 text-base md:text-lg leading-relaxed mb-10">
              Every curve, texture, and illuminated plane is engineered with exacting precision. From private beachfront villas in Alexandria to high-end commercial spaces in Dubai, our signature aesthetic balances warm minimalism with theatrical elegance.
            </p>

            <div className="founder-pillars grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 pt-6 border-t border-white/10">
              <div className="founder-pillar p-4 bg-white/[0.02] border border-white/5 rounded-xs hover:bg-white/[0.04] hover:border-amber-500/20 transition-all duration-300">
                <span className="text-amber-400 font-mono text-xs block mb-1">01 / GEOMETRY</span>
                <h4 className="font-serif text-white text-sm mb-1">Sculptural Form</h4>
                <p className="text-white/40 text-xs">Organic arches & soft fluid contours</p>
              </div>

              <div className="founder-pillar p-4 bg-white/[0.02] border border-white/5 rounded-xs hover:bg-white/[0.04] hover:border-amber-500/20 transition-all duration-300">
                <span className="text-amber-400 font-mono text-xs block mb-1">02 / ATMOSPHERE</span>
                <h4 className="font-serif text-white text-sm mb-1">Chiaroscuro Light</h4>
                <p className="text-white/40 text-xs">Indirect backlit marble & layered glow</p>
              </div>

              <div className="founder-pillar p-4 bg-white/[0.02] border border-white/5 rounded-xs hover:bg-white/[0.04] hover:border-amber-500/20 transition-all duration-300">
                <span className="text-amber-400 font-mono text-xs block mb-1">03 / MATERIALITY</span>
                <h4 className="font-serif text-white text-sm mb-1">Earthy Luxury</h4>
                <p className="text-white/40 text-xs">Rare onyx, bouclé & micro-plaster</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="founder-cta inline-flex items-center gap-3 px-6 py-3.5 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase hover:bg-amber-400 transition-all duration-300 rounded-xs shadow-lg shadow-amber-950/20"
              >
                <span>💬</span> Connect With Mohamed Moussa
              </a>

              <a
                href="#projects"
                className="founder-cta inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-amber-500/50 hover:text-amber-200 transition-all duration-300 rounded-xs"
              >
                View Selected Works →
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
