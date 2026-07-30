'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'

interface MarqueeStripProps {
  text?: string
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

function MarqueeStrip({
  text = 'LUXURY ARCHITECTURE • INTERIOR DESIGN • SPATIAL EXPERIENCE •',
  speed = 40,
  direction = 'left',
  className = '',
}: MarqueeStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current) return
      const doubled = trackRef.current.children
      if (doubled.length < 2) return

      gsap.to([doubled[0], doubled[1]], {
        xPercent: direction === 'left' ? -50 : 50,
        ease: 'none',
        repeat: -1,
        duration: speed,
      })
    }, containerRef.current)

    return () => ctx.revert()
  }, [speed, direction])

  return (
    <div ref={containerRef} className={`overflow-hidden border-y border-white/5 py-5 bg-[#050505] ${className}`}>
      <div ref={trackRef} className="flex whitespace-nowrap">
        <div className="flex-shrink-0 flex items-center gap-8 font-mono text-[10px] md:text-xs tracking-[0.25em] text-white/30 uppercase">
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
        </div>
        <div className="flex-shrink-0 flex items-center gap-8 font-mono text-[10px] md:text-xs tracking-[0.25em] text-white/30 uppercase">
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
          <span>{text}</span>
          <span className="text-amber-500/50">✦</span>
        </div>
      </div>
    </div>
  )
}

export default memo(MarqueeStrip)
