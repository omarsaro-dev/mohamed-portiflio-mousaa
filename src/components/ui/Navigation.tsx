'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Logo from './Logo'
import { siteConfig } from '@/config/site'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-link', { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 })
    }, navRef)
    return () => ctx.revert()
  }, [])

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget
    gsap.to(link, { color: '#F5F5F5', duration: 0.3, ease: 'power2.out' })
    const underline = link.querySelector('.nav-underline')
    if (underline) gsap.to(underline, { scaleX: 1, duration: 0.4, ease: 'power3.out' })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget
    gsap.to(link, { color: 'rgba(255,255,255,0.6)', duration: 0.3, ease: 'power2.out' })
    const underline = link.querySelector('.nav-underline')
    if (underline) gsap.to(underline, { scaleX: 0, duration: 0.4, ease: 'power3.out' })
  }

  const links = [
    { href: '#founder', label: 'FOUNDER' },
    { href: '#philosophy', label: 'PHILOSOPHY' },
    { href: '#projects', label: 'PROJECTS' },
    { href: '#contact', label: 'CONTACT' },
  ]

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs tracking-widest text-white/60 font-mono">
            {links.map((link, i) => (
              <a
                key={link.href}
                ref={(el) => { if (el) linksRef.current[i] = el }}
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
            className="nav-link flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xs hover:bg-emerald-600 hover:text-white transition-all"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
