'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { isMobileDevice } from '@/lib/utils'

const FRAME_SKIP = 3

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const needsPaint = useRef(true)

  useEffect(() => {
    if (isMobileDevice()) return

    const initAfterPaint = () => {
      if (!containerRef.current || !needsPaint.current) return
      needsPaint.current = false
      setShowCanvas(true)

      let cleanup: (() => void) | null = null

      const init = async () => {
        const THREE = await import('three')

        if (!containerRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        })

        const dpr = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 0.75 : 1)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(dpr)
        renderer.domElement.style.position = 'fixed'
        renderer.domElement.style.top = '0'
        renderer.domElement.style.left = '0'
        renderer.domElement.style.pointerEvents = 'none'
        renderer.domElement.style.zIndex = '-10'
        renderer.domElement.style.opacity = '0.3'
        containerRef.current.appendChild(renderer.domElement)

        const geometry = new THREE.IcosahedronGeometry(1.8, 0)
        const material = new THREE.MeshBasicMaterial({
          color: 0x111111,
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const particleCount = 30
        const particlesGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 18
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.025,
          color: 0xC9A962,
          transparent: true,
          opacity: 0.25,
        })
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)

        camera.position.z = 7

        gsap.to(mesh.rotation, { x: Math.PI * 2, duration: 150, ease: 'none', repeat: -1, overwrite: 'auto' })
        gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 100, ease: 'none', repeat: -1, overwrite: 'auto' })
        gsap.to(particles.rotation, { y: Math.PI * 2, duration: 240, ease: 'none', repeat: -1, overwrite: 'auto' })
        gsap.to(mesh.position, { y: 0.2, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, overwrite: 'auto' })

        let animationId: number
        let frameCount = 0
        let isVisible = true
        let isPageVisible = true

        const visibilityChange = () => {
          isPageVisible = !document.hidden
        }
        document.addEventListener('visibilitychange', visibilityChange, { passive: true })

        const observer = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting
        }, { threshold: 0 })
        observer.observe(containerRef.current)

        const animate = () => {
          animationId = requestAnimationFrame(animate)
          if (document.hidden || !isVisible || !isPageVisible) return
          frameCount++
          if (frameCount % FRAME_SKIP !== 0) return
          renderer.render(scene, camera)
        }
        animate()

        const handleMouseMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 0.015
          const y = (e.clientY / window.innerHeight - 0.5) * 0.015
          gsap.to(camera.position, { x: -x * 2, y: y * 2, duration: 1.5, ease: 'power2.out', overwrite: 'auto' })
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        let resizeTimeout: ReturnType<typeof setTimeout>
        const handleResize = () => {
          clearTimeout(resizeTimeout)
          resizeTimeout = setTimeout(() => {
            if (!containerRef.current) return
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
          }, 300)
        }
        window.addEventListener('resize', handleResize, { passive: true })

        cleanup = () => {
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('visibilitychange', visibilityChange)
          observer.disconnect()
          cancelAnimationFrame(animationId)
          clearTimeout(resizeTimeout)
          if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
            containerRef.current.removeChild(renderer.domElement)
          }
          geometry.dispose()
          material.dispose()
          particlesGeometry.dispose()
          particlesMaterial.dispose()
          renderer.dispose()
        }
      }

      init()

      return () => {
        if (cleanup) cleanup()
      }
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => initAfterPaint(), { timeout: 2000 })
    } else {
      setTimeout(() => initAfterPaint(), 500)
    }

    return () => { needsPaint.current = false }
  }, [])

  if (!showCanvas) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#050505] via-[#080808] to-[#040404] pointer-events-none" />
    )
  }

  return <div ref={containerRef} className="fixed inset-0 -z-10 hidden md:block" />
}
