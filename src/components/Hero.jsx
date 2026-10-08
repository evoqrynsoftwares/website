import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

// Phones and touch devices get a lighter version: no parallax, no pointer tracking,
// no looping beam animation, no heavy blur or shadows.
const LITE_QUERY = '(max-width: 767px), (pointer: coarse)'
function useLite() {
  const [lite, setLite] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(LITE_QUERY).matches
  )
  useEffect(() => {
    const m = window.matchMedia(LITE_QUERY)
    const on = () => setLite(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return lite
}

// The hero is dark-only, so it uses fixed colours and shadows rather than the theme tokens.
// Buttons use the same dark neumorphism as the rest of the site: raised at rest, pressed on click.
const BTN_PRIMARY =
  'bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] text-white shadow-[10px_10px_24px_rgba(2,1,12,0.7),-5px_-5px_14px_rgba(124,118,255,0.14),0_0_44px_rgba(109,102,255,0.35),inset_1px_1px_2px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-px active:shadow-[inset_6px_6px_14px_rgba(20,14,120,0.7),inset_-4px_-4px_10px_rgba(255,255,255,0.18)]'
const BTN_SECONDARY =
  'bg-[#0c0a26] text-white/80 shadow-[7px_7px_16px_rgba(2,1,12,0.75),-5px_-5px_14px_rgba(124,118,255,0.09)] hover:text-white hover:shadow-[inset_5px_5px_12px_rgba(2,1,12,0.85),inset_-4px_-4px_10px_rgba(124,118,255,0.08)] active:translate-y-px'

const lines = [{ t: 'We engineer' }, { t: 'what comes' }, { t: 'next.', accent: true }]

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const lite = useLite()
  const calm = reduce || lite // no parallax / pointer tracking / looping motion

  /* ---------- scroll parallax: each layer drifts at its own speed ---------- */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const planetY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  /* ---------- pointer parallax: springs give the layers weight ---------- */
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 55, damping: 18, mass: 0.7 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)
  const beamX = useTransform(sx, [-0.5, 0.5], [40, -40])
  const planetX = useTransform(sx, [-0.5, 0.5], [-24, 24])
  const titleX = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const titleY = useTransform(sy, [-0.5, 0.5], [-7, 7])

  useEffect(() => {
    const el = ref.current
    if (!el || calm) return
    let raf = 0
    const move = (e) => {
      if (raf) return
      const { clientX, clientY } = e
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${clientX - r.left}px`)
        el.style.setProperty('--my', `${clientY - r.top}px`)
        px.set((clientX - r.left) / r.width - 0.5)
        py.set((clientY - r.top) / r.height - 0.5)
      })
    }
    const leave = () => {
      px.set(0)
      py.set(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [calm, px, py])

  /* ---------- load sequence (no blur filter on lite) ---------- */
  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 28, ...(lite ? {} : { filter: 'blur(12px)' }) },
    animate: { opacity: 1, y: 0, ...(lite ? {} : { filter: 'blur(0px)' }) },
    transition: { duration: lite ? 0.8 : 1.1, ease, delay },
  })

  const beamBlur = lite ? '' : 'blur-3xl'

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      style={{ '--mx': '50%', '--my': '40%' }}
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#06041a] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] font-sans text-white antialiased"
    >
      {/* ── cinematic stage ── */}

      {/* volumetric light beams that slowly sway */}
      <motion.div aria-hidden="true" style={calm ? undefined : { x: beamX }} className="pointer-events-none absolute inset-0">
        <motion.div
          animate={calm ? undefined : { rotate: [16, 21, 16] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
          style={{ rotate: 16 }}
          className={`absolute -top-[30%] left-[6%] h-[150%] w-[22rem] origin-top will-change-transform bg-gradient-to-b from-[rgba(124,118,255,0.38)] via-[rgba(124,118,255,0.1)] to-transparent sm:w-[30rem] ${beamBlur}`}
        />
        <motion.div
          animate={calm ? undefined : { rotate: [-18, -23, -18] }}
          transition={{ duration: 17, ease: 'easeInOut', repeat: Infinity }}
          style={{ rotate: -18 }}
          className={`absolute -top-[30%] right-[8%] h-[150%] w-[18rem] origin-top will-change-transform bg-gradient-to-b from-[rgba(110,170,255,0.26)] via-[rgba(110,170,255,0.07)] to-transparent sm:w-[24rem] ${beamBlur}`}
        />
      </motion.div>

      {/* pointer glow + pointer-revealed grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--mx)_var(--my),rgba(107,111,247,0.28),transparent_70%)]"
      />
      <motion.div
        aria-hidden="true"
        style={calm ? undefined : { y: gridY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.6, ease, delay: 0.3 }}
        className="pointer-events-none absolute -inset-y-16 inset-x-0 bg-[linear-gradient(rgba(176,181,238,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(176,181,238,0.22)_1px,transparent_1px)] bg-[size:80px_80px] [-webkit-mask-image:radial-gradient(440px_circle_at_var(--mx)_var(--my),#000,transparent_75%)] [mask-image:radial-gradient(440px_circle_at_var(--mx)_var(--my),#000,transparent_75%)]"
      />

      {/* anamorphic lens streak behind the headline */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease, delay: 0.6 }}
        className="pointer-events-none absolute inset-x-0 top-[44%] h-px bg-gradient-to-r from-transparent via-[#c9cbff]/70 to-transparent"
      >
        <span className={`absolute inset-x-[18%] -top-2 h-4 bg-[#6d66ff]/40 ${lite ? '' : 'blur-xl'}`} />
      </motion.div>

      {/* planet horizon: a huge dark disc whose rim catches the light */}
      <motion.div
        aria-hidden="true"
        style={calm ? undefined : { x: planetX, y: planetY }}
        initial={reduce ? false : { opacity: 0, marginTop: '10%' }}
        animate={{ opacity: 1, marginTop: '0%' }}
        transition={{ duration: 2.4, ease, delay: 0.2 }}
        className="pointer-events-none absolute left-1/2 top-[78%] size-[170vmax] -translate-x-1/2 rounded-full"
      >
        <div
          className="size-full rounded-full"
          style={{
            background: 'radial-gradient(55% 35% at 50% 0%, rgba(109,102,255,0.30), #07051c 72%)',
            boxShadow: lite
              ? '0 -1px 0 rgba(205,208,255,0.6), 0 -12px 40px rgba(109,102,255,0.45), inset 0 2px 24px rgba(169,172,255,0.3)'
              : '0 -1px 0 rgba(205,208,255,0.6), 0 -12px 60px rgba(109,102,255,0.5), 0 -70px 180px rgba(109,102,255,0.25), inset 0 2px 40px rgba(169,172,255,0.35)',
          }}
        />
      </motion.div>

      {/* vignette + film grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_40%,rgba(2,1,12,0.8)_100%)]" />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      {/* ── content: moves slower than the page, fades, eases back ── */}
      <motion.div
        style={calm ? undefined : { y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-28 pb-36 text-center sm:px-[5vw] sm:pb-28 lg:px-14"
      >
        <motion.span
          {...rise(0.15)}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#0c0a26] px-4 py-2 text-xs font-medium tracking-wide text-white/70 shadow-[5px_5px_12px_rgba(2,1,12,0.8),-4px_-4px_10px_rgba(124,118,255,0.08)]"
        >
          <span className="relative grid size-2 place-items-center" aria-hidden="true">
            <span className="absolute size-2 animate-ping rounded-full bg-[#a5a0ff]/70" />
            <span className="size-2 rounded-full bg-[#a5a0ff] shadow-[0_0_12px_3px_rgba(143,138,255,0.75)]" />
          </span>
          Technology studio · Web, AI &amp; Marketing
        </motion.span>

        {/* headline: each line rises out of a mask; the last word is the serif accent */}
        <motion.h1
          id="hero-title"
          style={calm ? undefined : { x: titleX, y: titleY }}
          className="my-8 font-display text-[clamp(2.6rem,10.5vw,8.5rem)] leading-[0.98] font-semibold tracking-[-0.045em]"
        >
          {lines.map((line, i) => (
            <span key={line.t} className="block overflow-hidden pr-[0.08em] pb-[0.12em]">
              <motion.span
                initial={reduce ? false : { y: '115%', rotate: 3 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1.3, ease, delay: 0.3 + i * 0.12 }}
                className={
                  line.accent
                    ? 'block origin-left font-serif text-[1.1em] leading-[0.95] font-normal italic tracking-[-0.03em] text-accent-lit [text-shadow:0_0_60px_rgba(109,102,255,0.55)]'
                    : 'block origin-left bg-gradient-to-b from-white via-white to-[#b9bcff] bg-clip-text text-transparent'
                }
              >
                {line.t}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          {...rise(0.85)}
          className="mb-10 max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.65] text-pretty text-[#b9bcee]"
        >
          Websites, AI systems and digital marketing from one team, built for
          businesses ready to move faster and grow smarter.
        </motion.p>

        <motion.div {...rise(1.05)} className="flex w-full flex-wrap justify-center gap-4 sm:w-auto">
          <a
            href="#contact"
            className={`group inline-flex flex-1 basis-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ea8239] sm:flex-none sm:basis-auto ${BTN_PRIMARY}`}
          >
            Contact us
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
          <a
            href="#services"
            className={`group inline-flex flex-1 basis-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a9acff] sm:flex-none sm:basis-auto ${BTN_SECONDARY}`}
          >
            See our services
            <ArrowDown className="size-4 text-[#a9acff] transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}