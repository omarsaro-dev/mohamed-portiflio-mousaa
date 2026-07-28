'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  useEffect(() => {
    // Disable Lenis on mobile and touch devices for smooth native touch scrolling
    const isTouchOrMobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    if (isTouchOrMobile) return

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
