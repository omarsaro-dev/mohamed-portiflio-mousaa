'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouchOrMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    if (isTouchOrMobile) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    gsap.set(follower, { xPercent: -50, yPercent: -50 })

    const mouse = { x: 0, y: 0 }

    const moveCursor = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      gsap.to(cursor, { x: mouse.x, y: mouse.y, duration: 0.1, ease: 'power2.out' })
      gsap.to(follower, { x: mouse.x, y: mouse.y, duration: 0.4, ease: 'power2.out' })
    }

    const handleMouseEnter = () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.3 })
    }

    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        gsap.to(cursor, { scale: 1.8, borderColor: 'rgba(251, 191, 36, 0.6)', duration: 0.3, ease: 'power2.out' })
        gsap.to(follower, { scale: 0, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(cursor, { scale: 1, borderColor: 'rgba(245, 245, 245, 0.3)', duration: 0.3, ease: 'power2.out' })
        gsap.to(follower, { scale: 1, duration: 0.3, ease: 'power2.out' })
      }
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mousemove', handleLinkHover, { passive: true })
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousemove', handleLinkHover)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[#F5F5F5]/30 rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ opacity: 0 }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-2 h-2 bg-amber-400/80 rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ opacity: 0 }}
      />
    </>
  )
}
