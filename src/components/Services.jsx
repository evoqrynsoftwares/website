import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, Bot, Check, Code2, Megaphone } from 'lucide-react'
import { services } from '../data/site.js'

const icons = { ai: Bot, web: Code2, marketing: Megaphone }

const images = {
  web: { src: '/web.png', alt: 'Designers and developers building a website' },
  ai: { src: '/ai.png', alt: 'AI system analysing business data' },
  marketing: { src: '/marketing.png', alt: 'Marketing team reviewing campaign results' },
}

/* accent per service. `dark` is the bright cinematic tone, `light` a deeper tone with enough
   contrast on lavender. theme.css picks the right one as --svc for the current theme. */
const palette = {
  web: { glow: 'rgba(109,102,255,0.35)', border: 'rgba(109,102,255,0.25)', dark: '#8b85ff', light: '#5b54f0' },
  ai: { glow: 'rgba(56,189,248,0.30)', border: 'rgba(56,189,248,0.22)', dark: '#38bdf8', light: '#0284c7' },
  marketing: { glow: 'rgba(251,146,60,0.30)', border: 'rgba(251,146,60,0.22)', dark: '#fb923c', light: '#ea580c' },
}

const svcVars = (pal) => ({ '--svc-l': pal.light, '--svc-d': pal.dark, '--svc-glow': pal.glow })

const ease = [0.16, 1, 0.3, 1]

/* every service is in the HTML and described for search engines */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((s, n) => ({
    '@type': 'ListItem',
    position: n + 1,
    item: { '@type': 'Service', name: s.title, serviceType: s.tag, description: s.text },
  })),
}

// stacking only makes sense when a card fits on screen
function useDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const f = () => setD(m.matches)
    f()
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return d
}

const group = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }
const glide = { stiffness: 110, damping: 30, mass: 0.4 }
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

// background orb that drifts at its own speed
function Orb({ y, reduce, color, className }) {
  return (
    <motion.span
      aria-hidden="true"
      style={{ ...(reduce ? {} : { y }), background: `radial-gradient(circle, ${color} 0%, transparent 68%)` }}
      className={`pointer-events-none absolute rounded-full will-change-transform ${className}`}
    />
  )
}

