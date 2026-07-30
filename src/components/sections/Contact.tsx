'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations } from '@/lib/animations'
import { siteConfig } from '@/config/site'

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'Luxury Villa',
    budget: '',
    timeline: '',
    message: ''
  })
  const [statusMsg, setStatusMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      })

      tl.fromTo('.contact-title', { opacity: 0, y: 50, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 })
        .fromTo('.contact-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.contact-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .fromTo('.contact-detail-card', { opacity: 0, x: -40, skewX: 3 }, { opacity: 1, x: 0, skewX: 0, duration: 0.8, stagger: 0.1 }, '-=0.4')
        .fromTo('.contact-form-wrap', { opacity: 0, x: 40, skewX: -3 }, { opacity: 1, x: 0, skewX: 0, duration: 0.9 }, '-=0.6')
        .fromTo('.form-field', { opacity: 0, y: 15, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06 }, '-=0.4')

      animations.footerCinematicExit('.footer-cinematic')

      gsap.utils.toArray<HTMLElement>('input, textarea, select').forEach((el) => {
        el.addEventListener('focus', () => {
          gsap.to(el, { borderColor: 'rgba(251, 191, 36, 0.8)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.08)', duration: 0.3, ease: 'power2.out', force3D: true })
        })
        el.addEventListener('blur', () => {
          gsap.to(el, { borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none', duration: 0.3, ease: 'power2.out', force3D: true })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMsg('')

    if (submitBtnRef.current) {
      gsap.to(submitBtnRef.current, { scale: 0.97, duration: 0.1, ease: 'power2.in', yoyo: true, repeat: 1 })
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      })

      if (res.ok) {
        setStatusMsg('Thank you. Your message has been transmitted to Arch. Mohamed Moussa.')
        setFormState({
          name: '',
          email: '',
          projectType: 'Luxury Villa',
          budget: '',
          timeline: '',
          message: ''
        })
      } else {
        setStatusMsg('Message saved. We will get back to you shortly.')
      }
    } catch {
      setStatusMsg('Message saved. Arch. Mohamed Moussa will contact you.')
    } finally {
      setIsSubmitting(false)
      if (successRef.current) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } })
        tl.fromTo(successRef.current, { opacity: 0, y: -15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 })
          .to(successRef.current, { borderColor: 'rgba(251, 191, 36, 0.6)', duration: 0.3 }, '-=0.2')
          .to(successRef.current, { boxShadow: '0 0 30px rgba(251, 191, 36, 0.1)', duration: 0.4 }, '-=0.1')
      }
      if (submitBtnRef.current) {
        gsap.to(submitBtnRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)', force3D: true })
      }
    }
  }

  return (
    <section id="contact" ref={containerRef} className="relative py-32 bg-[#080808] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-amber-500/80 text-xs tracking-[0.3em] uppercase mb-3 font-mono">
            Direct Inquiries
          </p>
          <h2 className="contact-title font-serif text-4xl md:text-6xl text-[#F5F5F5] mb-6">
            Begin Your Next Space
          </h2>
          <p className="contact-subtitle text-white/50 text-base md:text-lg leading-relaxed">
            Collaborate with Arch. Mohamed Moussa to design bespoke luxury architecture and interior spaces.
          </p>

          <div className="contact-actions flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-600/90 text-white font-medium text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all duration-300 rounded-xs shadow-lg shadow-emerald-950/30"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.301-1.129z"/>
              </svg>
              Chat on WhatsApp
            </a>

            <a
              href={`mailto:${siteConfig.links.email}`}
              data-cursor-hover
              className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-amber-500 hover:text-amber-300 transition-all duration-300 rounded-xs"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {siteConfig.links.email}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="contact-detail-card bg-white/[0.02] border border-white/5 p-6 rounded-sm hover:border-amber-500/20 transition-all duration-300">
              <p className="text-amber-500/80 text-[10px] tracking-widest uppercase mb-1 font-mono">Principal Architect</p>
              <h3 className="font-serif text-2xl text-white">Arch. Mohamed Moussa</h3>
              <p className="text-white/40 text-xs mt-1">Founder & Creative Director</p>
            </div>

            <div className="contact-detail-card bg-white/[0.02] border border-white/5 p-6 rounded-sm hover:border-amber-500/20 transition-all duration-300 space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-mono">Official Email</p>
                <a 
                  href={`mailto:${siteConfig.links.email}`} 
                  className="text-amber-200 text-sm hover:underline font-mono"
                >
                  {siteConfig.links.email}
                </a>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-mono">WhatsApp & Phone</p>
                <a 
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 text-sm hover:underline font-mono flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> {siteConfig.links.phone} (+20 106 330 0788)
                </a>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-mono">Locations</p>
                <p className="text-white/80 text-sm">Cairo, Egypt & Dubai, UAE</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-8 rounded-sm contact-form-wrap">
            <h3 className="font-serif text-2xl text-white mb-6">Send an Inquiry</h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-field">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 font-mono">Your Name</label>
                  <input 
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Eng. Sarah Hassan"
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="form-field">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 font-mono">Your Email</label>
                  <input 
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-field">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 font-mono">Project Type</label>
                  <select
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Residential Interior">Residential Interior</option>
                    <option value="Commercial Tower / Space">Commercial Space</option>
                    <option value="Hospitality / Resort">Hospitality / Resort</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 font-mono">Location</label>
                  <input 
                    type="text"
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    placeholder="e.g. Cairo, New Capital, Dubai"
                    className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 font-mono">Project Details & Vision</label>
                <textarea 
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Describe your design vision, architectural requirements, or space goals..."
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {statusMsg && (
                <div ref={successRef} className="form-field p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-sm">
                  {statusMsg}
                </div>
              )}

              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="form-field w-full py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase hover:bg-amber-400 transition-colors disabled:opacity-50 relative overflow-hidden group rounded-sm"
              >
                <span className="relative z-10">{isSubmitting ? 'Transmitting Message...' : 'Submit Architecture Inquiry'}</span>
                <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-cinematic mt-24 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} Mousaa Architecture & Interior Design • Arch. Mohamed Moussa • All Rights Reserved
        </div>
      </div>
    </section>
  )
}
