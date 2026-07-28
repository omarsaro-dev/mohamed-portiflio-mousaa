import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const animations = {
  fadeUp: (element: string | Element, delay = 0) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, delay, ease: 'power3.out' }
    )
  },

  fadeIn: (element: string | Element, delay = 0) => {
    gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, delay, ease: 'power2.out' }
    )
  },

  scaleReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, delay, ease: 'power3.out' }
    )
  },

  stagger: (elements: string | NodeList, delay = 0.1) => {
    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: delay, ease: 'power2.out' }
    )
  },

  imageReveal: (element: string | Element) => {
    gsap.fromTo(
      element,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut' }
    )
  },

  textReveal: (element: string | Element) => {
    gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    )
  },

  parallax: (element: string | Element, speed = 0.5) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  },

  clipPathReveal: (element: string | Element, direction = 'right') => {
    const clips = {
      right: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
      left: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
      up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
      down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
    }
    gsap.fromTo(
      element,
      { clipPath: clips[direction as keyof typeof clips][0] },
      { clipPath: clips[direction as keyof typeof clips][1], duration: 1.4, ease: 'power4.inOut' }
    )
  },

  blurReveal: (element: string | Element, delay = 0) => {
    gsap.fromTo(
      element,
      { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, delay, ease: 'power3.out' }
    )
  },

  magnetic: (element: HTMLElement, strength = 0.3) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      })
    })
    element.addEventListener('mouseleave', () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
    })
  },

  scrollTriggerFade: (element: string | Element, start = 'top 80%') => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    )
  },

  horizontalScroll: (container: string | Element, sections: string) => {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container
    if (!containerEl) return
    
    gsap.to(sections, {
      xPercent: -100 * (gsap.utils.toArray(sections).length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        pin: true,
        scrub: 1,
        end: () => '+=' + (containerEl as HTMLElement).offsetWidth,
      },
    })
  },
}
