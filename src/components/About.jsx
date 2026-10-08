import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { audiences, brand, facts, principles, slogan } from '../data/site.js'
import { Reveal, ease } from './ui.jsx'

// Put your image at public/images/about/studio.jpg (landscape, about 1800×900)
const IMAGE = { src: '/about.png', alt: 'Our studio and team at work' }

const STATEMENT = `${brand} is a technology studio for ambitious businesses. We combine software engineering, applied AI and digital marketing, because a great product only matters when the right people find it.`

// true on phones: the "Built for" block then animates with scroll position instead of a timer.
// Read synchronously on first render so the wrong animation never starts.
function useIsMobile() {
  const query = '(max-width: 767px)'
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return m
}

function Count({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const target = parseInt(value, 10)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return
    if (reduce) { setN(target); return }
    const c = animate(0, target, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, target])

  return <span ref={ref}>{Number.isNaN(target) ? value : n}</span>
}

// one word of the scroll-lit statement
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">{children}</motion.span>
}

// ---------- principle: each one reveals when it scrolls into view ----------
const itemV = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }
const ruleV = { hidden: { scaleX: 0 }, show: { scaleX: 1 } }

function Principle({ p, i, mobile }) {
  const reduce = useReducedMotion()
  // phones: no stagger, so each item animates exactly when you reach it
  // wider screens: the three sit in a row, so they cascade left to right
  const delay = mobile ? 0 : i * 0.12

  return (
    <motion.li
      variants={itemV}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease, delay }}
      className="group relative pt-7"
    >
      <span className="absolute inset-x-0 top-0 h-px bg-neu-line" aria-hidden="true" />
      <motion.span
        aria-hidden="true"
        variants={ruleV}
        transition={{ duration: 1, ease, delay: delay + 0.2 }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-accent to-accent-lit"
      />
      <span className="font-serif text-3xl italic text-neu-accent/60 transition-colors duration-500 group-hover:text-neu-accent">0{i + 1}</span>
      <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-fg">{p.title}</h3>
      <p className="mt-2 text-[15px] leading-[1.7] text-fg-soft">{p.text}</p>
    </motion.li>
  )
}

// ---------- audience chip (neumorphic, raised) ----------
function Chip({ a, i, n, progress, scrub }) {
  const reduce = useReducedMotion()
  const start = 0.1 + (i / n) * 0.55 // chips light up one after another as you scroll
  const opacity = useTransform(progress, [start, start + 0.25], [0, 1])
  const y = useTransform(progress, [start, start + 0.25], [16, 0])
  const scale = useTransform(progress, [start, start + 0.25], [0.9, 1])
  const s = scrub && !reduce

  const chipMotion = s
    ? { style: { opacity, y, scale } }
    : {
        initial: reduce ? false : { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease, delay: i * 0.04 },
      }

  return (
    <motion.li {...chipMotion} className="rounded-full bg-neu px-3.5 py-1.5 text-[13px] font-medium text-fg-soft shadow-neu-raised-sm">
      {a}
    </motion.li>
  )
}

// ---------- "Built for" + CTA ----------
function AudienceCta({ scrub }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.98', 'start 0.4'] })
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const btnOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1])
  const btnY = useTransform(scrollYProgress, [0.7, 1], [24, 0])
  const s = scrub && !reduce
  const Shell = s ? 'div' : Reveal

  return (
    <Shell className="mt-14">
      <div ref={ref} className="flex flex-col gap-8 border-t border-neu-line pt-10 md:flex-row md:items-center md:justify-between">
        <div>
          <motion.p style={s ? { opacity: labelOpacity } : undefined} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
            Built for
          </motion.p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {audiences.map((a, i) => (
              <Chip key={a} a={a} i={i} n={audiences.length} progress={scrollYProgress} scrub={scrub} />
            ))}
          </ul>
        </div>
        <motion.a
          href="#contact"
          style={s ? { opacity: btnOpacity, y: btnY } : undefined}
          className="service-cta group inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] px-7 py-3.5 text-sm font-semibold text-white shadow-neu-btn transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neu-accent dark:from-accent dark:to-[#8f8aff]"
        >
          Work with us
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.a>
      </div>
    </Shell>
  )
}

