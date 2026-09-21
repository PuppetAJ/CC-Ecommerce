'use client'

import { domAnimation, LazyMotion, m, useReducedMotion, type Variants } from 'motion/react'
import { Children, type ReactNode } from 'react'

// Past this many the delay stops growing. Forty-seven tiles at 60ms each would leave the last
// one arriving nearly three seconds in, which is a wait rather than a flourish.
const most = 8
const step = 0.06

const rise: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  shown: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    // A spring rather than an ease: the small overshoot at the end is what makes the movement
    // read as arriving rather than fading.
    transition: { delay: Math.min(index, most) * step, type: 'spring', stiffness: 260, damping: 22 },
  }),
}

/**
 * Reveals its children one after another as they come into view.
 *
 * The children arrive **already rendered by the server** and are only wrapped here, so a grid of
 * forty-seven product tiles stays server-rendered and this wrapper is the only thing shipped.
 * Motion's features load through `LazyMotion`, which is a fraction of the whole library.
 */
export function Stagger({
  children,
  className,
  /** How many are on screen at the start; the rest wait until they are scrolled to. */
  eager = 8,
}: {
  children: ReactNode
  className?: string
  eager?: number
}) {
  const still = useReducedMotion()
  if (still) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <div className={className}>
        {Children.toArray(children).map((child, index) => (
          <m.div
            key={index}
            data-stagger
            custom={index % (most + 1)}
            variants={rise}
            initial="hidden"
            // Above the fold it plays at once; below it waits, so scrolling keeps revealing.
            {...(index < eager
              ? { animate: 'shown' }
              // A generous margin, so a tile is already on its way in before it is reached and
              // an ordinary scroll never outruns it.
              : { whileInView: 'shown', viewport: { once: true, margin: '240px 0px' } })}
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
