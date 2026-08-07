'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import type { InstagramPost } from '@/lib/instagram'
import { INSTAGRAM_BLUR_DATA_URL } from '@/lib/instagram'
import { prefersReducedMotion, isDesktopPointer } from '@/lib/utils'
import InstagramIcon from './InstagramIcon'

interface InstagramGalleryCardProps {
  post: InstagramPost
  index: number
  onOpen: (index: number) => void
}

function InstagramGalleryCard({ post, index, onOpen }: InstagramGalleryCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const alt = post.caption || `Instagram post by ${post.username}`

  useEffect(() => {
    const card = cardRef.current
    const media = mediaRef.current
    if (!card || !media || prefersReducedMotion() || !isDesktopPointer()) return

    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    const rs = gsap.quickTo(card, 'scale', { duration: 0.7, ease: 'power3.out' })
    const mx = gsap.quickTo(media, 'x', { duration: 1, ease: 'power3.out' })
    const my = gsap.quickTo(media, 'y', { duration: 1, ease: 'power3.out' })

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      rx((py - 0.5) * 9)
      ry((px - 0.5) * -11)
      rs(1.02)
      mx((px - 0.5) * -8)
      my((py - 0.5) * -8)
    }

    const handleLeave = () => {
      rx(0)
      ry(0)
      rs(1)
      mx(0)
      my(0)
    }

    card.addEventListener('mousemove', handleMove, { passive: true })
    card.addEventListener('mouseleave', handleLeave, { passive: true })

    return () => {
      card.removeEventListener('mousemove', handleMove)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  useEffect(() => {
    const card = cardRef.current
    const overlay = overlayRef.current
    if (!card || !overlay || prefersReducedMotion()) return

    const handleEnter = () => {
      gsap.fromTo(overlay, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto', force3D: true })
    }
    const handleLeave = () => {
      gsap.to(overlay, { opacity: 0, scale: 0.96, duration: 0.4, ease: 'power3.out', overwrite: 'auto', force3D: true })
    }

    card.addEventListener('mouseenter', handleEnter, { passive: true })
    card.addEventListener('mouseleave', handleLeave, { passive: true })

    return () => {
      card.removeEventListener('mouseenter', handleEnter)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div className="ig-card-wrap will-change-transform">
      <div className="ig-card-float [perspective:1400px]">
        <article
          ref={cardRef}
          className="ig-card group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_24px_60px_rgba(0,0,0,0.55)] will-change-transform [transform-style:preserve-3d] transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.65)]"
        >
            <div ref={mediaRef} className="absolute inset-0 will-change-transform">
              <Image
                src={post.mediaUrl}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                decoding="async"
                placeholder="blur"
                blurDataURL={INSTAGRAM_BLUR_DATA_URL}
                onLoad={() => setLoaded(true)}
                className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {!loaded && <div className="ig-shimmer absolute inset-0 bg-white/[0.04]" />}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div
              ref={overlayRef}
              className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/45 opacity-0"
            >
              <InstagramIcon size={34} className="text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/90 md:text-xs">
                View on Instagram
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`Open Instagram post: ${alt}`}
              className="absolute inset-0 z-[2] rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2"
            />

            <div className="pointer-events-none absolute bottom-3 left-3 right-14 z-[3]">
              <p className="line-clamp-1 text-[11px] text-white/75">{post.caption}</p>
            </div>

            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open this post on Instagram"
              className="absolute bottom-3 right-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur-sm transition-colors duration-300 hover:border-amber-400/60 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80 focus-visible:outline-offset-2"
            >
              <InstagramIcon size={15} />
            </a>
          </article>
        </div>
      </div>
    )
}

export default memo(InstagramGalleryCard)