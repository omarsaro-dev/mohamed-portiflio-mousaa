'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INSTAGRAM_PROFILE } from '@/config/instagram'
import { prefersReducedMotion } from '@/lib/utils'
import InstagramIcon from './InstagramIcon'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FloatingInstagram() {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const anchor = anchorRef.current
    const icon = iconRef.current
    if (!anchor) return

    const ctx = gsap.context(() => {
      gsap.set(anchor, { opacity: 0, y: 40, scale: 0.8 })

      const show = () => gsap.to(anchor, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', force3D: true })
      const hide = () => gsap.to(anchor, { opacity: 0, y: 40, scale: 0.8, duration: 0.4, ease: 'power2.in', force3D: true })

      ScrollTrigger.create({
        trigger: '#instagram',
        start: 'top 88%',
        end: 'bottom 15%',
        onEnter: show,
        onLeave: hide,
        onEnterBack: show,
        onLeaveBack: hide,
      })

      if (!prefersReducedMotion()) {
        gsap.to(anchor, { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 })
      }

      if (icon) {
        return attachMagnetic(icon)
      }
    }, anchor)

    return () => ctx.revert()
  }, [])

  return (
    <a
      ref={anchorRef}
      href={INSTAGRAM_PROFILE.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow Arch. Mohamed Moussa on Instagram"
      className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-black/60 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.15)] backdrop-blur-md transition-[box-shadow,color,border-color] duration-300 hover:border-amber-400/70 hover:text-amber-200 hover:shadow-[0_0_44px_rgba(251,191,36,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2 md:bottom-8 md:left-8 md:h-14 md:w-14"
    >
      <span ref={iconRef} className="flex items-center justify-center">
        <InstagramIcon size={22} className="md:hidden" />
        <InstagramIcon size={26} className="hidden md:block" />
      </span>
    </a>
  )
}

// Local magnetic helper (avoid pulling the full animations module into every mount).
function attachMagnetic(element: HTMLElement, strength = 0.3) {
  if (typeof window === 'undefined') return () => {}
  const isMobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isMobile) return () => {}

  const onMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(element, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out', force3D: true })
  }
  const onLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', force3D: true })
  }
  element.addEventListener('mousemove', onMove, { passive: true })
  element.addEventListener('mouseleave', onLeave, { passive: true })
  return () => {
    element.removeEventListener('mousemove', onMove)
    element.removeEventListener('mouseleave', onLeave)
  }
}
