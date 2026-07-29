'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'scale' | 'rotate'
  delay?: number
}

export default function RevealSection({ children, className = '', direction = 'up', delay = 0 }: RevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fromVars: Record<string, any> = {
        up: { opacity: 0, y: 60 },
        left: { opacity: 0, x: 80 },
        right: { opacity: 0, x: -80 },
        scale: { opacity: 0, scale: 0.85 },
        rotate: { opacity: 0, rotation: -6, y: 40 },
      }

      gsap.fromTo(
        containerRef.current,
        fromVars[direction],
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [direction, delay])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
