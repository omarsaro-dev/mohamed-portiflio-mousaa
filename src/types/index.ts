export interface Project {
  id: string
  title: string
  location: string
  year: number
  style: string
  category: 'Luxury Villas' | 'Residential' | 'Commercial' | 'Hospitality'
  description: string
  images: string[]
  video?: string
  materials: string[]
  featured: boolean
}

export interface Award {
  id: string
  title: string
  organization: string
  year: number
  project: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  project?: string
}

export interface ContactForm {
  name: string
  email: string
  projectType: string
  budget: string
  timeline: string
  message: string
}