function Card({ s, i, n, progress, flip, stack }) {
  const Icon = icons[s.icon]
  const img = images[s.icon]
  const pal = palette[s.icon]
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(false)

  // inner parallax: photo and chip move at different speeds while the card passes
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(p, [0, 1], ['-5%', '5%'])
  const chipY = useTransform(p, [0, 1], [24, -24])

  // stack: earlier cards ease back as later ones slide over them
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04])
  const motionOn = !reduce

  return (
    <div
      ref={ref}
      className={stack ? 'sticky' : ''}
      style={stack ? { top: `calc(6.5rem + ${i * 1.25}rem)`, zIndex: i + 1 } : undefined}
    >
      <motion.article
        id={`service-${s.icon}`}
        data-service={s.icon}
        aria-labelledby={`service-${s.icon}-title`}
        style={{
          ...(motionOn && stack ? { scale, transformOrigin: 'top center', willChange: 'transform' } : {}),
          ...svcVars(pal),
          '--card-glow': pal.glow,
          '--card-border': pal.border,
          '--card-accent': pal.dark,
        }}
        className="svc service-card group/card grid transform-gpu scroll-mt-28 items-center gap-6 rounded-[2rem] p-4 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8"
      >
        {/* ── image column ── */}
        <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {failed ? (
              <div className="grid size-full place-items-center bg-neu-line text-fg-faint">
                <Icon className="size-20" aria-hidden="true" />
              </div>
            ) : (
              <motion.img
                src={img.src}
                alt={img.alt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                style={motionOn ? { y: imgY } : undefined}
                className="absolute inset-x-0 -top-[7%] h-[114%] w-full object-cover will-change-transform"
              />
            )}
            {/* gradient overlays, tinted to the theme */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#efedff]/50 via-transparent to-transparent dark:from-[#0a0820]/70" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#efedff]/15 to-transparent dark:from-[#0a0820]/30" />
            {/* floating tag chip */}
            <motion.div
              style={{ ...(motionOn ? { y: chipY } : {}), background: 'var(--glass-bg)' }}
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-fg/10 px-3.5 py-2 text-xs font-semibold text-fg backdrop-blur-md"
            >
              <Icon className="size-4" style={{ color: 'var(--svc)' }} aria-hidden="true" />
              {s.tag}
            </motion.div>
          </div>
        </div>

        {/* ── content column ── */}
        <motion.div
          variants={group}
          initial={motionOn ? 'hidden' : false}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="p-1 sm:p-2 lg:col-span-5"
        >
          {/* icon badge: raised neumorphic disc */}
          <motion.span variants={item} className="grid size-12 place-items-center rounded-2xl bg-neu shadow-neu-raised-sm">
            <Icon className="size-6" style={{ color: 'var(--svc)' }} aria-hidden="true" />
          </motion.span>

          {/* title */}
          <motion.h3
            variants={item}
            id={`service-${s.icon}-title`}
            className="mt-5 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-fg"
          >
            {s.title}
          </motion.h3>

          {/* description */}
          <motion.p variants={item} className="mt-4 max-w-[52ch] text-base leading-[1.75] text-fg-soft">
            {s.text}
          </motion.p>

          {/* checklist */}
          <ul className="mt-6 grid gap-3">
            {s.points.map((pt) => (
              <motion.li key={pt} variants={item} className="flex items-start gap-3 text-[15px] font-medium leading-snug text-fg/80">
                <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full" style={{ background: 'var(--svc)' }}>
                  <Check className="size-3 text-white" aria-hidden="true" />
                </span>
                {pt}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <motion.a
            variants={item}
            href="#contact"
            className="service-cta group mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--svc)]"
            style={{
              background: 'linear-gradient(135deg, var(--svc), color-mix(in srgb, var(--svc) 80%, transparent))',
              boxShadow: '0 8px 32px var(--svc-glow), inset 0 1px 1px rgba(255,255,255,0.2)',
            }}
          >
            <span>
              Discuss your project<span className="sr-only"> about {s.tag}</span>
            </span>
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </motion.article>
    </div>
  )
}

export default function ServicesParallax() {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const [active, setActive] = useState(services[0].icon)

  const section = useRef(null)
  const list = useRef(null)

  // background orbs travel at different speeds across the whole section
  const { scrollYProgress: spRaw } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const sp = useSpring(spRaw, glide)
  const orbA = useTransform(sp, [0, 1], ['-10%', '60%'])
  const orbB = useTransform(sp, [0, 1], ['30%', '-40%'])
  const orbC = useTransform(sp, [0, 1], ['50%', '-20%'])

  // progress through the stack
  const { scrollYProgress: lpRaw } = useScroll({ target: list, offset: ['start start', 'end end'] })
  const listProgress = useSpring(lpRaw, glide)

  useEffect(() => {
    const rows = document.querySelectorAll('[data-service]')
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.dataset.service)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  const headLines = ['Everything you need to', 'build, launch and grow.']

  return (
    <section
      ref={section}
      id="services"
      aria-labelledby="services-title"
      className="relative scroll-mt-20 overflow-x-clip px-5 pt-20 pb-24 sm:px-6 sm:pt-24 sm:pb-28 md:pt-28 md:pb-32"
      style={{ background: 'var(--services-bg)' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── background orbs ── */}
      <Orb y={orbA} reduce={reduce} color="rgba(109,102,255,0.12)" className="-left-32 top-10 size-[36rem]" />
      <Orb y={orbB} reduce={reduce} color="rgba(56,189,248,0.08)" className="-right-32 top-1/3 size-[38rem]" />
      <Orb y={orbC} reduce={reduce} color="rgba(251,146,60,0.06)" className="left-1/2 top-2/3 size-[30rem] -translate-x-1/2" />

      {/* subtle grid pattern overlay */}
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
        {/* ── header ── */}
        <header className="grid items-end gap-6 lg:grid-cols-12 lg:gap-16">
          <motion.h2
            id="services-title"
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="font-display text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] lg:col-span-7"
          >
            {headLines.map((l) => (
              <span key={l} className="block overflow-hidden pb-[.1em]">
                <motion.span
                  className="block bg-gradient-to-b from-fg via-fg to-fg-soft bg-clip-text text-transparent"
                  variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1.1, ease } } }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="max-w-[44ch] text-base leading-[1.75] text-fg-soft md:text-lg lg:col-span-5"
          >
            Web, AI and marketing from one team. Use one on its own, or all three together.
          </motion.p>
        </header>

        {/* ── service tab navigation: pressed-in track, lit pill rides inside it ── */}
        <nav aria-label="Services" className="relative z-40 mt-10">
          <ul className="flex w-fit max-w-full items-center gap-1 rounded-full bg-neu p-1.5 shadow-neu-inset-sm">
            {services.map((t) => {
              const on = active === t.icon
              const TabIcon = icons[t.icon]
              return (
                <li key={t.icon}>
                  <a
                    href={`#service-${t.icon}`}
                    aria-current={on ? 'true' : undefined}
                    title={t.tag}
                    style={svcVars(palette[t.icon])}
                    className={`svc relative flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--svc)] md:px-5 ${
                      on ? 'text-white' : 'text-fg-faint hover:text-fg-soft'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="service-pill"
                        transition={{ duration: 0.5, ease }}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, var(--svc), color-mix(in srgb, var(--svc) 60%, transparent))',
                          boxShadow: '0 6px 24px var(--svc-glow)',
                        }}
                      />
                    )}
                    <TabIcon className="relative size-[18px] shrink-0" aria-hidden="true" />
                    <span
                      className={`relative overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:ml-2.5 md:max-w-none md:opacity-100 ${
                        on ? 'ml-2 max-w-[11rem] opacity-100' : 'ml-0 max-w-0 opacity-0'
                      }`}
                    >
                      {t.tag}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── service cards ── */}
        <div ref={list} className="mt-10 grid gap-10 sm:mt-12 lg:gap-24">
          {services.map((s, n) => (
            <Card
              key={s.icon}
              s={s}
              i={n}
              n={services.length}
              progress={listProgress}
              flip={n % 2 === 1}
              stack={desktop && !reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}