'use client'

import { useRef, useEffect } from 'react'

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const needsPaint = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isMobile) return

    const initAfterPaint = () => {
      if (!containerRef.current || !needsPaint.current) return
      needsPaint.current = false

      let cleanup: (() => void) | null = null

      const init = async () => {
        const THREE = await import('three')

        if (!containerRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: 'low-power',
        })

        const dpr = Math.min(window.devicePixelRatio, 1.5)
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

        const particleCount = 15
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

        let isRotating = true
        let rotationTime = 0
        const rotateSpeed = 0.01

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
          if (frameCount % 3 !== 0) return
          if (isRotating) {
            rotationTime += rotateSpeed
            mesh.rotation.x = rotationTime
            mesh.rotation.y = rotationTime * 1.5
            particles.rotation.y = rotationTime * 0.6
          }
          renderer.render(scene, camera)
        }
        animate()

        const handleMouseMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 0.015
          const y = (e.clientY / window.innerHeight - 0.5) * 0.015
          camera.position.x += (-x * 2 - camera.position.x) * 0.05
          camera.position.y += (y * 2 - camera.position.y) * 0.05
        }

        let mouseMoveTimeout: ReturnType<typeof setTimeout>
        const throttledMouseMove = (e: MouseEvent) => {
          clearTimeout(mouseMoveTimeout)
          mouseMoveTimeout = setTimeout(() => handleMouseMove(e), 16)
        }

        window.addEventListener('mousemove', throttledMouseMove, { passive: true })

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
          window.removeEventListener('mousemove', throttledMouseMove)
          document.removeEventListener('visibilitychange', visibilityChange)
          observer.disconnect()
          cancelAnimationFrame(animationId)
          clearTimeout(resizeTimeout)
          clearTimeout(mouseMoveTimeout)
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

    const scheduleInit = () => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => initAfterPaint(), { timeout: 3000 })
      } else {
        setTimeout(() => initAfterPaint(), 1000)
      }
    }

    scheduleInit()

    return () => { needsPaint.current = false }
  }, [])

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#050505] via-[#080808] to-[#040404] pointer-events-none" />
      <div ref={containerRef} className="fixed inset-0 -z-10 hidden md:block" />
    </>
  )
}
