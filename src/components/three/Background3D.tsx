'use client'

import { useRef, useEffect, useState } from 'react'
import { isMobileDevice } from '@/lib/utils'

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showCanvas, setShowCanvas] = useState(false)

  useEffect(() => {
    if (isMobileDevice()) return
    setShowCanvas(true)

    let cleanup: (() => void) | null = null

    const init = async () => {
      const THREE = await import('three')

      if (!containerRef.current) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
      renderer.domElement.style.position = 'fixed'
      renderer.domElement.style.top = '0'
      renderer.domElement.style.left = '0'
      renderer.domElement.style.pointerEvents = 'none'
      renderer.domElement.style.zIndex = '-10'
      renderer.domElement.style.opacity = '0.3'
      containerRef.current.appendChild(renderer.domElement)

      const geometry = new THREE.IcosahedronGeometry(2, 0)
      const material = new THREE.MeshBasicMaterial({
        color: 0x111111,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const particlesGeometry = new THREE.BufferGeometry()
      const particleCount = 40
      const positions = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xC9A962,
        transparent: true,
        opacity: 0.3,
      })
      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)

      camera.position.z = 8

      let animationId: number
      let isVisible = true

      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting
      }, { threshold: 0 })
      observer.observe(containerRef.current)

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        if (document.hidden || !isVisible) return
        mesh.rotation.x += 0.0008
        mesh.rotation.y += 0.0015
        particles.rotation.y += 0.0004
        renderer.render(scene, camera)
      }
      animate()

      let resizeTimeout: ReturnType<typeof setTimeout>
      const handleResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          if (!containerRef.current) return
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }, 200)
      }
      window.addEventListener('resize', handleResize)

      cleanup = () => {
        window.removeEventListener('resize', handleResize)
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
  }, [])

  if (!showCanvas) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#050505] via-[#080808] to-[#040404] pointer-events-none" />
    )
  }

  return <div ref={containerRef} className="fixed inset-0 -z-10 hidden md:block" />
}
