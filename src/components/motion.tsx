'use client'

import { domAnimation, LazyMotion, m, useReducedMotion, type Variants } from 'motion/react'
import { Children, useCallback, useRef, type ReactNode } from 'react'

const step = 0.06
// Past this the delay stops growing, or the last tile of a tall screenful arrives a second late.
const most = 9
// A pause longer than this is a new arrival rather than the same one, so the count starts over.
const apart = 120

const rise: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  // `take` is called here rather than read as a number, which is the point: the place in the
  // queue is claimed when the tile actually starts, not when it was rendered.
  shown: (take: () => number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    // A spring rather than an ease: the small overshoot at the end is what makes the movement
    // read as arriving rather than fading.
    transition: { delay: take() * step, type: 'spring', stiffness: 260, damping: 22 },
  }),
}

/**
 * Reveals its children one after another as they come into view.
 *
 * The children arrive **already rendered by the server** and are only wrapped here, so a grid of
 * forty-seven product tiles stays server-rendered and this wrapper is the only thing shipped.
 * Motion's features load through `LazyMotion`, which is a fraction of the whole library.
 *
 * The delay counts arrivals rather than positions: everything that comes into view together goes
 * one after another in reading order, and a tile scrolled to on its own starts straight away.
 */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const still = useReducedMotion()
  const queue = useRef({ at: 0, next: 0, given: new Map<number, number>() })

  // Remembered per tile, because Motion resolves a variant more than once and a tile that claimed
  // a fresh slot each time would count double and reach the cap four tiles in.
  const take = useCallback((index: number) => {
    const had = queue.current.given.get(index)
    if (had !== undefined) return had

    const now = performance.now()
    if (now - queue.current.at > apart) queue.current.next = 0
    queue.current.at = now
    const slot = Math.min(queue.current.next++, most)
    queue.current.given.set(index, slot)
    return slot
  }, [])

  if (still) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <div className={className}>
        {Children.toArray(children).map((child, index) => (
          <m.div
            key={index}
            data-stagger
            custom={() => take(index)}
            variants={rise}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
          >
            {child}
          </m.div>
        ))}
      </div>
      {/* Motion writes its hidden state into the server markup, so without JavaScript nothing
          would ever be revealed. This puts it back. */}
      <noscript>
        <style>{'[data-stagger]{opacity:1!important;transform:none!important}'}</style>
      </noscript>
    </LazyMotion>
  )
}

/** One thing rising into place, for a heading or a panel rather than a list. */
export function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const still = useReducedMotion()
  if (still) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        data-stagger
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
      >
        {children}
      </m.div>
      <noscript>
        <style>{'[data-stagger]{opacity:1!important;transform:none!important}'}</style>
      </noscript>
    </LazyMotion>
  )
}

/**
 * A spring on a toggle, which is the thing CSS transitions cannot do: the overshoot is what makes
 * it read as a press rather than a fade. Falls back to no movement when motion is not wanted.
 */
export function Pop({ on, children, className }: { on: boolean; children: ReactNode; className?: string }) {
  const still = useReducedMotion()
  if (still) return <span className={className}>{children}</span>

  return (
    <LazyMotion features={domAnimation} strict>
      <m.span
        className={className}
        // Keyed on the state, so the spring replays each time it flips rather than only on mount.
        key={String(on)}
        initial={{ scale: 0.55 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}
