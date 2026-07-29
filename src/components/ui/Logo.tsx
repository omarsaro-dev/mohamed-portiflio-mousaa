'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Logo() {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.logo-text',
        { opacity: 0, y: -20, rotation: -5 },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.1,
        }
      )
    }, logoRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={logoRef}>
      <span className="logo-text font-serif text-2xl tracking-wider text-[#F5F5F5] inline-block">
        MOUSAA
      </span>
    </div>
  )
}
