import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react'

const TEXT = 'input, textarea, select'
const INTERACTIVE = 'a, button, summary, label, [role="tab"], [role="button"]'

// scroll-progress line + custom cursor (desktop mouse only, light/dark safe)
export default function Ambient() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 }) // ring trails the dot
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 })

  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState('default') // default | link | text
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const root = document.documentElement
    root.classList.add('has-cursor')

    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true) }
    const over = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      setMode(t.closest(TEXT) ? 'text' : t.closest(INTERACTIVE) ? 'link' : 'default')
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const leave = () => setVisible(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    root.addEventListener('mouseleave', leave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.removeEventListener('mouseleave', leave)
    }
  }, [reduce, x, y])

  const show = visible && mode !== 'text' // over form fields the normal text cursor takes over
  const ringSize = mode === 'link' ? 64 : pressed ? 26 : 38

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduce ? scrollYProgress : bar }}
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-accent via-[#8f8aff] to-accent shadow-[0_0_12px_rgba(91,84,240,0.55)]"
      />

      {enabled && (
        <>
          {/* ring */}
          <motion.div aria-hidden="true" style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[100]">
            <motion.div
              animate={{
                width: ringSize,
                height: ringSize,
                opacity: show ? 1 : 0,
                backgroundColor: mode === 'link' ? 'rgba(91,84,240,0.14)' : 'rgba(91,84,240,0)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="-translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-accent shadow-[0_0_0_1px_rgba(255,255,255,0.55)]"
            />
          </motion.div>

          {/* dot */}
          <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[101]">
            <motion.div
              animate={{ scale: mode === 'link' ? 0 : pressed ? 0.6 : 1, opacity: show ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-white"
            />
          </motion.div>
        </>
      )}
    </>
  )
}