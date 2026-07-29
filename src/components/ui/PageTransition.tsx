'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(
        overlayRef.current,
        { scaleY: 1, transformOrigin: 'top center' },
        { scaleY: 0, duration: 0.8, ease: 'power4.inOut' }
      )
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-amber-500 pointer-events-none"
      />
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
