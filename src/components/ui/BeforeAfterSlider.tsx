'use client'

import { useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  className?: string
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  className = '',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(50)

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const pct = (x / rect.width) * 100
    setPosition(pct)
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { left: `${pct}%`, duration: 0.05, ease: 'none', overwrite: 'auto' })
    }
  }, [])

  const handleMouseDown = () => setIsDragging(true)

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => { if (isDragging) handleMove(e.clientX) },
    [isDragging, handleMove]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => { handleMove(e.touches[0].clientX) },
    [handleMove]
  )

  const handleTouchEnd = useCallback(() => setIsDragging(false), [])

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden cursor-ew-resize group ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      tabIndex={0}
    >
      <div className="absolute inset-0">
        <Image src={afterSrc} alt={afterAlt} fill className="object-cover" sizes="100vw" priority />
      </div>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" sizes="100vw" priority />
      </div>

      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-[2px] bg-white/80 pointer-events-none z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
            <path d="M8 3L3 8L8 13" />
            <path d="M16 3L21 8L16 13" />
            <path d="M3 16L8 21L13 16" />
            <path d="M11 16L16 21L21 16" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-10">
        <span className="text-[9px] font-mono tracking-wider uppercase text-white/70 bg-black/40 px-2 py-1 rounded-xs">Before</span>
      </div>
      <div className="absolute bottom-3 right-3 z-10">
        <span className="text-[9px] font-mono tracking-wider uppercase text-white/70 bg-black/40 px-2 py-1 rounded-xs">After</span>
      </div>

      {isDragging && (
        <div className="absolute inset-0 z-20" />
      )}
    </div>
  )
}
