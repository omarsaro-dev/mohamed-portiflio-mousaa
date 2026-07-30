'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function hardHide() {
  try {
    const el = document.querySelector('.loading-screen') as HTMLElement | null
    if (el && getComputedStyle(el).visibility !== 'hidden') {
      el.style.transition = 'transform 0.5s ease, opacity 0.3s ease'
      el.style.transform = 'translateY(-100%)'
      el.style.opacity = '0'
      setTimeout(() => {
        el.style.visibility = 'hidden'
        el.style.pointerEvents = 'none'
      }, 600)
    }
  } catch {}
}

function withFallback<T>(promise: Promise<T>, ms: number, label: string): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`[LoadingScreen] ${label} timed out (${ms}ms), continuing`)
      resolve()
    }, ms)
    promise
      .then(() => { clearTimeout(timer); resolve() })
      .catch((err) => { clearTimeout(timer); console.error(`[LoadingScreen] ${label} failed:`, err); resolve() })
  })
}

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const barCtx = gsap.context(() => {
      gsap.fromTo('.loading-bar', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', force3D: true })
    }, containerRef)

    function hideLoader() {
      if (!isMounted) return
      barCtx.revert()
      try {
        const exitCtx = gsap.context(() => {
          gsap.timeline()
            .to('.loading-text', { opacity: 0, y: -10, duration: 0.3, force3D: true })
            .to('.loading-bar-container', { scaleY: 0, transformOrigin: 'bottom center', duration: 0.5, ease: 'power4.inOut', force3D: true }, '-=0.1')
            .to('.loading-screen', { yPercent: -100, duration: 0.8, ease: 'power4.inOut', force3D: true }, '-=0.3')
            .set('.loading-screen', { visibility: 'hidden', pointerEvents: 'none', yPercent: -100 })
        }, containerRef)
        return () => exitCtx.revert()
      } catch (e) {
        console.error('[LoadingScreen] GSAP exit failed, using CSS fallback:', e)
        hardHide()
      }
    }

    const checks: Promise<void>[] = []

    checks.push(
      withFallback(document.fonts.ready, 1500, 'document.fonts.ready')
    )

    checks.push(
      withFallback(new Promise<void>((resolve) => {
        const img = new Image()
        img.src = '/images/mohamed-moussa.jpg'
        if (typeof img.decode === 'function') {
          img.decode().then(() => resolve()).catch(() => { console.warn('[LoadingScreen] img.decode failed, continuing'); resolve() })
        } else {
          let done = false
          img.onload = () => { if (!done) { done = true; resolve() } }
          img.onerror = () => { if (!done) { done = true; console.warn('[LoadingScreen] img onerror, continuing'); resolve() } }
          if (img.complete) resolve()
        }
      }), 2000, 'hero image decode')
    )

    const safety = setTimeout(() => {
      console.warn('[LoadingScreen] Safety timeout (3s) — forcing hide')
      if (isMounted) hideLoader()
    }, 3000)

    Promise.allSettled(checks).then(() => {
      clearTimeout(safety)
      if (isMounted) {
        requestAnimationFrame(() => hideLoader())
      }
    }).catch((err) => {
      console.error('[LoadingScreen] Unexpected error:', err)
      clearTimeout(safety)
      hardHide()
    })

    return () => { isMounted = false; barCtx.revert(); hardHide() }
  }, [])

  return (
    <div ref={containerRef} className="loading-screen fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-3xl md:text-4xl tracking-[0.35em] text-white/90 mb-12">
          MOUSAA
        </div>
        <div className="loading-bar-container w-32 md:w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <div className="loading-bar absolute inset-0 bg-amber-400 origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
        <div className="loading-text mt-6 text-[10px] text-amber-400/60 tracking-[0.3em] uppercase font-mono">
          Loading Experience
        </div>
      </div>
    </div>
  )
}
