'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { force3D: true, ease: 'power4.inOut' } })
      tl.set(overlayRef.current, { scaleY: 1, transformOrigin: 'top center' })
        .to(overlayRef.current, { scaleY: 0, duration: 0.8 }, '+=0.05')
        .fromTo(contentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative">
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-amber-500 pointer-events-none"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
      />
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
