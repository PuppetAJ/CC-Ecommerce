'use client'

import { ChevronDownIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react'
import { colorLabels, colorSwatches, materialLabels, priceBandLabels, priceBands, type ShopSearch } from '../schemas'
import type { colors, materials } from '../schemas'

type Material = (typeof materials)[number]
type Color = (typeof colors)[number]

// Drawn, not native: accent-color reaches only the checked fill, never the unchecked box.
const box =
  'flex size-4 shrink-0 items-center justify-center border text-transparent transition-colors ' +
  'border-olive-400 bg-white dark:border-white/20 dark:bg-white/[0.06] ' +
  'peer-checked:border-olive-950 peer-checked:bg-olive-950 peer-checked:text-white ' +
  'dark:peer-checked:border-olive-200 dark:peer-checked:bg-olive-200 dark:peer-checked:text-olive-950 ' +
  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ' +
  'peer-focus-visible:ring-offset-background motion-reduce:transition-none'

const row = 'flex cursor-pointer items-center gap-2.5 text-sm'
const label = 'text-olive-700 dark:text-olive-300'

function Tick() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className="size-3">
      <path d="M2.5 6.2 4.7 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** A checkbox we draw. Round for price, square elsewhere, but a tick either way so the round
 * one is not mistaken for a radio when several bands can be on at once. */
function Check({
  name,
  value,
  children,
  round = false,
  checked,
  onToggle,
}: {
  name: string
  value: string
  children: React.ReactNode
  round?: boolean
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label className={row}>
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span className={`${box} ${round ? 'rounded-full' : 'rounded-sm'}`}>
        <Tick />
      </span>
      <span className={label}>{children}</span>
    </label>
  )
}

/**
 * A heading that folds its group away on a narrow screen. Three open facet lists are most of a
 * phone's height before a single product is seen; on a wide screen the rail has room, so the
 * disclosure stays open and the marker is hidden.
 */
/**
 * Closed on a phone, where three open lists are most of the screen before a single product is
 * seen, and held open on a wide rail where there is room for them.
 *
 * `<details>` rather than a checkbox trick, because it is the element that announces itself as a
 * disclosure. A browser hides its contents with `content-visibility`, which no amount of
 * `display` overrides, so the wide case is driven by the media query rather than by CSS.
 */
function Group({ label, wide, children }: { label: string; wide: boolean; children: React.ReactNode }) {
  return (
    // Uncontrolled on a phone, so a shopper can open and close it freely.
    <details open={wide || undefined} className="group/details">
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between text-sm font-medium text-olive-950 lg:pointer-events-none dark:text-white">
        {label}
        <ChevronDownIcon
          aria-hidden
          className="size-4 text-olive-600 transition-transform group-open/details:rotate-180 lg:hidden dark:text-olive-400"
        />
      </summary>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{label}</legend>
        {children}
      </fieldset>
    </details>
  )
}

/** True once the rail is wide enough to show every facet at once. */
function useWideRail(): boolean {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWide(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return wide
}

/**
 * Real checkboxes in a GET form, so the browser builds the query string and every
 * combination stays a URL that works with JavaScript off.
 *
 * With JavaScript the submit is intercepted and replayed through the router, because a
 * native submit is a full navigation: it reloads the page and throws away the scroll
 * position, which is miserable when the filters are halfway down a long grid.
 */
export function FacetFilters({
  search,
  facets,
}: {
  search: ShopSearch
  facets: { materials: string[]; colors: string[] }
}) {
  const form = useRef<HTMLFormElement>(null)
  const wide = useWideRail()
  const [, start] = useTransition()
  const router = useRouter()
  const submit = () => form.current?.requestSubmit()

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      if (typeof value === 'string' && value) params.append(key, value)
    }
    const query = params.toString()
    start(() => router.replace(query ? `/shop?${query}` : '/shop', { scroll: false }))
  }

  return (
    <form ref={form} action="/shop" onSubmit={apply} className="flex flex-col gap-8">
      {/* Carried so filtering does not silently drop the category, sort or search. */}
      {search.category && <input type="hidden" name="category" value={search.category} />}
      {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
      {search.q && <input type="hidden" name="q" value={search.q} />}

      <Group label="Price" wide={wide}>
        {priceBands.map((band) => (
          <Check
            key={band}
            name="price"
            value={band}
            round
            checked={search.price?.includes(band) ?? false}
            onToggle={submit}
          >
            {priceBandLabels[band]}
          </Check>
        ))}
      </Group>

      <Group label="Material" wide={wide}>
        {facets.materials.map((value) => {
          const material = value as Material
          return (
            <Check
              key={value}
              name="material"
              value={material}
              checked={search.material?.includes(material) ?? false}
              onToggle={submit}
            >
              {materialLabels[material]}
            </Check>
          )
        })}
      </Group>

      <Group label="Color" wide={wide}>
        {/* Swatches alone: the name is the accessible label, not a column of text. */}
        <div className="flex flex-wrap gap-2">
          {facets.colors.map((value) => {
            const color = value as Color
            const on = search.color?.includes(color) ?? false
            const swatch = colorSwatches[color]
            return (
              <label key={value} title={colorLabels[color]} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="color"
                  value={color}
                  defaultChecked={on}
                  onChange={submit}
                  className="peer sr-only"
                />
                <span className="sr-only">{colorLabels[color]}</span>
                <span
                  aria-hidden
                  style={swatch.startsWith('conic') ? { backgroundImage: swatch } : { backgroundColor: swatch }}
                  className={`block size-7 rounded-full border bg-origin-border transition-[box-shadow,border-color] peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
                    on
                      ? 'border-olive-950 ring-2 ring-olive-950 ring-offset-2 dark:border-white dark:ring-white'
                      : 'border-olive-950/20 dark:border-white/25'
                  }`}
                />
              </label>
            )
          })}
        </div>
      </Group>

      <noscript>
        <button
          type="submit"
          className="rounded-lg border border-olive-300 px-3 py-1.5 text-sm text-olive-700 dark:border-olive-800 dark:text-olive-300"
        >
          Apply filters
        </button>
      </noscript>
    </form>
  )
}
