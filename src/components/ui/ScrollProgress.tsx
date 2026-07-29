'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0,
        },
      })
    }, barRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-white/5">
      <div
        ref={barRef}
        className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
