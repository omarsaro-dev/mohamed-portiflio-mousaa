'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { InstagramFeed } from '@/lib/instagram'
import { createPlaceholderFeed } from '@/lib/instagram'
import { prefersReducedMotion, isDesktopPointer, isTouchDevice } from '@/lib/utils'
import InstagramMarquee from '@/components/ui/InstagramMarquee'
import InstagramGalleryCard from '@/components/ui/InstagramGalleryCard'
import InstagramProfileCard from '@/components/ui/InstagramProfileCard'
import InstagramLightbox from '@/components/ui/InstagramLightbox'
import InstagramIcon from '@/components/ui/InstagramIcon'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`

function GallerySkeleton() {
  return (
    <div className="ig-grid grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="ig-shimmer aspect-square rounded-2xl bg-white/[0.03]" />
      ))}
    </div>
  )
}

function Instagram() {
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [feed, setFeed] = useState<InstagramFeed | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: `${8 + ((i * 13) % 84)}%`,
        left: `${3 + ((i * 17) % 90)}%`,
        size: 2 + (i % 3),
      })),
    []
  )

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/instagram', { cache: 'no-store' })
      if (!res.ok) throw new Error('Instagram feed unavailable')
      const data = (await res.json()) as InstagramFeed
      setFeed(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const displayFeed = useMemo(() => feed ?? createPlaceholderFeed(), [feed])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = prefersReducedMotion()
    const touch = isTouchDevice()

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.ig-eyebrow, .ig-title, .ig-subtitle, .ig-card-wrap, .ig-profile-card', { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.fromTo('.ig-eyebrow', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true,
        scrollTrigger: { trigger: '.ig-head', start: 'top 80%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo('.ig-title', { opacity: 0, y: 44 }, {
        opacity: 1, y: 0, duration: 1.1, delay: 0.1, ease: 'power3.out', force3D: true,
        scrollTrigger: { trigger: '.ig-head', start: 'top 78%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo('.ig-subtitle', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.9, delay: 0.25, ease: 'power3.out', force3D: true,
        scrollTrigger: { trigger: '.ig-head', start: 'top 78%', toggleActions: 'play none none reverse' },
      })

      if (status !== 'loading') {
        gsap.fromTo('.ig-card-wrap', { opacity: 0, y: 70, scale: 0.94 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out', force3D: true, overwrite: 'auto',
          scrollTrigger: { trigger: '.ig-grid', start: 'top 84%', once: true },
        })
      }

      gsap.to('.ig-blob-1', { yPercent: 12, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.ig-blob-2', { yPercent: -10, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.ig-blob-3', { yPercent: 8, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.ig-blob-4', { yPercent: -12, duration: 10, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      if (!touch) {
        gsap.utils.toArray<HTMLElement>('.ig-particle').forEach((p) => {
          gsap.fromTo(
            p,
            { y: 0, opacity: 0.08 },
            {
              y: -40 - Math.random() * 60,
              x: (Math.random() - 0.5) * 60,
              opacity: 0.04 + Math.random() * 0.18,
              duration: 9 + Math.random() * 10,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              force3D: true,
            }
          )
        })
      }
    }, section)

    return () => ctx.revert()
  }, [status])

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current
    if (!section) return
    if (!isDesktopPointer() || prefersReducedMotion()) return

    const blobs = Array.from(section.querySelectorAll<HTMLElement>('.ig-blob'))
    const blobSetters = blobs.map((blob, i) => {
      const f = 18 + i * 9
      return {
        sx: gsap.quickTo(blob, 'x', { duration: 1.4, ease: 'power3.out' }),
        sy: gsap.quickTo(blob, 'y', { duration: 1.4, ease: 'power3.out' }),
        f,
      }
    })

    let glowX: ((v: number) => void) | null = null
    let glowY: ((v: number) => void) | null = null
    if (glow) {
      glowX = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power2.out' })
      glowY = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power2.out' })
    }

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      blobSetters.forEach((s) => {
        s.sx(x * s.f)
        s.sy(y * s.f)
      })
      if (glowX && glowY) {
        glowX(e.clientX)
        glowY(e.clientY)
      }
    }

    const onEnter = () => {
      if (glow) gsap.to(glow, { opacity: 1, scale: 1, duration: 0.5, force3D: true })
    }
    const onLeave = () => {
      if (glow) gsap.to(glow, { opacity: 0, scale: 0.85, duration: 0.5, force3D: true })
    }

    const onPointerOver = (e: PointerEvent) => {
      if (glow && (e.target as HTMLElement).closest('.ig-card-wrap')) {
        gsap.to(glow, { scale: 2.2, opacity: 0.9, duration: 0.4, force3D: true })
      }
    }
    const onPointerOut = (e: PointerEvent) => {
      if (glow && (e.target as HTMLElement).closest('.ig-card-wrap')) {
        gsap.to(glow, { scale: 1, opacity: 1, duration: 0.4, force3D: true })
      }
    }

    section.addEventListener('mouseenter', onEnter)
    section.addEventListener('mousemove', onMove, { passive: true })
    section.addEventListener('mouseleave', onLeave)
    section.addEventListener('pointerover', onPointerOver)
    section.addEventListener('pointerout', onPointerOut)

    return () => {
      section.removeEventListener('mouseenter', onEnter)
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      section.removeEventListener('pointerover', onPointerOver)
      section.removeEventListener('pointerout', onPointerOut)
    }
  }, [])

  const glow =
    typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={glowRef}
            className="pointer-events-none fixed left-0 top-0 z-[3] h-[520px] w-[520px] rounded-full opacity-0"
            style={{
              marginLeft: -260,
              marginTop: -260,
              background:
                'radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.05) 35%, transparent 65%)',
            }}
            aria-hidden="true"
          />,
          document.body
        )
      : null

  return (
    <section
      id="instagram"
      ref={sectionRef}
      aria-labelledby="instagram-title"
      className="relative overflow-hidden bg-[#070707] py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="ig-blob ig-blob-1 absolute left-[6%] top-[10%] h-[36vw] w-[36vw] rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="ig-blob ig-blob-2 absolute right-[4%] top-[26%] h-[30vw] w-[30vw] rounded-full bg-[#C9A962]/10 blur-[120px]" />
        <div className="ig-blob ig-blob-3 absolute bottom-[8%] left-[18%] h-[26vw] w-[26vw] rounded-full bg-emerald-500/[0.06] blur-[110px]" />
        <div className="ig-blob ig-blob-4 absolute bottom-[22%] right-[16%] h-[24vw] w-[24vw] rounded-full bg-white/[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
        />
      </div>

      <div className="ig-particles pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="ig-particle absolute rounded-full bg-amber-200/60"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="ig-head mx-auto max-w-3xl px-6 text-center">
          <p className="ig-eyebrow font-mono text-[11px] uppercase tracking-[0.34em] text-amber-400/80">
            The Social Archive
          </p>
          <h2
            id="instagram-title"
            className="ig-title mt-4 font-serif text-4xl uppercase tracking-wide text-[#F5F5F5] md:text-5xl lg:text-6xl"
          >
            Follow the Journey
          </h2>
          <p className="ig-subtitle mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
            Architecture, interiors, materials, site visits and behind-the-scenes moments.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-16">
        <InstagramMarquee />
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-7xl px-6">
        {status === 'error' && (
          <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-6 py-5 backdrop-blur-sm sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Live feed unavailable right now — showing the studio archive.
            </p>
            <button
              onClick={() => void load()}
              className="rounded-full border border-amber-400/40 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-amber-200 transition-colors duration-300 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2"
            >
              Retry Loading
            </button>
          </div>
        )}

        {status === 'loading' && <GallerySkeleton />}

        {status !== 'loading' && (
          <div className="ig-grid grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
            {displayFeed.posts.map((post, i) => (
              <InstagramGalleryCard
                key={post.id}
                post={post}
                index={i}
                onOpen={(idx) => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}

        <InstagramProfileCard feed={displayFeed} status={status} />
      </div>

      {lightboxIndex !== null && displayFeed.posts.length > 0 && (
        <InstagramLightbox
          posts={displayFeed.posts}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {glow}
    </section>
  )
}

export default Instagram
