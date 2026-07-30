'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { animations } from '@/lib/animations'

const materials = [
  {
    name: 'Emerald Onyx',
    subtitle: 'Natural Veining & Illuminated Marble',
    description: 'Selected from rare stone quarries, illuminated onyx features striking green, gold, and white veining that elevates living room display units and bespoke accent walls into artistic masterpieces.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80&fit=crop',
    tag: 'RARE STONE'
  },
  {
    name: 'Travertine & Plaster',
    subtitle: 'Raw Texture & Earthy Elegance',
    description: 'Combining tactile plaster techniques with natural beige travertine tiles to reflect natural ambient light softly across dining and reception spaces.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80&fit=crop',
    tag: 'TACTILE FINISHES'
  },
  {
    name: 'Warm Oak & Walnut',
    subtitle: 'Organic Warmth & Precision Joinery',
    description: 'Precision architectural wall paneling and custom dining tables finished in matte oils, infusing natural warmth into contemporary minimalist architecture.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&fit=crop',
    tag: 'ARCHITECTURAL TIMBER'
  },
  {
    name: 'Bouclé & Linen',
    subtitle: 'Sculptural Upholstery & Softness',
    description: 'Curved organic lounge sofas and dining seating wrapped in premium textured bouclé and linen fabrics for maximum comfort and sophisticated tactile luxury.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&fit=crop',
    tag: 'TEXTILE LUXURY'
  },
  {
    name: 'Sculptural Lighting',
    subtitle: 'Bespoke Ambient Illumination',
    description: 'Custom pendant chandeliers and integrated warm LED strip channels designed to create dramatic spatial depth and intimate evening atmospheres.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&fit=crop',
    tag: 'LIGHTING DESIGN'
  },
  {
    name: 'Botanical Plaster',
    subtitle: 'Organic Fiber-Infused Texture',
    description: 'Hand-applied natural plaster blended with dried botanical fibers, creating a warm earthy surface that breathes life into walls. The subtle organic speckle and fiber veins catch light softly, evoking the raw beauty of ancient earthen architecture.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80&fit=crop',
    tag: 'NATURAL TEXTURES'
  },
  {
    name: 'Living Wall',
    subtitle: 'Biophilic Vertical Garden',
    description: 'A thriving vertical ecosystem of cascading greenery, moss, and ferns integrated into architectural surfaces. This living texture purifies the air while creating a stunning visual dialogue between built form and nature\'s untamed elegance.',
    image: '/images/generated/living-wall.svg',
    tag: 'BIOPHILIC DESIGN'
  }
]

function MaterialExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeMaterial, setActiveMaterial] = useState(materials[0])
  const imageRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const prevMaterial = useRef(materials[0])

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

      tl.fromTo('.materials-title', { opacity: 0, y: 50, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 })
        .fromTo('.materials-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6')
        .fromTo('.material-btn', { opacity: 0, x: -40, skewX: 3 }, { opacity: 1, x: 0, skewX: 0, duration: 0.7, stagger: 0.08 }, '-=0.4')
        .fromTo('.material-preview', { opacity: 0, scale: 0.9, rotation: -2 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.2 }, '-=0.8')

      animations.parallax('.material-preview img', 0.25)
      animations.scrollZoomImage('.material-preview img', 1.12, 1)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleMaterialChange = (material: typeof materials[0]) => {
    prevMaterial.current = activeMaterial
    setActiveMaterial(material)
  }

  useEffect(() => {
    if (prevMaterial.current !== activeMaterial) {
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.92, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' })
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 })
      }
    }
  }, [activeMaterial])

  return (
    <section ref={containerRef} className="relative py-32 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-amber-500/80 text-xs tracking-[0.3em] uppercase mb-3">Tactile Excellence</p>
          <h2 className="materials-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5]">
            Material Experience
          </h2>
          <p className="materials-desc text-white/50 text-sm md:text-base mt-4">
            Every material chosen by Mohamed Moussa is selected for its sensory richness, durability, and timeless aesthetic synergy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 material-preview aspect-[4/3] relative rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
            <div ref={imageRef} className="absolute inset-0">
              <Image
                src={activeMaterial.image}
                alt={activeMaterial.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                loading="lazy"
                decoding="async"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute top-4 left-4">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] tracking-widest px-3 py-1 uppercase border border-amber-500/30 backdrop-blur-md">
                {activeMaterial.tag}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-2xl text-white mb-1">{activeMaterial.name}</h3>
              <p className="text-amber-200/70 text-xs font-mono">{activeMaterial.subtitle}</p>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex flex-col gap-3 mb-8">
              {materials.map((material) => (
                  <button
                  key={material.name}
                  onClick={() => handleMaterialChange(material)}
                  data-cursor-hover
                  className={`material-btn text-left p-4 rounded-sm border transition-all duration-300 ${
                    activeMaterial.name === material.name
                      ? 'border-amber-500/60 bg-amber-500/10 text-white pl-6 shadow-lg shadow-amber-950/20'
                      : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg">{material.name}</span>
                    <span className="text-xs font-mono opacity-60">{material.tag}</span>
                  </div>
                </button>
              ))}
            </div>

            <div ref={descRef} className="bg-white/[0.03] p-6 rounded-sm border border-white/5">
              <p className="text-white/80 text-sm leading-relaxed">
                {activeMaterial.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(MaterialExperience)
