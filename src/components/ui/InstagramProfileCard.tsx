'use client'

import { memo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { InstagramFeed } from '@/lib/instagram'
import { createPlaceholderFeed } from '@/lib/instagram'
import { animations } from '@/lib/animations'
import { prefersReducedMotion } from '@/lib/utils'
import InstagramIcon from './InstagramIcon'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function formatCompact(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  }
  return value.toLocaleString('en-US')
}

interface InstagramProfileCardProps {
  feed: InstagramFeed | null
  status: 'loading' | 'ready' | 'error'
}

function StatCounter({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.textContent = formatCompact(value)
      return
    }
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = formatCompact(Math.round(obj.v))
      },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, delay])

  return (
    <div className="text-center">
      <span ref={ref} className="block font-serif text-3xl tabular-nums text-[#F5F5F5] md:text-4xl">
        0
      </span>
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</span>
    </div>
  )
}

function StatSkeleton() {
  return (
    <div className="flex items-center gap-10 md:gap-16">
      {[0, 1, 2].map((i) => (
        <div key={i} className="text-center">
          <div className="ig-shimmer h-9 w-16 rounded-lg bg-white/5 md:h-10" />
          <div className="mx-auto mt-2 h-2 w-12 rounded-full bg-white/5" />
        </div>
      ))}
    </div>
  )
}

function InstagramProfileCard({ feed, status }: InstagramProfileCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const display = feed ?? createPlaceholderFeed()
  const { profile, stats } = display
  const showSkeleton = status === 'loading'

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(card, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        }
      )
    }, card)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    return animations.magnetic(el, 0.28)
  }, [])

  return (
    <article
      ref={cardRef}
      className="ig-profile-card relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-300/5 blur-3xl" />

      <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-[auto_1fr] md:p-12">
        <div className="mx-auto">
          <div className="relative h-28 w-28 rounded-full border-2 border-amber-400/30 p-1.5 md:h-36 md:w-36">
            <div className="h-full w-full overflow-hidden rounded-full border border-white/10">
              <Image
                src={profile.avatarUrl}
                alt={`Portrait of ${profile.name}`}
                width={144}
                height={144}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/40 bg-[#0A0A0A] text-amber-300">
              <InstagramIcon size={14} />
            </span>
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:justify-start">
            <h3 className="font-serif text-2xl text-[#F5F5F5] md:text-3xl">{profile.name}</h3>
            <span className="font-mono text-sm text-amber-300/80">{profile.handle}</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
            {profile.profession.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/60"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50 md:mx-0">{profile.bio}</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-between gap-6 border-t border-white/5 bg-black/20 px-8 py-7 md:px-12 sm:flex-row">
        {showSkeleton ? (
          <StatSkeleton />
        ) : (
          <div className="flex items-center gap-10 md:gap-16">
            <StatCounter value={stats.posts} label="Posts" />
            <StatCounter value={stats.followers} label="Followers" delay={0.15} />
            <StatCounter value={stats.following} label="Following" delay={0.3} />
          </div>
        )}

        <a
          ref={ctaRef}
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-7 py-3.5 text-black transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 ease-out group-hover:translate-x-full" />
          <InstagramIcon size={17} className="relative transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.2em]">
            Follow on Instagram
          </span>
          <svg
            className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default memo(InstagramProfileCard)
