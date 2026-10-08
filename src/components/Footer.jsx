import { Globe } from 'lucide-react'
import { brand, navLinks, slogan } from '../data/site.js'

// Always-dark footer: it does NOT follow the light/dark toggle, so it uses fixed colours
// (the deepest tone of the dark page gradient) instead of the theme tokens.
const SURFACE = 'bg-[#0a0820]'
const RAISED_SM = 'shadow-[5px_5px_12px_rgba(2,1,12,0.8),-4px_-4px_10px_rgba(124,118,255,0.07)]'
const RAISED_XS = 'shadow-[3px_3px_8px_rgba(2,1,12,0.8),-3px_-3px_7px_rgba(124,118,255,0.06)]'
// written out in full (with the hover: prefix) so Tailwind's scanner can see the whole class
const HOVER_INSET_XS = 'hover:shadow-[inset_3px_3px_8px_rgba(2,1,12,0.85),inset_-3px_-3px_7px_rgba(124,118,255,0.06)] focus-visible:shadow-[inset_3px_3px_8px_rgba(2,1,12,0.85),inset_-3px_-3px_7px_rgba(124,118,255,0.06)]'

export default function Footer() {
  return (
    <footer className={`relative overflow-hidden ${SURFACE} px-5 pb-8 pt-14 sm:px-6 sm:pt-16`}>
      {/* subtle glow */}
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl xl:max-w-7xl">
        {/* top row: brand + nav */}
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/[0.06] pb-10 md:flex-row md:items-center">
          <div className="flex items-center gap-3.5">
            <span className={`grid size-11 place-items-center rounded-full ${SURFACE} ${RAISED_SM}`}>
              <Globe className="size-5 text-accent-lit" aria-hidden="true" />
            </span>
            <p className="font-display text-xl font-semibold uppercase tracking-[-0.01em] text-white">{brand}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-3 gap-y-4 text-sm">
              {navLinks.map((l) => (
                <li key={l.label}>
                  {/* raised at rest, pressed in on hover / keyboard focus */}
                  <a
                    href={l.href}
                    className={`inline-block rounded-full ${SURFACE} ${RAISED_XS} px-4 py-2 font-medium text-white/55 transition-all duration-300 hover:text-white ${HOVER_INSET_XS} focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-lit`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* bottom row: slogan + copyright */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-white/40 md:flex-row md:items-center">
          <p>{slogan}</p>
          <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
        </div>

        {/* giant lowercase brand watermark.
            Sized from its container width (cqw), not the viewport, so it always fits. */}
        <div className="mt-10 [container-type:inline-size]" aria-hidden="true">
          <p className="text-gradient pointer-events-none select-none whitespace-nowrap pb-[0.1em] text-center font-display text-[clamp(1.5rem,24cqw,17rem)] font-semibold lowercase leading-none tracking-[-0.04em] opacity-10">
            {brand}
          </p>
        </div>
      </div>
    </footer>
  )
}