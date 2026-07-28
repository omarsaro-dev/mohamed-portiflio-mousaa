'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // Check if device is mobile or touch screen to skip heavy WebGL
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
      setIsMobile(mobile)
      return mobile
    }

    if (checkIsMobile()) return
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    containerRef.current.appendChild(renderer.domElement)

    // Create geometry
    const geometry = new THREE.IcosahedronGeometry(2, 0)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x111111, 
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Create particles (reduced count for performance)
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 60
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xC9A962,
      transparent: true,
      opacity: 0.4
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    camera.position.z = 8

    // Animation with visibility check
    let animationId: number
    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate)
        return
      }

      animationId = requestAnimationFrame(animate)
      
      mesh.rotation.x += 0.0008
      mesh.rotation.y += 0.0015
      particles.rotation.y += 0.0004
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
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
  }, [])

  if (isMobile) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#050505] via-[#080808] to-[#040404] pointer-events-none" />
    )
  }

  return <div ref={containerRef} className="fixed inset-0 -z-10 opacity-30 pointer-events-none hidden md:block" />
}
