'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsComplete(true),
      })

      tl.fromTo('.loading-bar', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' })
        .to('.loading-text', { opacity: 0, y: -10, duration: 0.3 }, '-=0.3')
        .to('.loading-bar', { scaleY: 0, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4.inOut' }, '-=0.1')
        .to('.loading-screen', { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.4')
        .to('.loading-screen', { display: 'none', duration: 0 }, '-=0.1')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (isComplete) return null

  return (
    <div ref={containerRef}>
      <div className="loading-screen fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-3xl md:text-4xl tracking-[0.35em] text-white/90 mb-12">
            MOUSAA
          </div>
          <div className="w-32 md:w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
            <div className="loading-bar absolute inset-0 bg-amber-400 origin-left" />
          </div>
          <div className="loading-text mt-6 text-[10px] text-amber-400/60 tracking-[0.3em] uppercase font-mono">
            Loading Experience
          </div>
        </div>
      </div>
    </div>
  )
}
