'use client'

import { domAnimation, LazyMotion, m, useReducedMotion, type Variants } from 'motion/react'
import { Children, type ReactNode } from 'react'

// Past this many the delay stops growing. Forty-seven tiles at 40ms each would leave the last
// one arriving nearly two seconds in, which is a wait rather than a flourish.
const most = 10

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(index, most) * step, duration: 0.34, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

const step = 0.04

/**
 * Reveals its children one after another.
 *
 * The children arrive **already rendered by the server** and are only wrapped here, so a grid of
 * forty-seven product tiles stays server-rendered and this wrapper is the only thing shipped.
 * Motion's features load on demand: `m` inside `LazyMotion` is about 4.6kb against 34kb for the
 * whole library.
 */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const still = useReducedMotion()
  if (still) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <div className={className}>
        {Children.toArray(children).map((child, index) => (
          <m.div key={index} data-stagger custom={index} variants={rise} initial="hidden" animate="shown">
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
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 16 }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}
