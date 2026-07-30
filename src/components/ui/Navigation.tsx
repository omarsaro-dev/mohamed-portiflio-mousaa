'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import Logo from './Logo'
import { siteConfig } from '@/config/site'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const lastScrollRef = useRef(0)
  const isHiddenRef = useRef(false)
  const tickingRef = useRef(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY
          const isScrolled = currentScroll > 50
          setScrolled(isScrolled)

          if (isScrolled && currentScroll > 200) {
            if (currentScroll > lastScrollRef.current) {
              if (!isHiddenRef.current) {
                isHiddenRef.current = true
                gsap.to(nav, { yPercent: -110, duration: 0.5, ease: 'power3.in', force3D: true })
              }
            } else {
              if (isHiddenRef.current) {
                isHiddenRef.current = false
                gsap.to(nav, { yPercent: 0, duration: 0.6, ease: 'power4.out', force3D: true })
              }
            }
          } else if (isHiddenRef.current) {
            isHiddenRef.current = false
            gsap.to(nav, { yPercent: 0, duration: 0.5, ease: 'power3.out', force3D: true })
          }

          lastScrollRef.current = currentScroll
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-link', { opacity: 0, y: -15, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.2 })
    }, navRef)
    return () => ctx.revert()
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget
    gsap.to(link, { color: '#F5F5F5', duration: 0.3, ease: 'power2.out' })
    const underline = link.querySelector('.nav-underline')
    if (underline) gsap.to(underline, { scaleX: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget
    gsap.to(link, { color: 'rgba(255,255,255,0.6)', duration: 0.3, ease: 'power2.out' })
    const underline = link.querySelector('.nav-underline')
    if (underline) gsap.to(underline, { scaleX: 0, duration: 0.4, ease: 'power3.out' })
  }, [])

  const links = [
    { href: '#founder', label: 'FOUNDER' },
    { href: '#philosophy', label: 'PHILOSOPHY' },
    { href: '#projects', label: 'PROJECTS' },
    { href: '#contact', label: 'CONTACT' },
  ]

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-40 will-change-transform ${scrolled ? 'bg-black/70 backdrop-blur-xl py-4 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs tracking-widest text-white/60 font-mono">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {link.label}
                <span className="nav-underline absolute -bottom-1 left-0 w-full h-[1px] bg-amber-400/80 scale-x-0 origin-left" />
              </a>
            ))}
          </div>

          <a 
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="nav-link flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xs hover:bg-emerald-600 hover:text-white transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
