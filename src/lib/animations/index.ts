import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  gsap.config({ autoSleep: 0, force3D: true })
  if (!(window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    gsap.ticker.lagSmoothing(0)
  }
}

const isMobile = () => typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasDOM = () => typeof document !== 'undefined'

function loadSplitText() {
  return import('gsap/SplitText').then((m) => {
    gsap.registerPlugin(m.SplitText)
    return m.SplitText
  })
}

const GP = { force3D: true, overwrite: 'auto' } as const

const ST_DEFAULTS = {
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  preventOverlaps: true,
} as const

function $(selector: string | Element): Element | null {
  if (!hasDOM()) return null
  return typeof selector === 'string' ? document.querySelector(selector) : selector
}

export const animations = {
  fadeUp: (element: string | Element, delay = 0) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  fadeIn: (element: string | Element, delay = 0) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1.5, delay, ease: 'power2.out', ...GP })
  },

  scaleReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  stagger: (elements: string | NodeList, delay = 0.1) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: delay, ease: 'power2.out', ...GP })
  },

  imageReveal: (element: string | Element) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut', ...GP })
  },

  textReveal: (element: string | Element) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', ...GP })
  },

  parallax: (element: string | Element, speed = 0.5) => {
    if (!hasDOM() || isMobile()) return
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true, ...ST_DEFAULTS },
      ...GP,
    })
  },

  clipPathReveal: (element: string | Element, direction = 'right') => {
    if (!hasDOM()) return
    const clips: Record<string, [string, string]> = {
      right: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
      left: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
      up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
      down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
    }
    gsap.fromTo(element, { clipPath: clips[direction][0] }, { clipPath: clips[direction][1], duration: 1.4, ease: 'power4.inOut', ...GP })
  },

  blurReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0, filter: 'blur(20px)', scale: 1.1 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, delay, ease: 'power3.out', ...GP })
  },

  magnetic: (element: HTMLElement, strength = 0.3) => {
    if (!hasDOM() || isMobile()) return () => {}
    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(element, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out', ...GP })
    }
    const onLeave = () => { gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', ...GP }) }
    element.addEventListener('mousemove', onMove, { passive: true })
    element.addEventListener('mouseleave', onLeave, { passive: true })
    return () => { element.removeEventListener('mousemove', onMove); element.removeEventListener('mouseleave', onLeave) }
  },

  scrollTriggerFade: (element: string | Element, start = 'top 80%') => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: element, start, toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  horizontalScroll: (container: string | Element, sections: string) => {
    if (!hasDOM() || isMobile()) return
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container
    if (!containerEl) return
    const sectionElements = gsap.utils.toArray(sections) as Element[]
    gsap.to(sections, {
      xPercent: -100 * (sectionElements.length - 1), ease: 'none',
      scrollTrigger: { trigger: containerEl, pin: true, scrub: 1, end: () => '+=' + (containerEl as HTMLElement).offsetWidth, ...ST_DEFAULTS },
      ...GP,
    })
  },

  counter: (element: string | Element, from = 0, to: number, duration = 2, delay = 0) => {
    if (!hasDOM()) return
    if (prefersReducedMotion()) { const el = $(element); if (el) el.textContent = String(to); return }
    gsap.fromTo(element, { innerText: from }, { innerText: to, duration, ease: 'power2.out', delay, snap: { innerText: 1 }, ...GP })
  },

  counterFormatted: (element: string | Element, from = 0, to: number, prefix = '', suffix = '', duration = 2, delay = 0) => {
    if (!hasDOM()) return
    if (prefersReducedMotion()) { const el = $(element); if (el) el.textContent = `${prefix}${to.toLocaleString()}${suffix}`; return }
    const el = $(element)
    if (!el) return
    const obj = { val: from }
    gsap.to(obj, { val: to, duration, ease: 'power2.out', delay, onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}` }, ...GP })
  },

  staggerRotateIn: (elements: string | NodeList, delay = 0.12) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, y: 40, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerScaleIn: (elements: string | NodeList, delay = 0.1) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.9, stagger: delay, ease: 'back.out(1.7)', ...GP })
  },

  staggerSlideLeft: (elements: string | NodeList, delay = 0.1) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerSlideRight: (elements: string | NodeList, delay = 0.1) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerFlip: (elements: string | NodeList, delay = 0.12) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, rotationY: -40, y: 20 }, { opacity: 1, rotationY: 0, y: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerZoom: (elements: string | NodeList, delay = 0.1) => {
    if (!hasDOM()) return
    gsap.fromTo(elements, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.2, stagger: delay, ease: 'elastic.out(1, 0.5)', ...GP })
  },

  float: (element: string | Element, yDelta = 10, duration = 3, delay = 0) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    gsap.to(element, { y: yDelta, duration, ease: 'sine.inOut', yoyo: true, repeat: -1, delay, ...GP })
  },

  pulse: (element: string | Element, scale = 1.05, duration = 2) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    gsap.to(element, { scale, duration, ease: 'sine.inOut', yoyo: true, repeat: -1, ...GP })
  },

  revealWithRotate: (element: string | Element, delay = 0) => {
    if (!hasDOM()) return
    gsap.fromTo(element, { opacity: 0, rotation: -8, y: 40 }, { opacity: 1, rotation: 0, y: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  textSplitReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type: 'words,chars' })
      gsap.fromTo(split.chars, { opacity: 0, y: 50, rotationZ: -5 }, {
        opacity: 1, y: 0, rotationZ: 0, duration: 0.8, stagger: 0.02, delay, ease: 'power3.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  lineReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type: 'lines' })
      gsap.fromTo(split.lines, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.1, delay, ease: 'power3.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  wordReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type: 'words' })
      gsap.fromTo(split.words, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.04, delay, ease: 'power3.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  charsReveal: (element: string | Element, delay = 0) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type: 'chars' })
      gsap.fromTo(split.chars, { opacity: 0, y: 30, rotation: -3 }, {
        opacity: 1, y: 0, rotation: 0, duration: 0.7, stagger: 0.015, delay, ease: 'power3.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  splitTextReveal: (element: string | Element, config: { type?: string; stagger?: number; duration?: number; delay?: number } = {}) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    const { type = 'chars', stagger = 0.025, duration = 0.7, delay = 0 } = config
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type })
      const targets = type === 'chars' ? split.chars : split.words
      if (!targets) return
      gsap.fromTo(targets, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration, stagger, delay, ease: 'power3.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  staggerWords: (element: string | Element, delay = 0, stagger = 0.06) => {
    if (!hasDOM() || prefersReducedMotion() || isMobile()) return
    loadSplitText().then((SplitText) => {
      const el = $(element)
      if (!el) return
      const split = new SplitText(el as HTMLElement, { type: 'words' })
      gsap.fromTo(split.words, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, stagger, delay, ease: 'power2.out',
        onComplete: () => { try { split.revert() } catch {} },
        ...GP,
      })
    })
  },

  outlineNumberScroll: (element: string | Element, options: { start?: number; end?: number; duration?: number } = {}) => {
    if (!hasDOM()) return
    const { start = 0, end = 100, duration = 2 } = options
    gsap.fromTo(element, { innerText: start }, {
      innerText: end, duration, ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      snap: { innerText: 1 },
      ...GP,
    })
  },

  tilt3d: (element: HTMLElement, sensitivity = 10) => {
    if (!hasDOM() || isMobile()) return () => {}
    const handleMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      gsap.to(element, {
        rotationX: (y - 0.5) * sensitivity,
        rotationY: (x - 0.5) * -sensitivity,
        duration: 0.5, ease: 'power2.out', ...GP,
      })
    }
    const handleLeave = () => {
      gsap.to(element, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out', ...GP })
    }
    element.addEventListener('mousemove', handleMove, { passive: true })
    element.addEventListener('mouseleave', handleLeave, { passive: true })
    return () => { element.removeEventListener('mousemove', handleMove); element.removeEventListener('mouseleave', handleLeave) }
  },

  scrollZoomImage: (element: string | Element, startScale = 1, endScale = 1.2) => {
    if (!hasDOM() || isMobile()) return
    gsap.fromTo(element, { scale: startScale }, {
      scale: endScale, ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true, ...ST_DEFAULTS },
      ...GP,
    })
  },

  mouseParallax: (element: string | Element, intensity = 0.1) => {
    if (!hasDOM() || isMobile()) return
    const el = $(element)
    if (!el) return
    const bounds = el.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    document.addEventListener('mousemove', (e: MouseEvent) => {
      const x = (e.clientX - centerX) * intensity
      const y = (e.clientY - centerY) * intensity
      gsap.to(el, { x, y, duration: 0.6, ease: 'power2.out', ...GP })
    }, { passive: true })
  },

  imageParallax: (element: string | Element, speed = 0.3) => {
    if (!hasDOM()) return
    gsap.to(element, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true, ...ST_DEFAULTS },
      ...GP,
    })
  },

  footerCinematicExit: (element: string | Element) => {
    if (!hasDOM()) return
    gsap.to(element, {
      opacity: 0.85, scale: 0.92, yPercent: -5, ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1, ...ST_DEFAULTS },
      ...GP,
    })
  },
}