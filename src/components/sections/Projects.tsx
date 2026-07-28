'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { animations } from '@/lib/animations'

export interface ProjectItem {
  id: number
  title: string
  location: string
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
    id: 1,
    title: 'The Emerald Lounge & Botanical Sanctum',
    location: 'Cairo, Egypt',
    category: 'Luxury Villas',
    year: 2024,
    description: 'A sanctuary of modern organic luxury blending illuminated backlit emerald onyx shelving, sculpted bouclé lounge seating, custom leaf-petal cluster chandeliers, and natural warm oak paneling.',
    mainImage: '/images/projects/al-nour-1.jpg',
    gallery: [
      '/images/projects/al-nour-1.jpg',
      '/images/projects/al-nour-2.jpg'
    ],
    materials: ['Emerald Onyx Marble', 'Warm Oak', 'Bouclé Upholstery', 'Bronze Metalwork'],
    featured: true
  },
  {
    id: 2,
    title: 'Sculpted Dining Sanctuary',
    location: 'New Cairo, Egypt',
    category: 'Residential',
    year: 2024,
    description: 'Harmonious dining atmosphere centered around sculpted double-dome pendant lighting, an organic oval dining table with custom curved oak chairs, textured plaster artwork, and subtle ambient architectural light strips.',
    mainImage: '/images/projects/sculpted-haven-1.jpg',
    gallery: [
      '/images/projects/sculpted-haven-1.jpg',
      '/images/projects/sculpted-haven-2.jpg',
      '/images/projects/sculpted-haven-3.jpg'
    ],
    materials: ['Travertine Marble', 'Natural Walnut', 'Textured Plaster', 'Micro-cement Tile'],
    featured: true
  },
  {
    id: 3,
    title: 'The Obsidian Pavilion',
    location: 'Dubai, UAE',
    category: 'Commercial',
    year: 2023,
    description: 'Architectural commercial suite showcasing back-lit green marble accents, architectural vertical timber slats, minimalist brass fixtures, and lush integrated greenery.',
    mainImage: '/images/projects/al-nour-2.jpg',
    gallery: [
      '/images/projects/al-nour-2.jpg',
      '/images/projects/al-nour-1.jpg'
    ],
    materials: ['Smoked Glass', 'Black Granite', 'Brushed Brass', 'Veined Onyx'],
    featured: false
  },
  {
    id: 4,
    title: 'Marina Grand Residence',
    location: 'Alexandria, Egypt',
    year: 2023,
    category: 'Hospitality',
    description: 'A boutique luxury suite featuring soft curved dining furniture, double sculptural light globes, layered sheer drapery, and warm plaster wall finishes.',
    mainImage: '/images/projects/sculpted-haven-3.jpg',
    gallery: [
      '/images/projects/sculpted-haven-3.jpg',
      '/images/projects/sculpted-haven-2.jpg'
    ],
    materials: ['Volakas Marble', 'Organic Linen', 'Soft Walnut', 'Warm Brass'],
    featured: true
  }
]

const categories = ['All', 'Luxury Villas', 'Residential', 'Commercial', 'Hospitality']

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  useEffect(() => {
    const ctx = gsap.context(() => {
      animations.fadeUp('.projects-title', 0)
      animations.fadeUp('.project-card', 0.1)
    }, containerRef)

    return () => ctx.revert()
  }, [filteredProjects])

  const openModal = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <section id="projects" ref={containerRef} className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-amber-500/80 text-xs tracking-[0.3em] uppercase mb-3">Portfolio Highlights</p>
            <h2 className="projects-title font-serif text-4xl md:text-5xl lg:text-6xl text-[#F5F5F5]">
              Selected Works
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'border-amber-500/60 bg-amber-500/10 text-[#F5F5F5]' 
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => openModal(project)}
              className="project-card group cursor-pointer bg-white/[0.02] border border-white/5 p-4 rounded-sm transition-all duration-500 hover:border-amber-500/30 hover:bg-white/[0.04]"
            >
              <div className="aspect-[4/3] bg-neutral-900 overflow-hidden mb-6 relative rounded-sm">
                <img 
                  src={project.mainImage} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] tracking-widest text-amber-300 uppercase border border-amber-500/30">
                    {project.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-white/80 tracking-widest uppercase bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10">
                    View Project Gallery →
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#F5F5F5] group-hover:text-amber-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">{project.location}</p>
                </div>
                <span className="text-amber-500/70 font-mono text-sm">{project.year}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                {project.materials.map((mat) => (
                  <span key={mat} className="text-[11px] text-white/50 bg-white/5 px-2.5 py-1 rounded-xs">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-[#0D0D0D] border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm p-6 md:p-8 relative text-[#F5F5F5]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-amber-500 transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Image & Gallery Selector */}
              <div className="lg:col-span-7">
                <div className="aspect-[4/3] bg-black overflow-hidden mb-4 border border-white/10 relative rounded-sm">
                  <img 
                    src={selectedProject.gallery[activeImageIndex]} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {selectedProject.gallery.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedProject.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-16 border overflow-hidden rounded-xs transition-all ${
                          activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Meta Info */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-500 text-xs tracking-widest uppercase font-mono">
                      {selectedProject.category}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-xs font-mono">{selectedProject.year}</span>
                  </div>

                  <h3 className="font-serif text-3xl text-white mb-4 leading-tight">
                    {selectedProject.title}
                  </h3>

                  <p className="text-amber-200/60 text-sm mb-6 flex items-center gap-2">
                    <span>📍</span> {selectedProject.location}
                  </p>

                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3 font-mono">
                      Crafted Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.materials.map((mat) => (
                        <span key={mat} className="text-xs bg-amber-500/10 text-amber-200 border border-amber-500/20 px-3 py-1 rounded-xs">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40 font-mono">Designed by Mohamed Moussa</span>
                  <a 
                    href="#contact" 
                    onClick={closeModal}
                    className="px-5 py-2.5 bg-amber-500 text-black font-medium text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors"
                  >
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
