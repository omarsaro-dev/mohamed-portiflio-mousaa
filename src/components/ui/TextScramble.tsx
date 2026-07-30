'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TextScrambleProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  scrambleSpeed?: number
  revealOnScroll?: boolean
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function TextScramble({
  text,
  className = '',
  as: Tag = 'span',
  scrambleSpeed = 0.03,
  revealOnScroll = false,
}: TextScrambleProps) {
  const elRef = useRef<HTMLHeadingElement>(null)
  const frameRef = useRef(0)
  const frameRequestRef = useRef<number>(0)
  const queueRef = useRef<{ from: string; to: string; start: number; end: number }[]>([])
  const resolveRef = useRef<(() => void) | null>(null)

  const setChar = useCallback((el: HTMLElement, chars: string[]) => {
    el.textContent = chars.join('')
  }, [])

  const randomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)]
  }, [])

  const doScramble = useCallback(() => {
    const el = elRef.current
    if (!el) return

    const output: string[] = []
    let complete = 0

    for (let i = 0, len = queueRef.current.length; i < len; i++) {
      const item = queueRef.current[i]
      const { from, to, start, end } = item

      if (frameRef.current >= end) {
        output.push(to)
        complete++
        continue
      }

      if (frameRef.current >= start) {
        if (frameRef.current < start + 3) {
          output.push(randomChar())
        } else {
          output.push(randomChar())
        }
        continue
      }

      output.push(from)
    }

    el.textContent = output.join('')

    if (complete === queueRef.current.length) {
      if (resolveRef.current) resolveRef.current()
      return
    }

    frameRef.current++
    frameRequestRef.current = requestAnimationFrame(doScramble)
  }, [randomChar])

  const scramble = useCallback(() => {
    const el = elRef.current
    if (!el) return

    const oldText = el.textContent || ''
    const newText = text
    const length = Math.max(oldText.length, newText.length)

    const queue: { from: string; to: string; start: number; end: number }[] = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 20)
      const end = start + Math.floor(Math.random() * 20) + 10
      queue.push({ from, to, start, end })
    }

    queueRef.current = queue
    frameRef.current = 0
    cancelAnimationFrame(frameRequestRef.current)
    frameRequestRef.current = requestAnimationFrame(doScramble)

    return new Promise<void>((resolve) => {
      resolveRef.current = resolve
    })
  }, [text, doScramble])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const el = elRef.current
    if (!el) return

    el.textContent = text

    if (revealOnScroll) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, [text, revealOnScroll])

  const handleMouseEnter = useCallback(() => {
    scramble()
  }, [scramble])

  return (
    <Tag
      ref={elRef as any}
      className={className}
      onMouseEnter={handleMouseEnter}
      data-scramble
    >
      {text}
    </Tag>
  )
}
