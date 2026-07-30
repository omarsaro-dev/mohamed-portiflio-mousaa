'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations } from '@/lib/animations'

function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out', force3D: true, overwrite: 'auto' },
      })

      tl.fromTo('.philosophy-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 })
        .fromTo('.philosophy-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.philosophy-item', { opacity: 0, y: 60, rotateY: -15, scale: 0.9 }, { opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 1.2, stagger: 0.2 }, '-=0.4')

      animations.counterFormatted('.philosophy-counter-1', 0, 15, '', '+', 1.5)
      animations.counterFormatted('.philosophy-counter-2', 0, 200, '', '+', 1.5)
      animations.counterFormatted('.philosophy-counter-3', 0, 50, '', '+', 1.5)

      gsap.utils.toArray('.philosophy-number').forEach((num) => {
        if (num instanceof HTMLElement) {
          animations.outlineNumberScroll(num)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="philosophy" ref={containerRef} className="relative py-32 bg-[#070707] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="philosophy-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5] mb-4 text-center">
          Philosophy
        </h2>
        <p className="philosophy-desc text-white/50 text-center max-w-2xl mx-auto mb-20 text-sm md:text-base leading-relaxed">
          Every space tells a story. Our design philosophy is rooted in the belief that architecture is not just about structure, but about the emotions and experiences it evokes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="philosophy-item group text-center md:text-left p-6 bg-white/[0.01] border border-white/[0.03] rounded-sm hover:bg-white/[0.02] transition-all duration-500 will-change-transform">
            <div className="philosophy-number text-amber-400/80 text-6xl font-serif mb-4 group-hover:text-amber-300 transition-colors duration-500">01</div>
            <h3 className="font-serif text-2xl text-[#F5F5F5] mb-4">Architecture</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Form follows emotion. Every structure tells a story, every space has a purpose.
            </p>
          </div>
          <div className="philosophy-item group text-center md:text-left p-6 bg-white/[0.01] border border-white/[0.03] rounded-sm hover:bg-white/[0.02] transition-all duration-500 will-change-transform">
            <div className="philosophy-number text-amber-400/80 text-6xl font-serif mb-4 group-hover:text-amber-300 transition-colors duration-500">02</div>
            <h3 className="font-serif text-2xl text-[#F5F5F5] mb-4">Materiality</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Stone, wood, light—materials that breathe life into space, chosen with intention.
            </p>
          </div>
          <div className="philosophy-item group text-center md:text-left p-6 bg-white/[0.01] border border-white/[0.03] rounded-sm hover:bg-white/[0.02] transition-all duration-500 will-change-transform">
            <div className="philosophy-number text-amber-400/80 text-6xl font-serif mb-4 group-hover:text-amber-300 transition-colors duration-500">03</div>
            <h3 className="font-serif text-2xl text-[#F5F5F5] mb-4">Experience</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Design is felt before it is seen. We create environments that resonate.
            </p>
          </div>
        </div>

        <div className="philosophy-stats mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
          <div className="text-center">
            <span className="philosophy-counter-1 text-5xl md:text-6xl font-serif text-amber-400">0</span>
            <p className="text-white/40 text-sm mt-2 font-mono tracking-widest uppercase">Years of Excellence</p>
          </div>
          <div className="text-center">
            <span className="philosophy-counter-2 text-5xl md:text-6xl font-serif text-amber-400">0</span>
            <p className="text-white/40 text-sm mt-2 font-mono tracking-widest uppercase">Projects Delivered</p>
          </div>
          <div className="text-center">
            <span className="philosophy-counter-3 text-5xl md:text-6xl font-serif text-amber-400">0</span>
            <p className="text-white/40 text-sm mt-2 font-mono tracking-widest uppercase">Premium Materials</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Philosophy)
