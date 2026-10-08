import { motion, useReducedMotion } from 'motion/react'
import { tech } from '../data/site.js'

export default function Marquee() {
  const reduce = useReducedMotion()
  const items = [...tech, ...tech]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#06041a] py-6 sm:py-7 [-webkit-mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-label="Technologies we work with">
      <motion.ul
        className="flex w-max list-none gap-14"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
      >
        {items.map((t, i) => (
          <li key={i} aria-hidden={i >= tech.length} className="flex items-center gap-14 font-display text-lg font-medium tracking-[-0.02em] text-[#b9bcee]/55">
            {t}
            <span className="size-1 rounded-full bg-[#a5a0ff]/60 shadow-[0_0_8px_2px_rgba(143,138,255,0.45)]" aria-hidden="true" />
          </li>
        ))}
      </motion.ul>
    </div>
  )
}