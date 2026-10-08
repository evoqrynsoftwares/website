import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

export const ease = [0.16, 1, 0.3, 1]

export function Reveal({ children, delay = 0, y = 32, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

// word-by-word masked rise, for cinematic headlines
export function Words({ text, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className={`inline-block ${className}`}
            initial={reduce ? false : { y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// button/link that leans toward the cursor
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

// neumorphic card with 3D tilt + soft cursor glow
export function Spot({ children, className = '' }) {
  const reduce = useReducedMotion()
  const gx = useMotionValue(-400)
  const gy = useMotionValue(-400)
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  const rx = useSpring(tx, { stiffness: 140, damping: 18 })
  const ry = useSpring(ty, { stiffness: 140, damping: 18 })
  const glow = useMotionTemplate`radial-gradient(360px circle at ${gx}px ${gy}px, rgba(109,102,255,0.16), transparent 70%)`
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        gx.set(e.clientX - r.left)
        gy.set(e.clientY - r.top)
        if (!reduce) {
          ty.set(((e.clientX - r.left) / r.width - 0.5) * 5)
          tx.set(-((e.clientY - r.top) / r.height - 0.5) * 5)
        }
      }}
      onMouseLeave={() => { tx.set(0); ty.set(0) }}
      className={`neu group relative overflow-hidden ${className}`}
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glow }} />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function Section({ id, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} className={`relative scroll-mt-20 px-5 py-20 sm:px-6 sm:py-28 md:py-40 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="neu-sm !rounded-full inline-flex items-center gap-2.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-lit">
            <span className="led on" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className="text-gradient mt-7 font-display text-[clamp(2.2rem,5.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
            {title}
          </h2>
          {intro && <p className="mt-6 max-w-2xl text-base leading-[1.75] text-ink-soft md:text-lg">{intro}</p>}
        </Reveal>
        <div className="mt-12 md:mt-20">{children}</div>
      </div>
    </section>
  )
}
