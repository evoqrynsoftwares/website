import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { brand, navLinks } from '../data/site.js'
import ThemeToggle from './Themetoggle.jsx'

const ease = [0.16, 1, 0.3, 1]

// The navbar is dark glass in both themes, so it uses fixed colours (not the theme tokens).
// Dark neumorphism: raised at rest, pressed on click, inset tracks.
const DISC = 'bg-[#0f0d2e] shadow-[4px_4px_10px_rgba(2,1,12,0.7),-3px_-3px_8px_rgba(124,118,255,0.1)] active:shadow-[inset_3px_3px_8px_rgba(2,1,12,0.85),inset_-2px_-2px_6px_rgba(124,118,255,0.08)]'
const TRACK = 'bg-[#07051c]/60 shadow-[inset_3px_3px_8px_rgba(2,1,12,0.7),inset_-2px_-2px_6px_rgba(124,118,255,0.09)]'
const CTA = 'group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#7b75ff] to-[#5a52ee] font-semibold text-white shadow-[6px_6px_14px_rgba(2,1,12,0.6),-3px_-3px_10px_rgba(124,118,255,0.12),0_0_28px_rgba(109,102,255,0.3),inset_1px_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-px active:translate-y-px active:shadow-[inset_4px_4px_10px_rgba(20,14,120,0.7)]'
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9acff]'

// section ids behind the nav links, for the scroll-spy
const ids = navLinks.map((l) => l.href).filter((h) => h?.startsWith('#') && h.length > 1).map((h) => h.slice(1))

export default function Navbar() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState(null)
  const lastY = useRef(0)

  // lock page scroll while the mobile menu is open; Escape closes it
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // close the menu when the layout switches to the desktop nav
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 940px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // glass gets denser after scrolling; the bar tucks away when scrolling down, returns on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (y > lastY.current + 6 && y > 160) setHidden(true)
      else if (y < lastY.current - 6 || y < 160) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: highlight the link of the section in the middle of the screen
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const isActive = (l) => l.href === `#${active}`

  return (
    <motion.header
      animate={{ y: hidden && !open ? '-140%' : '0%' }}
      transition={{ duration: reduce ? 0 : 0.5, ease }}
      className="fixed inset-x-0 top-[max(0.5rem,env(safe-area-inset-top))] z-50 px-3 sm:top-4 sm:px-6"
    >
      {/* dim backdrop behind the mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="fixed inset-0 -z-10 cursor-default bg-[#06041a]/70 backdrop-blur-md nav:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── the dock ── */}
      <div className={`liquid-glass mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full p-1.5 sm:gap-3 sm:p-2 ${scrolled || open ? 'is-scrolled' : ''}`}>
        {/* brand */}
        <a
          href="#main"
          aria-label={`${brand} home`}
          className={`group inline-flex items-center gap-2.5 rounded-full py-0.5 pr-3 ${FOCUS}`}
        >
            <img src="/logo.png" alt="" aria-hidden="true" className="size-12 object-contain" />

          <span className="font-display text-[1.2rem] font-semibold lowercase tracking-[-0.03em] text-white">{brand}</span>
        </a>

        {/* desktop links: inset track with a raised pill that slides to the active section */}
        <nav className="hidden nav:block" aria-label="Primary">
          <ul className={`m-0 flex list-none items-center gap-0.5 rounded-full p-1 ${TRACK}`}>
            {navLinks.map((l) => {
              const on = isActive(l)
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    aria-current={on ? 'location' : undefined}
                    className={`relative inline-flex rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-300 ${FOCUS} ${on ? 'text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ duration: reduce ? 0 : 0.5, ease }}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[#1a1745] shadow-[3px_3px_8px_rgba(2,1,12,0.7),-2px_-2px_6px_rgba(124,118,255,0.12)]"
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle variant="glass" className="size-11 sm:size-10" />
          <a href="#contact" className={`px-5 py-2.5 text-[13.5px] max-[480px]:hidden ${CTA} ${FOCUS}`}>
            Get started
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full text-white transition-shadow duration-300 nav:hidden ${DISC} ${FOCUS}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="grid place-items-center"
              >
                {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── mobile menu: big numbered links, full-width CTA ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.4, ease }}
            className="liquid-glass is-scrolled mx-auto mt-2 max-h-[calc(100dvh-5.5rem)] max-w-5xl origin-top overflow-y-auto overscroll-contain rounded-[2rem] p-3 nav:hidden"
          >
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {navLinks.map((l, i) => {
                const on = isActive(l)
                return (
                  <motion.li
                    key={l.label}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.05 + i * 0.05 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={on ? 'location' : undefined}
                      className={`flex min-h-14 items-center gap-4 rounded-2xl px-4 transition-all duration-300 ${FOCUS} ${
                        on
                          ? 'bg-[#1a1745] text-white shadow-[inset_4px_4px_10px_rgba(2,1,12,0.6),inset_-3px_-3px_8px_rgba(124,118,255,0.08)]'
                          : 'text-white/75 active:bg-white/[0.06]'
                      }`}
                    >
                      <span className={`font-serif text-lg italic ${on ? 'text-[#a9acff]' : 'text-white/30'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-xl font-medium tracking-[-0.03em]">{l.label}</span>
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={`mt-3 w-full py-4 text-[15px] ${CTA} ${FOCUS}`}
            >
              Get started
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}