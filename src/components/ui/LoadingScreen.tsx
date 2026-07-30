'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const barCtx = gsap.context(() => {
      gsap.fromTo('.loading-bar', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', force3D: true })
    }, containerRef)

    const hide = () => {
      if (!isMounted) return
      barCtx.revert()
      const exitCtx = gsap.context(() => {
        gsap.timeline()
          .to('.loading-text', { opacity: 0, y: -10, duration: 0.3, force3D: true })
          .to('.loading-bar-container', { scaleY: 0, transformOrigin: 'bottom center', duration: 0.5, ease: 'power4.inOut', force3D: true }, '-=0.1')
          .to('.loading-screen', { yPercent: -100, duration: 0.8, ease: 'power4.inOut', force3D: true }, '-=0.3')
          .set('.loading-screen', { visibility: 'hidden', pointerEvents: 'none', yPercent: -100 })
      }, containerRef)
      return () => exitCtx.revert()
    }

    const readyPromises: Promise<void>[] = []

    readyPromises.push(document.fonts.ready.then(() => {}))

    readyPromises.push(new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = '/images/mohamed-moussa.jpg'
      img.decode().then(() => resolve()).catch(() => resolve())
    }))

    const safety = setTimeout(() => {
      if (isMounted) hide()
    }, 8000)

    Promise.allSettled(readyPromises).then(() => {
      clearTimeout(safety)
      if (isMounted) {
        requestAnimationFrame(() => hide())
      }
    })

    return () => { isMounted = false; barCtx.revert() }
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
