function hasDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export const performanceOptimizations = {
  lazyLoad: (component: () => Promise<any>) => {
    return component
  },

  imageConfig: {
    quality: 85,
    formats: ['image/avif', 'image/webp'],
    sizes: [640, 750, 828, 1080, 1200, 1920],
  },

  prefersReducedMotion: () => {
    if (!hasDOM()) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  gpuAccelerated: (element: HTMLElement) => {
    if (!hasDOM()) return
    element.style.transform = 'translateZ(0)'
    element.style.willChange = 'transform'
  },
}
