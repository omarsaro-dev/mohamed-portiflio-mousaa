'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import type { InstagramPost } from '@/lib/instagram'
import { INSTAGRAM_BLUR_DATA_URL } from '@/lib/instagram'
import { prefersReducedMotion } from '@/lib/utils'
import InstagramIcon from './InstagramIcon'

interface InstagramLightboxProps {
  posts: InstagramPost[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}

export default function InstagramLightbox({ posts, index, onNavigate, onClose }: InstagramLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const directionRef = useRef<0 | 1 | -1>(0)
  const closingRef = useRef(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const post = posts[index]

  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    const overlay = overlayRef.current
    if (!overlay || prefersReducedMotion()) {
      onClose()
      return
    }
    gsap.to(overlay, {
      opacity: 0,
      scale: 0.97,
      duration: 0.35,
      ease: 'power2.in',
      force3D: true,
      onComplete: () => {
        closingRef.current = false
        onClose()
      },
    })
  }, [onClose])

  const go = useCallback(
    (dir: 1 | -1) => {
      if (closingRef.current || posts.length <= 1) return
      directionRef.current = dir
      onNavigate((index + dir + posts.length) % posts.length)
    },
    [index, onNavigate, posts.length]
  )

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'contain'

    const overlay = overlayRef.current
    if (overlay && !prefersReducedMotion()) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } })
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .fromTo(panelRef.current, { opacity: 0, scale: 0.94, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.55 }, '-=0.15')
    }

    closeBtnRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('keydown', handleKey)
      body.style.overflow = prevOverflow
      body.style.overscrollBehavior = ''
      previousFocusRef.current?.focus()
    }
  }, [close, go])

  useEffect(() => {
    const wrap = imageWrapRef.current
    if (!wrap || prefersReducedMotion()) return
    if (directionRef.current === 0) return
    const dir = directionRef.current
    gsap.fromTo(
      wrap,
      { opacity: 0, x: dir * 46, scale: 0.985 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out', force3D: true }
    )
    directionRef.current = 0
  }, [index])

  useEffect(() => {
    const n = posts.length
    const next = posts[(index + 1) % n]
    const prev = posts[(index - 1 + n) % n]
    for (const target of [next, prev]) {
      if (!target) continue
      const img = new window.Image()
      img.src = target.mediaUrl
    }
  }, [posts, index])

  let touchStartX = 0
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(delta) > 50) {
      if (delta < 0) go(1)
      else go(-1)
    }
  }

  if (!post) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Instagram post lightbox"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl md:p-8"
      onClick={close}
    >
      <div
        ref={panelRef}
        className="relative flex w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="mb-4 flex w-full items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            {index + 1} / {posts.length}
          </span>
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Close lightbox"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-300 hover:border-amber-400/60 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          ref={imageWrapRef}
          className="relative aspect-square w-full max-w-[min(76vh,100%)] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
        >
          <Image
            src={post.mediaUrl}
            alt={post.caption || `Instagram post by ${post.username}`}
            fill
            sizes="(max-width: 1024px) 100vw, 76vh"
            priority
            className="object-contain"
            placeholder="blur"
            blurDataURL={INSTAGRAM_BLUR_DATA_URL}
          />
        </div>

        <div className="mt-5 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="max-w-xl text-center font-serif text-sm italic leading-relaxed text-white/60 sm:text-left">
            {post.caption}
          </p>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-amber-400/40 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] text-amber-200 transition-all duration-300 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2"
          >
            <InstagramIcon size={15} />
            View on Instagram
          </a>
        </div>

        {posts.length > 1 && (
          <button
            onClick={() => go(-1)}
            aria-label="Previous post"
            className="absolute -left-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 backdrop-blur-md transition-colors duration-300 hover:border-amber-400/60 hover:text-amber-300 md:flex lg:-left-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {posts.length > 1 && (
          <button
            onClick={() => go(1)}
            aria-label="Next post"
            className="absolute -right-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 backdrop-blur-md transition-colors duration-300 hover:border-amber-400/60 hover:text-amber-300 md:flex lg:-right-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