export default function About() {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()
  const [failed, setFailed] = useState(false)

  // statement lights up word by word as you scroll
  const textRef = useRef(null)
  const { scrollYProgress: textP } = useScroll({ target: textRef, offset: ['start 0.85', 'end 0.5'] })
  const words = STATEMENT.split(' ')

  // image parallax
  const imgRef = useRef(null)
  const { scrollYProgress: imgP } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(imgP, [0, 1], ['-9%', '9%'])
  const imgScale = useTransform(imgP, [0, 0.5, 1], [1.14, 1.06, 1.14])

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:py-36"
      style={{ background: 'var(--about-bg)' }}
    >
      {/* ambient glows */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-accent/6 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-40 size-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.05), transparent 70%)' }} />

      {/* subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 'var(--grid-opacity)',
          backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* label row */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neu-accent">About us</span>
            <span className="h-px flex-1 bg-neu-line" aria-hidden="true" />
            <span className="hidden text-xs font-medium text-fg-faint sm:block">{slogan}</span>
          </div>
        </Reveal>

        {/* scroll-lit statement */}
        <p
          ref={textRef}
          aria-label={STATEMENT}
          className="mt-10 max-w-5xl font-display text-[clamp(1.65rem,3.8vw,3.1rem)] font-medium leading-[1.2] tracking-[-0.03em] text-fg"
        >
          {reduce
            ? STATEMENT
            : words.map((w, i) => (
                <Word key={i} progress={textP} range={[(i / words.length) * 0.85, ((i + 1) / words.length) * 0.85]}>
                  {w}
                </Word>
              ))}
        </p>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-base leading-[1.8] text-fg-soft">
            {/* TODO: add your founding story, team and mission here */}
            We work as an extension of your team: we listen first, keep things simple and build for the long term.
          </p>
        </Reveal>

        {/* wide parallax image with stats overlay */}
        <motion.div
          ref={imgRef}
          initial={reduce ? false : { clipPath: 'inset(12% 8% 12% 8% round 2rem)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.4, ease }}
          className="relative mt-14 aspect-[4/3] overflow-hidden rounded-[2rem] border border-neu-line shadow-neu-image sm:aspect-[16/10] md:mt-20 md:aspect-[21/9]"
        >
          {failed ? null : (
            <motion.img
              src={IMAGE.src}
              alt={IMAGE.alt}
              loading="lazy"
              onError={() => setFailed(true)}
              style={reduce ? undefined : { y: imgY, scale: imgScale }}
              className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover"
            />
          )}
          {/* cinematic gradient overlays: tinted to the theme so the stats panel stays readable */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#efedff]/60 via-transparent to-transparent dark:from-[#0a0820]/70" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#efedff]/20 to-transparent dark:from-[#0a0820]/30" />

          <ul
            className="absolute inset-x-3 bottom-3 grid grid-cols-3 divide-x divide-fg/[0.08] rounded-2xl border border-fg/10 py-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:py-5 md:left-auto md:right-8 md:bottom-8 md:w-[26rem]"
            style={{ background: 'var(--glass-bg)' }}
          >
            {facts.map((f) => (
              <li key={f.label} className="px-3 text-center sm:px-5">
                <p className="font-serif text-4xl italic leading-none text-neu-accent sm:text-5xl">
                  <Count value={f.value} />
                </p>
                <p className="mt-2 text-[11px] font-medium leading-tight text-fg-soft sm:text-xs">{f.label}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* principles */}
        <ul className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          {principles.map((p, i) => (
            <Principle key={p.title} p={p} i={i} mobile={isMobile} />
          ))}
        </ul>

        {/* audiences + CTA */}
        <AudienceCta key={String(isMobile)} scrub={isMobile} />
      </div>
    </section>
  )
}