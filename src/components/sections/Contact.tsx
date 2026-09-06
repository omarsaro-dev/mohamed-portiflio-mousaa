'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/utils'
import ProjectInquiryForm from '@/components/contact/ProjectInquiryForm'

function Contact() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = containerRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.contact-eyebrow, .contact-headline, .contact-accent, .contact-lead', {
          opacity: 1,
          y: 0,
        })
        gsap.set('.form-field', { opacity: 1, y: 0 })
        gsap.set('.contact-footer', { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.contact-inner',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out', force3D: true, overwrite: 'auto' },
      })

      tl.fromTo('.contact-eyebrow', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo('.contact-headline', { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.1 }, '-=0.4')
        .fromTo('.contact-accent', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.1 }, '-=0.7')
        .fromTo('.contact-lead', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
        .fromTo(
          '.form-field',
          { opacity: 0, y: 18, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07 },
          '-=0.5'
        )
        .fromTo('.contact-submit', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo(
          '.contact-footer',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.3'
        )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={containerRef} aria-labelledby="contact-title">
      <div className="contact-inner border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-40">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="contact-eyebrow font-mono text-[11px] uppercase tracking-[0.34em] text-amber-400/80">
                Start a Conversation
              </p>

              <h2
                id="contact-title"
                className="contact-headline mt-8 font-serif text-5xl leading-[1.02] tracking-tight text-[#F5F5F5] md:text-6xl xl:text-7xl"
              >
                Tell us what
                <br />
                <span className="contact-accent block italic text-amber-200/90">you&rsquo;re building.</span>
              </h2>

              <p className="contact-lead mt-8 max-w-sm text-base leading-relaxed text-white/55 lg:mt-10">
                Share a few details and we&rsquo;ll help you turn an idea into a plan. Every space
                begins with a conversation.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ProjectInquiryForm />
            </div>
          </div>

          <div className="contact-footer mt-24 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                Studio
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Arch. Mohamed Moussa
                <br />
                Founder &amp; Creative Director
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                Locations
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Cairo, Egypt
                <br />
                Dubai, UAE
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                Direct
              </p>
              <a
                href="mailto:Arch.Mohamed_mousa@yahoo.com"
                className="mt-2 block text-sm text-white/60 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-amber-200 hover:decoration-amber-400/70"
              >
                Arch.Mohamed_mousa@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Contact)