import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

// Full-bleed looping video.
// Desktop: public/hero.mp4   Phones: optional lighter public/hero-mobile.mp4 (falls back to hero.mp4)
export default function VideoBackground({ style }) {
  const ref = useRef(null)
  const [src, setSrc] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? '/hero-mobile.mp4' : '/hero.mp4',
  )

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const p = v.play()
    if (p?.catch) p.catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause()
  }, [src])

  return (
    <motion.div aria-hidden="true" style={style} className="absolute inset-0 overflow-hidden bg-ground-deep">
      <video
        ref={ref}
        key={src}
        className="size-full object-cover object-[62%_center] md:object-center"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => src !== '/hero.mp4' && setSrc('/hero.mp4')}
      />
    </motion.div>
  )
}
