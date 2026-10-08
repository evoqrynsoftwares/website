import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { process as steps } from '../data/site.js'
import { Reveal } from './ui.jsx'

// Zigzag timeline: a groove runs down the centre (left edge on phones), cards alternate
// either side of it, and each numbered node lights up as the progress line reaches it.

function Step({ s, i, n, progress, reduce }) {
  const onLeft = i % 2 === 0

  // where along the line this node sits, so it lights up just as the fill reaches it
  const t = Math.min((i + 0.2) / n, 0.97)
  const lit = useTransform(progress, [t - 0.03, t + 0.03], [0, 1])

  return (
    <li className="relative pb-8 pl-16 last:pb-0 md:grid md:grid-cols-2 md:gap-x-20 md:pl-0 lg:gap-x-28">
      {/* node: raised neumorphic disc, gradient fill fades in when reached */}
      <span aria-hidden="true" className="absolute left-0 top-5 z-10 size-12 md:left-1/2 md:size-14 md:-translate-x-1/2">
        <span className="grid size-full place-items-center rounded-full bg-neu font-display text-sm font-semibold text-neu-accent shadow-neu-raised-sm md:text-base">
          0{i + 1}
        </span>
        <motion.span
          style={{ opacity: reduce ? 1 : lit }}
          className="absolute inset-0 grid place-items-center rounded-full bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] font-display text-sm font-semibold text-white shadow-neu-glow md:text-base dark:from-accent dark:to-[#8f8aff]"
        >
          0{i + 1}
        </motion.span>
      </span>

      <Reveal y={24} className={onLeft ? 'md:col-start-1' : 'md:col-start-2'}>
        {/* the little bar (md+) joins the card to the node on the spine */}
        <div
          className={`relative rounded-3xl bg-neu p-5 shadow-neu-raised transition-transform duration-500 hover:-translate-y-1 sm:p-6 md:p-7 md:before:absolute md:before:top-[47px] md:before:h-0.5 md:before:bg-neu-accent/25 ${
            onLeft
              ? 'md:before:-right-10 md:before:w-10 lg:before:-right-14 lg:before:w-14'
              : 'md:before:-left-10 md:before:w-10 lg:before:-left-14 lg:before:w-14'
          }`}
        >
          <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 select-none font-serif text-6xl italic leading-none text-fg/[0.07] sm:text-7xl">
            0{i + 1}
          </span>
          <h3 className="relative pr-14 font-display text-xl font-semibold tracking-[-0.03em] text-fg sm:text-2xl">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="relative mt-2 max-w-md text-[15px] leading-[1.7] text-fg-soft">{s.text}</p>
        </div>
      </Reveal>
    </li>
  )
}

export default function Process() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:py-36"
      style={{ background: 'var(--about-bg)' }}
    >
      {/* ambient glows */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-28 top-0 size-96 rounded-full bg-accent/8 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-20 size-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.06), transparent 70%)' }} />

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
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-neu px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neu-accent shadow-neu-raised-sm">
            <span className="size-1.5 rounded-full bg-neu-accent" aria-hidden="true" />
            How we work
          </span>
          <h2 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            <span className="bg-gradient-to-b from-fg via-fg to-fg-soft bg-clip-text text-transparent">
              A clear process, with{' '}
            </span>
            <em className="font-serif font-normal italic text-neu-accent">no surprises.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.75] text-fg-soft md:text-lg">
            Five steps from first conversation to launch, so you always know where your project stands.
          </p>
        </Reveal>

        <ol ref={ref} className="relative mx-auto mt-14 max-w-5xl list-none md:mt-20">
          {/* groove + progress fill: left edge on phones, centre spine from md */}
          <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-1.5 rounded-full bg-neu shadow-neu-groove md:left-1/2 md:-translate-x-1/2" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : line }}
            className="absolute bottom-6 left-[21px] top-6 w-1.5 origin-top rounded-full bg-gradient-to-b from-accent-lit to-accent md:left-1/2 md:-translate-x-1/2"
          />

          {steps.map((s, i) => (
            <Step key={s.title} s={s} i={i} n={steps.length} progress={line} reduce={reduce} />
          ))}
        </ol>
      </div>
    </section>
  )
}