'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedDividerProps {
  variant?: 'line' | 'double' | 'diamond' | 'ornate'
  className?: string
}

export default function AnimatedDivider({ variant = 'line', className = '' }: AnimatedDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (variant === 'double') {
    return (
      <div ref={containerRef} className={`py-8 flex flex-col items-center gap-2 ${className}`}>
        <div ref={lineRef} className="h-[1px] w-32 md:w-48 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent origin-left" />
        <div className="w-2 h-2 rotate-45 border border-amber-500/40" />
        <div className="h-[1px] w-20 md:w-32 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>
    )
  }

  if (variant === 'diamond') {
    return (
      <div ref={containerRef} className={`py-8 flex items-center justify-center gap-4 ${className}`}>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div ref={lineRef} className="w-3 h-3 rotate-45 bg-amber-500/30 border border-amber-500/50 origin-center" style={{ scale: 0 }} />
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    )
  }

  if (variant === 'ornate') {
    return (
      <div ref={containerRef} className={`py-8 flex items-center justify-center gap-6 ${className}`}>
        <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-amber-500/30" />
        <div ref={lineRef} className="flex items-center gap-3 text-amber-500/30 font-serif text-lg origin-center" style={{ scale: 0 }}>
          <span>◇</span>
          <span className="w-2 h-2 bg-amber-500/40 rotate-45 inline-block" />
          <span>◇</span>
        </div>
        <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-amber-500/30 to-transparent" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`py-8 flex justify-center ${className}`}>
      <div ref={lineRef} className="h-[1px] w-24 md:w-40 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent origin-left" />
    </div>
  )
}
