import { useState, useRef } from 'react'
import { ArrowUpRight, ChevronDown, Mail, Phone, CheckCircle } from 'lucide-react'
import { email, phone_number, instagramm, linkedin, nextSteps } from '../data/site.js'
import { Reveal } from './ui.jsx'

// neumorphism tokens live in theme.css and switch with the theme (light / dark)
const SURFACE = 'bg-neu'
const RAISED = 'shadow-neu-raised-lg'
const RAISED_SM = 'shadow-neu-raised-sm'
const INSET = 'shadow-neu-inset-sm'

const field = `${SURFACE} ${INSET} w-full rounded-2xl px-4 py-3.5 text-base text-fg placeholder:text-fg-faint transition-shadow duration-300 focus:outline-2 focus:outline-offset-2 focus:outline-neu-accent/60`

// opens Gmail's compose window (web) instead of the device's default mail app
const gmailUrl = (to, subject = '', body = '') =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const phoneDisplay = `+91 ${phone_number.slice(0, 5)} ${phone_number.slice(5)}`

// brand icons inline so this works with any lucide-react version
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const contactLinks = [
   { label: email, href: gmailUrl(email), Icon: Mail, name: 'Email', external: true },
  { label: phoneDisplay, href: `tel:+91${phone_number}`, Icon: Phone, name: 'Call us' },
  { label: `@${instagramm}`, href: `https://instagram.com/${instagramm}`, Icon: InstagramIcon, name: 'Instagram', external: true },
  { label: linkedin, href: `https://www.linkedin.com/in/${linkedin}`, Icon: LinkedinIcon, name: 'LinkedIn', external: true },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)

  // No backend yet: opens a Gmail compose tab pre-filled with the enquiry.
  const onSubmit = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget))
    const body = `Name: ${d.name}\nEmail: ${d.email}\nService: ${d.service}\n\n${d.message}`
    const url = gmailUrl(email, 'New project enquiry', body)
    const win = window.open(url, '_blank')
    if (win) win.opener = null
    else window.location.href = url // popup blocked: fall back to same tab
    setSent(true)
  }

  const onReset = () => {
    formRef.current?.reset()
    setSent(false)
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`relative scroll-mt-20 overflow-hidden border-t border-neu-line ${SURFACE} px-5 py-20 sm:px-6 sm:py-28 md:py-32 xl:py-40`}
    >
      {/* ambient glows, same family as About and FAQ */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 size-96 rounded-full bg-accent/10 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.05), transparent 70%)' }} />

      <div className="relative mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className={`inline-flex items-center gap-2 rounded-full ${SURFACE} ${RAISED_SM} px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neu-accent`}>
            <span className="size-1.5 rounded-full bg-neu-accent" aria-hidden="true" />
            Contact
          </span>
          <h2 id="contact-title" className="mt-6 font-display text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-fg">
            Let's build what <em className="font-serif font-normal italic text-neu-accent">comes next.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.75] text-fg-soft md:text-lg">
            Tell us about your project and we'll get back to you with next steps.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-24">
          {/* left: direct contact + what happens next */}
          <Reveal>
           

            {/* phone + socials */}
            <ul className="flex flex-wrap gap-3.5">
    {contactLinks.map(({ label, href, Icon, name, external }) => (
      <li key={name}>
        <a
          href={href}
          aria-label={`${name}: ${label}`}
          title={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`inline-flex size-12 items-center justify-center gap-2.5 rounded-full ${SURFACE} ${RAISED_SM} text-sm font-medium text-fg-soft transition-all duration-300 hover:-translate-y-0.5 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neu-accent active:translate-y-px sm:size-auto sm:px-4 sm:py-2.5`}
        >
          <Icon className="size-5 shrink-0 text-neu-accent sm:size-4" aria-hidden="true" />
          <span className="hidden break-all sm:inline">{label}</span>
        </a>
      </li>
    ))}
  </ul>

            <h3 className="mt-12 font-display text-lg font-semibold tracking-[-0.02em] text-fg">What happens next</h3>
            <ol className="mt-6 grid gap-5">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex items-start gap-4 text-[15px] leading-[1.6] text-fg-soft">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full ${SURFACE} ${RAISED_SM} font-serif text-xl italic text-neu-accent`}>{i + 1}</span>
                  <span className="pt-2">{s}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* right: form card */}
          <Reveal delay={0.1}>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              aria-label="Project enquiry"
              className={`grid gap-5 rounded-[2rem] ${SURFACE} ${RAISED} p-6 sm:p-8 md:p-10`}
            >
              <fieldset disabled={sent} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2.5 text-sm font-medium text-fg">
                    Name
                    <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
                  </label>
                  <label className="grid gap-2.5 text-sm font-medium text-fg">
                    Email
                    <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
                  </label>
                </div>

                <label className="grid gap-2.5 text-sm font-medium text-fg">
                  I'm interested in
                  <span className="relative block">
                    <select name="service" className={`${field} cursor-pointer appearance-none pr-12`}>
                      <option className="bg-neu text-fg">Web Development</option>
                      <option className="bg-neu text-fg">AI Development</option>
                      <option className="bg-neu text-fg">Digital Marketing</option>
                      <option className="bg-neu text-fg">Not sure yet</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-neu-accent" aria-hidden="true" />
                  </span>
                </label>

                <label className="grid gap-2.5 text-sm font-medium text-fg">
                  Project details
                  <textarea name="message" required rows={5} className={`${field} resize-y`} placeholder="What are you looking to build or achieve?" />
                </label>
              </fieldset>

              {sent ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-green-100 dark:bg-green-400/10 dark:shadow-[0_0_24px_rgba(74,222,128,0.15)]">
                    <CheckCircle className="size-7 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </span>
                  <p className="text-base font-semibold text-fg">Gmail should be opening in a new tab!</p>
                  <p className="text-sm text-fg-soft">Press send there to deliver it. If nothing opened, email us directly at {email}</p>
                  <button
                    type="button"
                    onClick={onReset}
                    className={`mt-2 rounded-full ${SURFACE} ${RAISED_SM} px-6 py-2.5 text-sm font-medium text-fg-soft transition-all duration-300 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neu-accent active:translate-y-px`}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] dark:from-accent dark:to-[#8f8aff] px-8 py-4 text-sm font-semibold text-white shadow-neu-btn transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neu-accent active:translate-y-px active:shadow-neu-btn-press"
                >
                  Send message
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </button>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}