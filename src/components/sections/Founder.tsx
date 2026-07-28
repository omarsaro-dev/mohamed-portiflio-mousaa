'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import { animations } from '@/lib/animations'
import { siteConfig } from '@/config/site'
import { isMobileDevice } from '@/lib/utils'

export default function Founder() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobileDevice()) return

    const ctx = gsap.context(() => {
      animations.fadeUp('.founder-tag', 0)
      animations.fadeUp('.founder-title', 0.2)
      animations.fadeUp('.founder-text', 0.4)
      animations.fadeUp('.founder-pillars', 0.6)
      animations.scaleReveal('.founder-image-wrapper', 0.1)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="founder" ref={containerRef} className="min-h-screen py-32 bg-[#060606] relative overflow-hidden border-b border-white/5">
      {/* Background Architectural Ambient Glow (Desktop only for GPU speed) */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Founder Portrait Frame with "Special Sense" Architectural Styling */}
          <div className="lg:col-span-5 relative">
            <div className="founder-image-wrapper relative aspect-[3/4] group rounded-sm overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] bg-neutral-900">
              
              {/* Outer Decorative Architectural Lines */}
              <div className="absolute -inset-2 border border-amber-500/20 rounded-sm pointer-events-none opacity-40 group-hover:opacity-100 group-hover:border-amber-500/50 transition-all duration-700" />

              <Image
                src="/images/founder-portrait.jpg"
                alt="Arch. Mohamed Moussa"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />

              {/* Floating Architectural Badge */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] tracking-[0.2em] text-amber-300 uppercase border border-amber-500/30">
                  Principal Architect
                </span>
                <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                  Mousaa Studio
                </span>
              </div>

              {/* Founder Name & Signature Overlay at Image Bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-amber-400/80 text-[10px] tracking-[0.3em] uppercase mb-1 font-mono">
                  Creative Director
                </p>
                <h3 className="font-serif text-2xl text-white tracking-wide">
                  Arch. Mohamed Moussa
                </h3>
                <p className="text-white/50 text-xs mt-1 font-light italic">
                  "Architecture is spatial emotion rendered in solid form."
                </p>
              </div>
            </div>
          </div>

          {/* Vision & Narrative Content */}
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

            {/* Design Pillars Grid */}
            <div className="founder-pillars grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 pt-6 border-t border-white/10">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="text-amber-400 font-mono text-xs block mb-1">01 / GEOMETRY</span>
                <h4 className="font-serif text-white text-sm mb-1">Sculptural Form</h4>
                <p className="text-white/40 text-xs">Organic arches & soft fluid contours</p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="text-amber-400 font-mono text-xs block mb-1">02 / ATMOSPHERE</span>
                <h4 className="font-serif text-white text-sm mb-1">Chiaroscuro Light</h4>
                <p className="text-white/40 text-xs">Indirect backlit marble & layered glow</p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs">
                <span className="text-amber-400 font-mono text-xs block mb-1">03 / MATERIALITY</span>
                <h4 className="font-serif text-white text-sm mb-1">Earthy Luxury</h4>
                <p className="text-white/40 text-xs">Rare onyx, bouclé & micro-plaster</p>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase hover:bg-amber-400 transition-all rounded-xs shadow-lg shadow-amber-950/20"
              >
                <span>💬</span> Connect With Mohamed Moussa
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-amber-500/50 hover:text-amber-200 transition-all rounded-xs"
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
