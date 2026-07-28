import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Mock data
const projects = [
  {
    id: '1',
    title: 'The Emerald Lounge & Botanical Sanctum',
    location: 'Cairo, Egypt',
    year: 2024,
    category: 'Luxury Villas',
    description: 'A sanctuary of modern organic luxury blending illuminated backlit emerald onyx shelving, sculpted bouclé lounge seating, custom leaf-petal cluster chandeliers, and natural warm oak paneling.',
    images: ['/images/projects/al-nour-1.jpg', '/images/projects/al-nour-2.jpg'],
    materials: ['Emerald Onyx Marble', 'Warm Oak', 'Bouclé Upholstery', 'Bronze Metalwork'],
    featured: true,
  },
  {
    id: '2',
    title: 'Sculpted Dining Sanctuary',
    location: 'New Cairo, Egypt',
    year: 2024,
    category: 'Residential',
    description: 'Harmonious dining atmosphere centered around sculpted double-dome pendant lighting, an organic oval dining table with custom curved oak chairs, textured plaster artwork, and subtle ambient architectural light strips.',
    images: ['/images/projects/sculpted-haven-1.jpg', '/images/projects/sculpted-haven-2.jpg', '/images/projects/sculpted-haven-3.jpg'],
    materials: ['Travertine Marble', 'Natural Walnut', 'Textured Plaster', 'Micro-cement Tile'],
    featured: true,
  },
  {
    id: '3',
    title: 'The Obsidian Pavilion',
    location: 'Dubai, UAE',
    year: 2023,
    category: 'Commercial',
    description: 'Architectural commercial suite showcasing back-lit green marble accents, architectural vertical timber slats, minimalist brass fixtures, and lush integrated greenery.',
    images: ['/images/projects/al-nour-2.jpg', '/images/projects/al-nour-1.jpg'],
    materials: ['Smoked Glass', 'Black Granite', 'Brushed Brass', 'Veined Onyx'],
    featured: false,
  },
  {
    id: '4',
    title: 'Marina Grand Residence',
    location: 'Alexandria, Egypt',
    year: 2023,
    category: 'Hospitality',
    description: 'A boutique luxury suite featuring soft curved dining furniture, double sculptural light globes, layered sheer drapery, and warm plaster wall finishes.',
    images: ['/images/projects/sculpted-haven-3.jpg', '/images/projects/sculpted-haven-2.jpg'],
    materials: ['Volakas Marble', 'Organic Linen', 'Soft Walnut', 'Warm Brass'],
    featured: true,
  },
]

const awards = [
  { id: '1', title: 'Best Residential Design', organization: 'World Architecture Awards', year: 2024, project: 'Villa Serenity' },
  { id: '2', title: 'Sustainable Design Excellence', organization: 'Green Building Council', year: 2023, project: 'The Obsidian Tower' },
]

const testimonials = [
  { id: '1', name: 'Ahmed Hassan', role: 'CEO, TechCorp', content: 'Mohamed transformed our vision into reality. His attention to detail is unmatched.', project: 'The Obsidian Tower' },
  { id: '2', name: 'Sarah Mahmoud', role: 'Homeowner', content: 'Working with Mousaa was a dream. Our villa exceeds all expectations.', project: 'Villa Serenity' },
]

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.get('/api/projects', (req: Request, res: Response) => {
  const { category, featured } = req.query
  let filtered = projects

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category)
  }
  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured)
  }

  res.json(filtered)
})

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id)
  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }
  res.json(project)
})

app.get('/api/awards', (req: Request, res: Response) => {
  res.json(awards)
})

app.get('/api/testimonials', (req: Request, res: Response) => {
  res.json(testimonials)
})

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, projectType, budget, timeline, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Here you would typically save to database or send email
  console.log('Contact form submission:', { name, email, projectType, budget, timeline, message })

  res.json({ success: true, message: 'Message received successfully' })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
