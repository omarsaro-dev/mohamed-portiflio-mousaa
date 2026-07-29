import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

gsap.ticker.lagSmoothing(0)
gsap.config({ autoSleep: 0, force3D: true })

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function safeTimeline(delay = 0) {
  const tl = gsap.timeline({ delay, smoothChildTiming: true, autoRemoveChildren: true })
  if (prefersReducedMotion()) tl.timeScale(3)
  return tl
}

function $(selector: string | Element): Element | null {
  return typeof selector === 'string' ? document.querySelector(selector) : selector
}

const GP = { force3D: true, overwrite: 'auto' } as const

const ST_DEFAULTS = {
  invalidateOnRefresh: true,
} as const

export const animations = {
  fadeUp: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  fadeIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1.5, delay, ease: 'power2.out', ...GP })
  },

  scaleReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  stagger: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: delay, ease: 'power2.out', ...GP })
  },

  imageReveal: (element: string | Element) => {
    gsap.fromTo(element, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut', ...GP })
  },

  textReveal: (element: string | Element) => {
    gsap.fromTo(element, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', ...GP })
  },

  parallax: (element: string | Element, speed = 0.5) => {
    if (isMobile()) return
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true, ...ST_DEFAULTS },
      ...GP,
    })
  },

  clipPathReveal: (element: string | Element, direction = 'right') => {
    const clips: Record<string, [string, string]> = {
      right: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
      left: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
      up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
      down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
    }
    gsap.fromTo(element, { clipPath: clips[direction][0] }, { clipPath: clips[direction][1], duration: 1.4, ease: 'power4.inOut', ...GP })
  },

  blurReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, filter: 'blur(20px)', scale: 1.1 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, delay, ease: 'power3.out', ...GP })
  },

  magnetic: (element: HTMLElement, strength = 0.3) => {
    let ctx: gsap.Context | null = null
    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(element, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out', ...GP })
    }
    const onLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', ...GP })
    }
    element.addEventListener('mousemove', onMove, { passive: true })
    element.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      element.removeEventListener('mousemove', onMove)
      element.removeEventListener('mouseleave', onLeave)
    }
  },

  scrollTriggerFade: (element: string | Element, start = 'top 80%') => {
    gsap.fromTo(element, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: element, start, toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  horizontalScroll: (container: string | Element, sections: string) => {
    if (isMobile()) return
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
    if (prefersReducedMotion()) { const el = $(element); if (el) el.textContent = String(to); return }
    gsap.fromTo(element, { innerText: from }, { innerText: to, duration, ease: 'power2.out', delay, snap: { innerText: 1 }, ...GP })
  },

  counterFormatted: (element: string | Element, from = 0, to: number, prefix = '', suffix = '', duration = 2, delay = 0) => {
    if (prefersReducedMotion()) { const el = $(element); if (el) el.textContent = `${prefix}${to.toLocaleString()}${suffix}`; return }
    const el = $(element)
    if (!el) return
    const obj = { val: from }
    gsap.to(obj, { val: to, duration, ease: 'power2.out', delay, onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}` }, ...GP })
  },

  staggerRotateIn: (elements: string | NodeList, delay = 0.12) => {
    gsap.fromTo(elements, { opacity: 0, y: 40, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerScaleIn: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.9, stagger: delay, ease: 'back.out(1.7)', ...GP })
  },

  staggerSlideLeft: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerSlideRight: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerFlip: (elements: string | NodeList, delay = 0.12) => {
    gsap.fromTo(elements, { opacity: 0, rotationY: -40, y: 20 }, { opacity: 1, rotationY: 0, y: 0, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  staggerZoom: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.2, stagger: delay, ease: 'elastic.out(1, 0.5)', ...GP })
  },

  float: (element: string | Element, yDelta = 10, duration = 3, delay = 0) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { y: yDelta, duration, ease: 'sine.inOut', yoyo: true, repeat: -1, delay, ...GP })
  },

  pulse: (element: string | Element, scale = 1.05, duration = 2) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { scale, duration, ease: 'sine.inOut', yoyo: true, repeat: -1, ...GP })
  },

  revealWithRotate: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, rotation: -8, y: 40 }, { opacity: 1, rotation: 0, y: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  textSplitReveal: (element: string | Element, delay = 0) => {
    if (prefersReducedMotion() || isMobile()) return
    const el = $(element)
    if (!el) return
    const split = new SplitText(el as HTMLElement, { type: 'words,chars' })
    gsap.fromTo(split.chars, { opacity: 0, y: 50, rotationZ: -5 }, {
      opacity: 1, y: 0, rotationZ: 0, duration: 0.8, stagger: 0.02, delay, ease: 'power3.out',
      onComplete: () => { try { split.revert() } catch {} },
      ...GP,
    })
  },

  lineReveal: (element: string | Element, delay = 0) => {
    if (prefersReducedMotion() || isMobile()) return
    const el = $(element)
    if (!el) return
    const split = new SplitText(el as HTMLElement, { type: 'lines' })
    gsap.fromTo(split.lines, { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, stagger: 0.1, delay, ease: 'power3.out',
      onComplete: () => { try { split.revert() } catch {} },
      ...GP,
    })
  },

  wordReveal: (element: string | Element, delay = 0) => {
    if (prefersReducedMotion() || isMobile()) return
    const el = $(element)
    if (!el) return
    const split = new SplitText(el as HTMLElement, { type: 'words' })
    gsap.fromTo(split.words, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.04, delay, ease: 'power2.out',
      onComplete: () => { try { split.revert() } catch {} },
      ...GP,
    })
  },

  charsReveal: (element: string | Element, delay = 0) => {
    if (prefersReducedMotion() || isMobile()) return
    const el = $(element)
    if (!el) return
    const split = new SplitText(el as HTMLElement, { type: 'chars' })
    gsap.fromTo(split.chars, { opacity: 0, scale: 0, rotation: -30 }, {
      opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.015, delay, ease: 'back.out(2)',
      onComplete: () => { try { split.revert() } catch {} },
      ...GP,
    })
  },

  imageParallax: (element: string | Element, speed = 0.3) => {
    if (isMobile()) return
    gsap.to(element, {
      yPercent: -30 * speed, ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1.5, ...ST_DEFAULTS },
      ...GP,
    })
  },

  zoomOnScroll: (element: string | Element) => {
    if (isMobile()) return
    gsap.fromTo(element, { scale: 1.15 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: element, start: 'top 80%', end: 'top 20%', scrub: 1.5, ...ST_DEFAULTS },
      ...GP,
    })
  },

  tiltOnMouse: (element: HTMLElement, strength = 10) => {
    if (isMobile()) return
    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(element, { rotationY: x * strength, rotationX: -y * strength, duration: 0.5, ease: 'power2.out', ...GP })
    }
    const onLeave = () => {
      gsap.to(element, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', ...GP })
    }
    element.addEventListener('mousemove', onMove, { passive: true })
    element.addEventListener('mouseleave', onLeave, { passive: true })
    return () => { element.removeEventListener('mousemove', onMove); element.removeEventListener('mouseleave', onLeave) }
  },

  marquee: (element: string | Element, speed = 50) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { xPercent: -50, ease: 'none', repeat: -1, duration: speed, ...GP })
  },

  marqueeReverse: (element: string | Element, speed = 60) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { xPercent: 50, ease: 'none', repeat: -1, duration: speed, ...GP })
  },

  glowPulse: (element: string | Element) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { boxShadow: '0 0 40px rgba(251, 191, 36, 0.15)', duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  },

  staggerFromBottom: (elements: string | NodeList, delay = 0.08) => {
    gsap.fromTo(elements, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.9, stagger: delay, ease: 'power4.out', ...GP })
  },

  timelineStagger: (elements: string | Element[] | NodeList, delay = 0.1) => {
    const tl = safeTimeline()
    const items = gsap.utils.toArray(elements) as Element[]
    items.forEach((item, i) => {
      tl.fromTo(item, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', ...GP }, i * delay)
    })
    return tl
  },

  trackScrollProgress: (element: string | Element) => {
    if (isMobile()) return
    gsap.to(element, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0, ...ST_DEFAULTS },
    })
  },

  skewReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, skewY: 4, y: 40 }, { opacity: 1, skewY: 0, y: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  shake: (element: string | Element) => {
    if (prefersReducedMotion()) return
    gsap.to(element, { x: 3, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut', ...GP })
  },

  bounceIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, scale: 0.3, y: -40 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, delay, ease: 'elastic.out(1, 0.4)', ...GP })
  },

  rotate3D: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, rotationX: -90, transformPerspective: 600 }, { opacity: 1, rotationX: 0, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  swingIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, rotation: -12, transformOrigin: '50% 0%' }, { opacity: 1, rotation: 0, duration: 1.2, delay, ease: 'bounce.out', ...GP })
  },

  staggeredZoomBounce: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.2, stagger: delay, ease: 'elastic.out(1, 0.5)', ...GP })
  },

  sectionReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  cardHover3D: (element: HTMLElement) => {
    if (isMobile()) return
    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      gsap.to(element, { rotationY: (x - 0.5) * 8, rotationX: (0.5 - y) * 8, transformPerspective: 800, duration: 0.5, ease: 'power2.out', ...GP })
    }
    const onLeave = () => {
      gsap.to(element, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', ...GP })
    }
    element.addEventListener('mousemove', onMove, { passive: true })
    element.addEventListener('mouseleave', onLeave, { passive: true })
    return () => { element.removeEventListener('mousemove', onMove); element.removeEventListener('mouseleave', onLeave) }
  },

  staggerCustom: (elements: string | NodeList, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, staggerDelay = 0.1) => {
    gsap.fromTo(elements, fromVars, { ...toVars, duration: toVars.duration || 0.8, stagger: staggerDelay, ease: (toVars.ease as string) || 'power3.out', ...GP })
  },

  colorShift: (element: string | Element, color: string, duration = 0.3) => {
    gsap.to(element, { color, duration, ease: 'power2.out', ...GP })
  },

  borderGlow: (element: string | Element) => {
    if (prefersReducedMotion() || isMobile()) return
    gsap.to(element, { borderColor: 'rgba(251, 191, 36, 0.6)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.1), inset 0 0 20px rgba(251, 191, 36, 0.05)', duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  },

  wiggle: (element: string | Element) => {
    if (prefersReducedMotion()) return
    gsap.to(element, { rotation: 2, duration: 0.12, repeat: 6, yoyo: true, ease: 'power1.inOut', ...GP })
  },

  spinIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, rotation: 180, scale: 0.5 }, { opacity: 1, rotation: 0, scale: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  dropIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 1, delay, ease: 'bounce.out', ...GP })
  },

  expandIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 1, delay, ease: 'power3.out', ...GP })
  },

  expandFromCenter: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, scaleX: 0, scaleY: 0 }, { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  staggeredExpand: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.8, stagger: delay, ease: 'power3.out', ...GP })
  },

  fadeSlideUpScale: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  staggeredFadeSlideUpScale: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: delay, ease: 'power3.out', ...GP })
  },

  scrollRevealSlideUp: (element: string | Element) => {
    gsap.fromTo(element, { opacity: 0, y: 80 }, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  scrollRevealSlideLeft: (element: string | Element) => {
    gsap.fromTo(element, { opacity: 0, x: 100 }, {
      opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  scrollRevealSlideRight: (element: string | Element) => {
    gsap.fromTo(element, { opacity: 0, x: -100 }, {
      opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  scrollRevealScale: (element: string | Element) => {
    gsap.fromTo(element, { opacity: 0, scale: 0.7 }, {
      opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...ST_DEFAULTS },
      ...GP,
    })
  },

  enterFromCorner: (element: string | Element, corner: 'tl' | 'tr' | 'bl' | 'br' = 'tl', delay = 0) => {
    const origins: Record<string, string> = { tl: '0% 0%', tr: '100% 0%', bl: '0% 100%', br: '100% 100%' }
    gsap.fromTo(element, { opacity: 0, scale: 0, transformOrigin: origins[corner] }, { opacity: 1, scale: 1, duration: 1, delay, ease: 'power3.out', ...GP })
  },

  fadeSlideBlur: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, delay, ease: 'power3.out', ...GP })
  },

  focusExpand: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, filter: 'blur(15px)', scale: 0.95 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, delay, ease: 'power3.out', ...GP })
  },

  curtainReveal: (element: string | Element, delay = 0) => {
    const tl = gsap.timeline({ delay, ...GP })
    const el = $(element)
    if (!el) return tl
    tl.set(el, { opacity: 1 })
      .fromTo(el, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.4, ease: 'power4.inOut', ...GP })
    return tl
  },

  wipeReveal: (element: string | Element, delay = 0) => {
    const tl = gsap.timeline({ delay, ...GP })
    const el = $(element)
    if (!el) return tl
    tl.set(el, { opacity: 1 })
      .fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut', ...GP })
    return tl
  },

  parallaxFadeIn: (element: string | Element, speed = 0.3) => {
    if (isMobile()) return
    gsap.fromTo(element, { opacity: 0, y: 30 }, {
      opacity: 1, y: -30 * speed, duration: 1.5, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 80%', end: 'top 20%', scrub: 1.5, ...ST_DEFAULTS },
      ...GP,
    })
  },

  revealWipeDown: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, delay, ease: 'power4.inOut', ...GP })
  },

  sequenceBlurIn: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: delay, ease: 'power3.out', ...GP })
  },

  scaleYReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' }, { opacity: 1, scaleY: 1, duration: 1, delay, ease: 'power3.out', ...GP })
  },

  tilt3d: (element: string | Element, maxTilt = 8) => {
    if (isMobile() || prefersReducedMotion()) return
    const el = $(element) as HTMLElement
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      gsap.to(el, { rotateY: (x - 0.5) * maxTilt, rotateX: (0.5 - y) * maxTilt, transformPerspective: 800, duration: 0.4, ease: 'power2.out', ...GP })
    }
    const onLeave = () => { gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', ...GP }) }
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  },

  staggerChars: (element: string | Element, delay = 0, duration = 1.2) => {
    const el = $(element)
    if (!el) return
    const split = new SplitText(el, { type: 'chars' })
    gsap.fromTo(split.chars, { opacity: 0, y: 40, rotateX: -20 }, { opacity: 1, y: 0, rotateX: 0, duration, stagger: 0.03, delay, ease: 'power3.out', ...GP })
  },

  staggerWords: (element: string | Element, delay = 0, duration = 1) => {
    const el = $(element)
    if (!el) return
    const split = new SplitText(el, { type: 'words' })
    gsap.fromTo(split.words, { opacity: 0, y: 30, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration, stagger: 0.08, delay, ease: 'power3.out', ...GP })
  },

  mouseParallax: (element: string | Element, strength = 0.08) => {
    if (isMobile() || prefersReducedMotion()) return
    const el = $(element) as HTMLElement
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(el, { x: x * 30 * strength, y: y * 20 * strength, duration: 0.6, ease: 'power2.out', ...GP })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  },
}

export type AnimationFunction = (...args: any[]) => any
