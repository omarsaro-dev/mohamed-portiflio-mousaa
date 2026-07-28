export const performanceOptimizations = {
  // Lazy load components
  lazyLoad: (component: () => Promise<any>) => {
    return component
  },

  // Image optimization settings
  imageConfig: {
    quality: 85,
    formats: ['image/avif', 'image/webp'],
    sizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Reduce motion for accessibility
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // GPU acceleration hints
  gpuAccelerated: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)'
    element.style.willChange = 'transform'
  },
}
