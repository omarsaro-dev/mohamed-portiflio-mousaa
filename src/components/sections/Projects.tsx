'use client'

import { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import { animations } from '@/lib/animations'

export interface ProjectItem {
  id: number
  title: string
  location: string
  style: string
  category: string
  year: number
  description: string
  mainImage: string
  gallery: string[]
  materials: string[]
  featured?: boolean
}

const projects: ProjectItem[] = [
  {
    id: 9,
    title: 'Classic Project',
    location: 'Cairo, Egypt',
    style: 'Classic',
    category: 'Residential',
    year: 2024,
    description: 'A timeless classic interior with symmetrical composition, ornate moldings, and a refined neutral palette that exudes understated grandeur.',
    mainImage: '/images/projects/classic/project q/mousaa 1.jpg',
    gallery: ['/images/projects/classic/project q/mousaa 1.jpg', '/images/projects/classic/project q/mousaa 2.jpg'],
    materials: ['Carrara Marble', 'Crystal', 'Gold Leaf', 'Velvet'],
    featured: false,
  },
  {
    id: 2,
    title: 'New Classic Project',
    location: 'Cairo, Egypt',
    style: 'New Classic',
    category: 'Luxury Villas',
    year: 2024,
    description: 'A refined living space where timeless classical elements meet contemporary sophistication.',
    mainImage: '/images/projects/new classic/project 1/mousaa 1.jpg',
    gallery: ['/images/projects/new classic/project 1/mousaa 1.jpg', '/images/projects/new classic/project 1/mousaa 2.jpg', '/images/projects/new classic/project 1/mousaa 3.jpg'],
    materials: ['Marble', 'Warm Oak', 'Brass Details', 'Luxury Fabrics'],
    featured: true,
  },
  {
    id: 3,
    title: 'New Classic Project',
    location: 'Cairo, Egypt',
    style: 'New Classic',
    category: 'Luxury Villas',
    year: 2024,
    description: 'An elegant classical interior with modern restraint, balancing ornate detailing with clean lines.',
    mainImage: '/images/projects/new classic/project 2/mousa 1.jpg',
    gallery: ['/images/projects/new classic/project 2/mousa 1.jpg', '/images/projects/new classic/project 2/mousa 2.jpg'],
    materials: ['Natural Stone', 'Walnut', 'Gold Accents', 'Silk Textiles'],
    featured: false,
  },
  {
    id: 10,
    title: 'New Classic Living Space',
    location: 'Cairo, Egypt',
    style: 'New Classic',
    category: 'Luxury Villas',
    year: 2024,
    description: 'A sophisticated new classic interior blending traditional proportions with contemporary comforts and subtle luxurious detailing.',
    mainImage: '/images/projects/new classic/project 3/mousaa 1.jpg',
    gallery: ['/images/projects/new classic/project 3/mousaa 1.jpg', '/images/projects/new classic/project 3/mousaa 2.jpg'],
    materials: ['Limestone', 'Smoked Oak', 'Bronze', 'Linen'],
    featured: false,
  },
  {
    id: 4,
    title: 'Modern Project',
    location: 'Cairo, Egypt',
    style: 'Modern',
    category: 'Residential',
    year: 2024,
    description: 'A sleek modern residence defined by clean geometry, open spatial flow, and a restrained palette.',
    mainImage: '/images/projects/modern/project 1/mousaa 1.jpg',
    gallery: ['/images/projects/modern/project 1/mousaa 1.jpg', '/images/projects/modern/project 1/mousaa 2.jpg', '/images/projects/modern/project 1/mousaa 3.jpg', '/images/projects/modern/project 1/mousaa 4.jpg'],
    materials: ['Concrete', 'Glass', 'Steel', 'Natural Wood'],
    featured: true,
  },
  {
    id: 5,
    title: 'Modern Project',
    location: 'Cairo, Egypt',
    style: 'Modern',
    category: 'Residential',
    year: 2024,
    description: 'A contemporary living space with clean architectural lines, neutral tones, and curated material contrasts.',
    mainImage: '/images/projects/modern/project 2/mousaa 1.jpg',
    gallery: ['/images/projects/modern/project 2/mousaa 1.jpg', '/images/projects/modern/project 2/mousaa 2.jpg'],
    materials: ['Micro-cement', 'Oak', 'Black Metal', 'Textured Plaster'],
    featured: false,
  },
  {
    id: 6,
    title: 'Office Project',
    location: 'Cairo, Egypt',
    style: 'Office',
    category: 'Commercial',
    year: 2024,
    description: 'A professional office environment designed for productivity and comfort with clean lines.',
    mainImage: '/images/projects/office/project 1/ofice 1.jpg',
    gallery: ['/images/projects/office/project 1/ofice 1.jpg', '/images/projects/office/project 1/office 2.jpg', '/images/projects/office/project 1/oficce 3.jpg'],
    materials: ['Glass Partitions', 'Engineered Wood', 'Carpet Tiles', 'Aluminum'],
    featured: false,
  },
  {
    id: 7,
    title: 'Office Project',
    location: 'Cairo, Egypt',
    style: 'Office',
    category: 'Commercial',
    year: 2024,
    description: 'A modern workspace with open-plan flexibility, private meeting zones, and a calm professional aesthetic.',
    mainImage: '/images/projects/office/project 2/ofice 1.jpg',
    gallery: ['/images/projects/office/project 2/ofice 1.jpg', '/images/projects/office/project 2/ofice 2.jpg', '/images/projects/office/project 2/office 3.jpg'],
    materials: ['Acoustic Panels', 'Glass', 'Steel', 'Wood Veneer'],
    featured: false,
  },
  {
    id: 12,
    title: 'Landscape Project',
    location: 'Cairo, Egypt',
    style: 'Landscape',
    category: 'Luxury Villas',
    year: 2024,
    description: 'A lush outdoor oasis with layered planting, natural stone pathways, and tranquil water features that seamlessly extend the indoor living experience into the garden.',
    mainImage: '/images/projects/land scape/project 1/mousa 1.jpg',
    gallery: ['/images/projects/land scape/project 1/mousa 1.jpg', '/images/projects/land scape/project 1/mousa 3.jpg', '/images/projects/land scape/project 1/mousa 4.jpg', '/images/projects/land scape/project 1/mousa2.jpg'],
    materials: ['Natural Stone', 'Water Features', 'Exterior Wood', 'Landscape Lighting'],
    featured: false,
  },
  {
    id: 11,
    title: 'Exterior Project',
    location: 'Cairo, Egypt',
    style: 'Exterior',
    category: 'Luxury Villas',
    year: 2024,
    description: 'A commanding exterior composition featuring sculptural massing, warm stone cladding, and dramatic architectural lighting that establishes a powerful street presence.',
    mainImage: '/images/projects/Exterior/1.jpeg',
    gallery: ['/images/projects/Exterior/1.jpeg', '/images/projects/Exterior/2.jpeg', '/images/projects/Exterior/3.jpeg', '/images/projects/Exterior/4.jpeg', '/images/projects/Exterior/exterior-facade-01.jpeg', '/images/projects/Exterior/exterior-facade-02.jpeg', '/images/projects/Exterior/exterior-facade-03.jpeg', '/images/projects/Exterior/exterior-facade-04.jpeg', '/images/projects/Exterior/exterior-facade-05.jpeg', '/images/projects/Exterior/exterior-facade-06.jpeg', '/images/projects/Exterior/exterior-facade-07.jpeg'],
    materials: ['Natural Stone', 'Stucco', 'Architectural Glass', 'Bronze Cladding'],
    featured: false,
  },
  {
    id: 1,
    title: 'Boho Style Project',
    location: 'Cairo, Egypt',
    style: 'Boho Style',
    category: 'Residential',
    year: 2024,
    description: 'A vibrant residential interior blending natural textures, eclectic patterns, and warm earthy tones to create a relaxed artistic atmosphere.',
    mainImage: '/images/projects/boho style/project 1/mousaa 1.jpg',
    gallery: ['/images/projects/boho style/project 1/mousaa 1.jpg', '/images/projects/boho style/project 1/mousaa 2.jpg'],
    materials: ['Natural Wood', 'Textured Fabrics', 'Warm Earth Tones'],
    featured: true,
  },
  {
    id: 8,
    title: 'Boho Style Living Room',
    location: 'Cairo, Egypt',
    style: 'Boho Style',
    category: 'Residential',
    year: 2024,
    description: 'A warm bohemian living space with layered textures, natural fiber accents, and an earthy color palette that creates a cozy artistic atmosphere.',
    mainImage: '/images/projects/boho style/project 2/mousaa 1.jpg',
    gallery: ['/images/projects/boho style/project 2/mousaa 1.jpg'],
    materials: ['Natural Fibers', 'Macrame', 'Terracotta', 'Rattan'],
    featured: false,
  },
]

const styles = ['All', 'Classic', 'New Classic', 'Modern', 'Office', 'Landscape', 'Exterior', 'Boho Style']

function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStyle, setActiveStyle] = useState('All')
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredProjects = useMemo(() => activeStyle === 'All'
    ? projects
    : projects.filter(p => p.style === activeStyle), [activeStyle])

  const grouped = useMemo(() => filteredProjects.reduce((acc, project) => {
    if (!acc[project.style]) acc[project.style] = []
    acc[project.style].push(project)
    return acc
  }, {} as Record<string, ProjectItem[]>), [filteredProjects])

  const groups = useMemo(() => Object.entries(grouped), [grouped])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-title', { opacity: 0, y: 50, filter: 'blur(8px)' }, {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', force3D: true,
        scrollTrigger: { trigger: '.projects-title', start: 'top 75%', toggleActions: 'play none none reverse', invalidateOnRefresh: true, fastScrollEnd: true, preventOverlaps: true },
      })
      gsap.fromTo('.projects-filter-btn', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.3, force3D: true,
        scrollTrigger: { trigger: '.projects-filter-btn', start: 'top 75%', toggleActions: 'play none none reverse', fastScrollEnd: true, preventOverlaps: true },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    gsap.fromTo('.category-card', { opacity: 0, y: 50, scale: 0.97, filter: 'blur(4px)' }, {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power3.out', force3D: true, overwrite: 'auto',
    })
    gsap.utils.toArray('.category-card').forEach((c) => {
      if (c instanceof HTMLElement) animations.tilt3d(c, 6)
    })
    gsap.utils.toArray('.category-card').forEach((c) => {
      if (c instanceof HTMLElement) {
        const img = c.querySelector('img')
        if (img) {
          gsap.to(img, {
            yPercent: -5, ease: 'none',
            scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          })
          animations.scrollZoomImage(img, 1.15, 1)
        }
      }
    })
    gsap.utils.toArray('.project-thumb').forEach((t) => {
      if (t instanceof HTMLElement) {
        const img = t.querySelector('img')
        if (img) {
          animations.magneticHoverPremium(t, 0.15)
          animations.dynamicShadow(t, 0.3)
        }
      }
    })
  }, [filteredProjects])

  useEffect(() => {
    if (selectedProject && modalRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } })
      tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo('.modal-content', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.15')
        .fromTo('.modal-image', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.4')
        .fromTo('.modal-details > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, '-=0.4')
    }
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject || selectedProject.gallery.length <= 1) return
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % selectedProject.gallery.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [selectedProject])

  const openModal = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { opacity: 0, scale: 0.97, duration: 0.3, ease: 'power2.in', force3D: true, onComplete: () => setSelectedProject(null) })
    } else {
      setSelectedProject(null)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedProject) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight' && selectedProject.gallery.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % selectedProject.gallery.length)
      }
      if (e.key === 'ArrowLeft' && selectedProject.gallery.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject) return
    selectedProject.gallery.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [selectedProject])

  const singleGroup = groups.length === 1

  return (
    <section id="projects" ref={containerRef} className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-amber-500/80 text-xs tracking-[0.3em] uppercase mb-3">Portfolio Highlights</p>
            <h2 className="projects-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5]">
              Selected Works
            </h2>
            <p className="text-white/40 text-xs font-mono mt-2 tracking-wider">
              Showing <span className="text-amber-400/80">{filteredProjects.length}</span> of {projects.length} projects
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {styles.map((style) => (
                  <button
                key={style}
                onClick={() => setActiveStyle(style)}
                data-cursor-hover
                className={`projects-filter-btn px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                  activeStyle === style
                    ? 'border-amber-500/60 bg-amber-500/10 text-[#F5F5F5]'
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid gap-10 ${singleGroup ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {groups.map(([style, items]) => (
            <div
              key={style}
              className="category-card bg-white/[0.02] border border-white/5 p-6 rounded-sm transition-all duration-500 hover:border-amber-500/30 hover:bg-white/[0.04] will-change-transform"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="font-serif text-2xl text-[#F5F5F5]">{style}</h3>
                  <p className="text-white/40 text-xs mt-1 font-mono tracking-wider">
                    {items.length} project{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-[10px] tracking-widest text-amber-300 uppercase border border-amber-500/20 rounded-xs flex-shrink-0 ml-4">
                  {style}
                </span>
              </div>

              <div className={`grid gap-3 ${
                items.length === 1
                  ? 'grid-cols-1'
                  : 'grid-cols-2'
              }`}>
                {items.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => openModal(project)}
                    className="cursor-pointer group/project"
                  >
                    <div className="project-thumb aspect-[4/3] min-h-[120px] bg-neutral-900 overflow-hidden rounded-sm relative will-change-transform">
                      <Image
                        src={project.mainImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover/project:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover/project:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover/project:translate-y-0 transition-transform duration-300">
                        <h4 className="text-sm text-white font-medium truncate">{project.title}</h4>
                        <p className="text-[11px] text-white/50 truncate">{project.location}</p>
                        <p className="text-amber-400/70 text-[10px] font-mono mt-0.5">{project.year}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.materials.slice(0, 2).map((mat) => (
                        <span key={mat} className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded-xs truncate">{mat}</span>
                      ))}
                      {project.materials.length > 2 && (
                        <span className="text-[10px] text-white/30">+{project.materials.length - 2}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="modal-content bg-[#0D0D0D] border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm p-6 md:p-8 relative text-[#F5F5F5]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} data-cursor-hover className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-amber-500 transition-colors z-10">✕</button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <div className="modal-image aspect-[4/3] min-h-[240px] bg-black overflow-hidden mb-4 border border-white/10 relative rounded-sm">
                  <Image src={selectedProject.gallery[activeImageIndex]} alt={selectedProject.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                </div>
                {selectedProject.gallery.length > 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {selectedProject.gallery.map((img, idx) => (
                          <button key={idx} onClick={() => setActiveImageIndex(idx)}
                            className={`w-20 h-16 border overflow-hidden rounded-xs transition-all relative ${
                              activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/40 tracking-wider">
                        {activeImageIndex + 1} / {selectedProject.gallery.length}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length)}
                          className="w-7 h-7 border border-white/20 flex items-center justify-center text-[10px] text-white/60 hover:text-white hover:border-amber-500 transition-colors rounded-xs">
                          ‹
                        </button>
                        <button onClick={() => setActiveImageIndex((prev) => (prev + 1) % selectedProject.gallery.length)}
                          className="w-7 h-7 border border-white/20 flex items-center justify-center text-[10px] text-white/60 hover:text-white hover:border-amber-500 transition-colors rounded-xs">
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-details lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-500 text-xs tracking-widest uppercase font-mono">{selectedProject.style}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-xs font-mono">{selectedProject.year}</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-4 leading-tight">{selectedProject.title}</h3>
                  <p className="text-amber-200/60 text-sm mb-6 flex items-center gap-2">{selectedProject.location}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">{selectedProject.description}</p>
                  {selectedProject.materials.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">Crafted Materials</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.materials.map((mat) => (
                          <span key={mat} className="text-xs bg-amber-500/10 text-amber-200 border border-amber-500/20 px-3 py-1 rounded-xs">{mat}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40 font-mono">Designed by Mohamed Moussa</span>
                  <a href="#contact" onClick={(e) => { closeModal(); setTimeout(() => window.location.hash = '#contact', 400) }}
                    className="px-5 py-2.5 bg-amber-500 text-black font-medium text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors">
                    Inquire Similar Project
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(Projects)
