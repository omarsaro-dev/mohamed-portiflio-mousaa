'use client'

import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-text/30 rounded-full pointer-events-none z-50 transition-transform duration-150 ease-out hidden md:block"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div
        className="fixed top-0 left-0 w-1 h-1 bg-text rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  )
}
