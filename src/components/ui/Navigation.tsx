'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'
import { siteConfig } from '@/config/site'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs tracking-widest text-white/60 font-mono">
            <a href="#founder" className="hover:text-white transition-colors">FOUNDER</a>
            <a href="#philosophy" className="hover:text-white transition-colors">PHILOSOPHY</a>
            <a href="#projects" className="hover:text-white transition-colors">PROJECTS</a>
            <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
          </div>

          {/* Quick WhatsApp Link in Header */}
          <a 
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xs hover:bg-emerald-600 hover:text-white transition-all"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
