'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { isMobileDevice } from '@/lib/utils'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isMobile = mounted && isMobileDevice()

  useEffect(() => {
    if (!mounted || isMobile) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    gsap.set(follower, { xPercent: -50, yPercent: -50 })

    const mouse = { x: 0, y: 0 }

    const moveCursor = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      gsap.to(cursor, { x: mouse.x, y: mouse.y, duration: 0.08, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(follower, { x: mouse.x, y: mouse.y, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }

    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        gsap.to(cursor, { scale: 1.6, borderColor: 'rgba(251, 191, 36, 0.5)', backgroundColor: 'rgba(251, 191, 36, 0.04)', duration: 0.3, ease: 'power2.out' })
        gsap.to(follower, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(cursor, { scale: 1, borderColor: 'rgba(245, 245, 245, 0.3)', backgroundColor: 'transparent', duration: 0.3, ease: 'power2.out' })
        gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleMouseEnter = () => { gsap.to([cursor, follower], { opacity: 1, duration: 0.3 }) }
    const handleMouseLeave = () => { gsap.to([cursor, follower], { opacity: 0, duration: 0.3 }) }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mousemove', handleLinkHover, { passive: true })
    document.body.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    document.body.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousemove', handleLinkHover)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mounted, isMobile])

  if (!mounted || isMobile) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-7 h-7 border border-[#F5F5F5]/25 rounded-full pointer-events-none z-50 hidden md:block"
        style={{ opacity: 0 }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-1 h-1 bg-amber-400/80 rounded-full pointer-events-none z-50 hidden md:block"
        style={{ opacity: 0 }}
      />
    </>
  )
}
