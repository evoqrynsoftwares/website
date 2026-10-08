import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const KEY = 'theme'
const QUERY = '(prefers-color-scheme: dark)'

const systemTheme = () => (window.matchMedia(QUERY).matches ? 'dark' : 'light')

// the visitor's saved choice, or null if they never picked one (= follow the system)
const saved = () => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

const apply = (theme) => {
  document.documentElement.dataset.theme = theme
}

export function useTheme() {
  // index.html's inline script has already set data-theme before first paint, so read it back
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || saved() || systemTheme(),
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)

    // OS theme changed: follow it, unless the visitor has chosen a theme themselves
    const onSystem = () => {
      if (saved()) return
      const t = systemTheme()
      apply(t)
      setTheme(t)
    }
    // another tab changed the choice
    const onStorage = (e) => {
      if (e.key !== KEY) return
      const t = saved() ?? systemTheme()
      apply(t)
      setTheme(t)
    }

    mq.addEventListener('change', onSystem)
    window.addEventListener('storage', onStorage)
    return () => {
      mq.removeEventListener('change', onSystem)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'

    // brief cross-fade, skipped for people who prefer reduced motion
    const root = document.documentElement
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-fade')
      window.setTimeout(() => root.classList.remove('theme-fade'), 400)
    }

    apply(next)
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode: the theme still switches, it just won't be remembered */
    }
  }, [theme])

  return { theme, toggle }
}

// variant 'neu'   = neumorphic button for page surfaces (follows the theme)
// variant 'glass' = translucent white button for the dark glass navbar
const VARIANTS = {
  neu: 'bg-neu text-neu-accent shadow-neu-raised-sm hover:-translate-y-0.5 active:translate-y-px active:shadow-neu-inset-sm focus-visible:outline-neu-accent',
  glass: 'bg-white/10 text-white hover:bg-white/15 focus-visible:outline-white',
}

export default function ThemeToggle({ variant = 'neu', className = 'size-10' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`relative grid place-items-center rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${VARIANTS[variant]} ${className}`}
    >
      <Sun
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-500 motion-reduce:transition-none ${dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-500 motion-reduce:transition-none ${dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
      />
    </button>
  )
}