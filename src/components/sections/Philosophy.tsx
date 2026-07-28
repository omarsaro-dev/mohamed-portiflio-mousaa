'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { animations } from '@/lib/animations'
import { isMobileDevice } from '@/lib/utils'

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobileDevice()) return

    const ctx = gsap.context(() => {
      animations.fadeUp('.philosophy-title', 0)
      animations.stagger('.philosophy-item', 0.15)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="philosophy" ref={containerRef} className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="philosophy-title font-serif text-4xl md:text-5xl text-text mb-20 text-center">
          Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="philosophy-item">
            <div className="text-gold text-5xl font-serif mb-6">01</div>
            <h3 className="font-serif text-2xl text-text mb-4">Architecture</h3>
            <p className="text-muted leading-relaxed">
              Form follows emotion. Every structure tells a story, every space has a purpose.
            </p>
          </div>
          <div className="philosophy-item">
            <div className="text-gold text-5xl font-serif mb-6">02</div>
            <h3 className="font-serif text-2xl text-text mb-4">Materiality</h3>
            <p className="text-muted leading-relaxed">
              Stone, wood, light—materials that breathe life into space, chosen with intention.
            </p>
          </div>
          <div className="philosophy-item">
            <div className="text-gold text-5xl font-serif mb-6">03</div>
            <h3 className="font-serif text-2xl text-text mb-4">Experience</h3>
            <p className="text-muted leading-relaxed">
              Design is felt before it is seen. We create environments that resonate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
