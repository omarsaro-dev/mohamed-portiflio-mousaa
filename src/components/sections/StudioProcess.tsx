'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { animations } from '@/lib/animations'

const processSteps = [
  { step: '01', title: 'Discovery', description: 'Understanding vision, requirements, and context' },
  { step: '02', title: 'Concept', description: 'Developing initial concepts and design direction' },
  { step: '03', title: 'Design', description: 'Refining details, materials, and spatial relationships' },
  { step: '04', title: 'Visualization', description: 'Creating photorealistic renders and 3D models' },
  { step: '05', title: 'Execution', description: 'Overseeing construction and implementation' },
  { step: '06', title: 'Reveal', description: 'Final delivery and project completion' },
]

export default function StudioProcess() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      animations.fadeUp('.process-title', 0)
      animations.stagger('.process-step', 0.15)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="process-title font-serif text-4xl md:text-5xl text-text mb-20 text-center">
          Studio Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {processSteps.map((item) => (
            <div key={item.step} className="process-step">
              <div className="text-gold text-4xl font-serif mb-4">{item.step}</div>
              <h3 className="font-serif text-xl text-text mb-3">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
