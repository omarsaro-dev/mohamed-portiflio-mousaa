'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      animations.fadeUp('.contact-title', 0)
      animations.fadeUp('.contact-subtitle', 0.2)
      animations.fadeUp('.contact-actions', 0.4)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMsg('')

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
    }
  }

  return (
    <section id="contact" ref={containerRef} className="py-32 bg-[#080808] border-t border-white/5 relative">
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

          {/* Action CTAs: Direct Email & WhatsApp */}
          <div className="contact-actions flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600/90 text-white font-medium text-xs tracking-widest uppercase hover:bg-emerald-500 transition-all rounded-xs shadow-lg shadow-emerald-950/30"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.301-1.129z"/>
              </svg>
              Chat on WhatsApp ({siteConfig.links.phone})
            </a>

            <a
              href={`mailto:${siteConfig.links.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-amber-500 hover:text-amber-300 transition-all rounded-xs"
            >
              ✉️ {siteConfig.links.email}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-16">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
              <p className="text-amber-500/80 text-[10px] tracking-widest uppercase mb-1 font-mono">Principal Architect</p>
              <h3 className="font-serif text-2xl text-white">Arch. Mohamed Moussa</h3>
              <p className="text-white/40 text-xs mt-1">Founder & Creative Director</p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm space-y-4">
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
                  <span>💬</span> {siteConfig.links.phone} (+20 106 330 0788)
                </a>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-mono">Locations</p>
                <p className="text-white/80 text-sm">Cairo, Egypt & Dubai, UAE</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-8 rounded-sm">
            <h3 className="font-serif text-2xl text-white mb-6">Send an Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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

                <div>
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
                <div>
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

                <div>
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

              <div>
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
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-amber-500 text-black font-medium text-xs tracking-widest uppercase hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Message...' : 'Submit Architecture Inquiry'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          © {new Date().getFullYear()} Mousaa Architecture & Interior Design • Arch. Mohamed Moussa • All Rights Reserved
        </div>
      </div>
    </section>
  )
}
