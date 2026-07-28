'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create geometry
    const geometry = new THREE.IcosahedronGeometry(2, 0)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x111111, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xC9A962,
      transparent: true,
      opacity: 0.5
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    camera.position.z = 8

    // Animation
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      mesh.rotation.x += 0.001
      mesh.rotation.y += 0.002
      particles.rotation.y += 0.0005
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10 opacity-30" />
}
