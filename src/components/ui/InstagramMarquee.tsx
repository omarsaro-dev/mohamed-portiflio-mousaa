import { memo } from 'react'
import { INSTAGRAM_MARQUEE_WORDS } from '@/config/instagram'

function InstagramMarquee() {
  const group = (
    <div className="flex flex-shrink-0 items-center">
      {INSTAGRAM_MARQUEE_WORDS.map((word) => (
        <span key={word} className="flex items-center">
          <span className="font-serif text-xl md:text-3xl uppercase tracking-[0.22em] text-white/20 whitespace-nowrap pr-8 md:pr-12">
            {word}
          </span>
          <span className="text-amber-400/40 text-sm md:text-base pr-8 md:pr-12">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div
      className="ig-marquee ig-marquee-mask relative overflow-hidden border-y border-white/5 bg-[#050505]/80 py-6 md:py-8"
      role="presentation"
      aria-hidden="true"
    >
      <div className="ig-marquee-track" style={{ ['--ig-marquee-speed' as string]: '38s' }}>
        {group}
        {group}
      </div>
    </div>
  )
}

export default memo(InstagramMarquee)
