import { useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { faqs } from '../data/site.js'
import { Reveal } from './ui.jsx'

// neumorphism tokens live in theme.css and switch with the theme (light / dark)
const SURFACE = 'bg-neu'
const RAISED = 'shadow-neu-raised'
const RAISED_SM = 'shadow-neu-raised-sm'
const INSET = 'shadow-neu-inset'

// FAQPage structured data, generated from the same data as the visible answers
const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}).replace(/</g, '\\u003c')

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={`relative scroll-mt-20 overflow-hidden ${SURFACE} px-5 py-20 sm:px-6 sm:py-28 md:py-32 xl:py-40`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* dark theme only: blends the top edge into the About section above */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-28 dark:block" style={{ background: 'linear-gradient(180deg, #0a0820, rgba(16,14,42,0))' }} />

      {/* ambient glows, same family as About */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-32 top-32 size-96 rounded-full bg-accent/6 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-24 size-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.05), transparent 70%)' }} />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:max-w-7xl xl:grid-cols-[0.75fr_1.25fr] xl:gap-24">
        {/* heading: centred on phones/tablets, sticky left column on desktop */}
        <header className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
          <Reveal>
            <span className={`inline-flex items-center gap-2 rounded-full ${SURFACE} ${RAISED_SM} px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neu-accent`}>
              <span className="size-1.5 rounded-full bg-neu-accent" aria-hidden="true" />
              FAQ
            </span>
            <h2 id="faq-title" className="mt-6 font-display text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-fg">
              Frequently asked <em className="font-serif font-normal italic text-neu-accent">questions</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-[1.75] text-fg-soft md:text-lg lg:mx-0">
              Everything you might want to know before we start. Can't find your answer? Just ask.
            </p>
            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] dark:from-accent dark:to-[#8f8aff] px-7 py-3.5 text-sm font-semibold text-white shadow-neu-btn transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neu-accent active:translate-y-px active:shadow-neu-btn-press"
            >
              Ask us anything
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </header>

        {/* accordion: capped and centred below lg, fills its column from lg up */}
        <div className="mx-auto grid w-full max-w-3xl gap-4 sm:gap-5 lg:max-w-none">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} y={16} delay={i * 0.05}>
                {/* closed = raised, open = pressed in */}
                <div className={`rounded-2xl ${SURFACE} transition-shadow duration-500 sm:rounded-3xl ${isOpen ? INSET : RAISED}`}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neu-accent sm:gap-6 sm:rounded-3xl sm:px-6 sm:py-6 md:px-8"
                    >
                      <span className={`font-display text-base font-medium tracking-[-0.02em] transition-colors duration-500 sm:text-lg xl:text-xl text-fg`}>{f.q}</span>
                      <span
                        aria-hidden="true"
                        className={`grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500 sm:size-10 ${
                          isOpen
                            ? 'rotate-45 bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] dark:from-accent dark:to-[#8f8aff] text-white shadow-neu-glow'
                            : `${SURFACE} ${RAISED_SM} text-neu-accent`
                        }`}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>

                  {/* answers stay in the DOM when closed, so search engines can always read them */}
                  <div
                    id={`faq-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      isOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-2xl px-5 pb-6 text-[15px] leading-[1.75] text-fg-soft sm:px-6 md:px-8 xl:text-base">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}