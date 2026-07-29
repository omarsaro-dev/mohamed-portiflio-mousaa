'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('.loading-bar', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', force3D: true })
        .to('.loading-text', { opacity: 0, y: -10, duration: 0.3, force3D: true }, '-=0.3')
        .to('.loading-bar-container', { scaleY: 0, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4.inOut', force3D: true }, '-=0.1')
        .to('.loading-screen', { yPercent: -100, duration: 1, ease: 'power4.inOut', force3D: true }, '-=0.4')
        .set('.loading-screen', { visibility: 'hidden', pointerEvents: 'none', yPercent: -100 })
    }, containerRef)

    const fallback = setTimeout(() => {
      hideLoadingScreen()
    }, 5000)

    const originalHandler = window.onerror
    window.onerror = function () {
      hideLoadingScreen()
      if (originalHandler) return originalHandler.apply(window, arguments as any)
      return false
    }

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef}>
      <div className="loading-screen fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-3xl md:text-4xl tracking-[0.35em] text-white/90 mb-12">
            MOUSAA
          </div>
          <div className="loading-bar-container w-32 md:w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
            <div className="loading-bar absolute inset-0 bg-amber-400 origin-left" />
          </div>
          <div className="loading-text mt-6 text-[10px] text-amber-400/60 tracking-[0.3em] uppercase font-mono">
            Loading Experience
          </div>
        </div>
      </div>
    </div>
  )
}

function hideLoadingScreen() {
  const el = document.querySelector('.loading-screen') as HTMLElement | null
  if (el && (el.style.visibility !== 'hidden' || getComputedStyle(el).visibility !== 'hidden')) {
    el.style.visibility = 'hidden'
    el.style.pointerEvents = 'none'
    el.style.opacity = '0'
  }
}
