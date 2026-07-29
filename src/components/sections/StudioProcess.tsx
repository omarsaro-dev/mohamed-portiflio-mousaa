'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations } from '@/lib/animations'

const processSteps = [
  { step: '01', title: 'Discovery', description: 'Understanding vision, requirements, and context', icon: '○' },
  { step: '02', title: 'Concept', description: 'Developing initial concepts and design direction', icon: '△' },
  { step: '03', title: 'Design', description: 'Refining details, materials, and spatial relationships', icon: '◇' },
  { step: '04', title: 'Visualization', description: 'Creating photorealistic renders and 3D models', icon: '◎' },
  { step: '05', title: 'Execution', description: 'Overseeing construction and implementation', icon: '□' },
  { step: '06', title: 'Reveal', description: 'Final delivery and project completion', icon: '✦' },
]

export default function StudioProcess() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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

      tl.fromTo('.process-title', { opacity: 0, y: 50, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 })
        .fromTo('.process-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.process-step', { opacity: 0, y: 60, rotateX: -15, scale: 0.9 }, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1, stagger: 0.15 }, '-=0.4')

      gsap.utils.toArray('.step-number').forEach((el) => {
        if (el instanceof HTMLElement) {
          const target = parseInt(el.textContent || '0', 10)
          el.textContent = '0'
          animations.counter(el, 0, target, 1.2, 0)
        }
      })

      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'left center' }, {
          scaleX: 1,
          duration: 2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      gsap.utils.toArray('.process-step').forEach((step) => {
        if (step instanceof HTMLElement) {
          step.addEventListener('mouseenter', () => {
            gsap.to(step.querySelector('.step-icon'), { scale: 1.2, color: '#fbbf24', duration: 0.3, ease: 'power2.out', force3D: true })
            gsap.to(step.querySelector('.step-number'), { color: '#fbbf24', duration: 0.3, ease: 'power2.out', force3D: true })
          })
          step.addEventListener('mouseleave', () => {
            gsap.to(step.querySelector('.step-icon'), { scale: 1, color: 'rgba(251, 191, 36, 0.8)', duration: 0.3, ease: 'power2.out', force3D: true })
            gsap.to(step.querySelector('.step-number'), { color: 'rgba(251, 191, 36, 0.6)', duration: 0.3, ease: 'power2.out', force3D: true })
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-32 bg-[#070707] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="process-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5] mb-4 text-center">
          Studio Process
        </h2>
        <p className="process-desc text-white/50 text-center max-w-2xl mx-auto mb-20 text-sm md:text-base leading-relaxed">
          From initial discovery to final reveal, each phase is meticulously orchestrated to ensure architectural excellence.
        </p>

        <div ref={lineRef} className="hidden lg:block h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((item) => (
            <div key={item.step} className="process-step group relative p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-amber-500/20 hover:bg-white/[0.04] transition-all duration-500">
              <div className="flex items-center gap-4 mb-4">
                <span className="step-icon text-amber-400/80 text-2xl transition-all duration-300">{item.icon}</span>
                <span className="step-number text-amber-400/60 font-mono text-xs tracking-widest">{item.step}</span>
              </div>
              <h3 className="font-serif text-xl text-[#F5F5F5] mb-3">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
