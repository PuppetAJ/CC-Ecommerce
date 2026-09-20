'use client'

import { useRef } from 'react'
import { colorLabels, colorSwatches, materialLabels, type ShopSearch } from '../schemas'
import type { colors, materials } from '../schemas'

type Material = (typeof materials)[number]
type Color = (typeof colors)[number]

/**
 * Real checkboxes in a GET form, so the browser builds the query string and every
 * combination stays a URL. Submitted on change where there is JavaScript; the button below
 * is the fallback where there is not.
 */
export function FacetFilters({
  search,
  facets,
}: {
  search: ShopSearch
  facets: { materials: string[]; colors: string[] }
}) {
  const form = useRef<HTMLFormElement>(null)
  const submit = () => form.current?.requestSubmit()

  return (
    <form ref={form} action="/shop" className="flex flex-col gap-8">
      {/* Carried so filtering does not silently drop the category, sort or search. */}
      {search.category && <input type="hidden" name="category" value={search.category} />}
      {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
      {search.q && <input type="hidden" name="q" value={search.q} />}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium text-olive-950 dark:text-white">Material</legend>
        {facets.materials.map((value) => {
          const material = value as Material
          return (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                name="material"
                value={material}
                defaultChecked={search.material?.includes(material) ?? false}
                onChange={submit}
                className="size-4 shrink-0 rounded border-olive-400 text-olive-950 focus-visible:ring-2 focus-visible:ring-ring dark:border-olive-600"
              />
              <span className="text-olive-700 dark:text-olive-300">{materialLabels[material]}</span>
            </label>
          )
        })}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-olive-950 dark:text-white">Color</legend>
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
                  className={`block size-7 rounded-full border transition-[box-shadow,border-color] peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
                    on
                      ? 'border-olive-950 ring-2 ring-olive-950 ring-offset-2 dark:border-white dark:ring-white'
                      : 'border-olive-950/20 dark:border-white/25'
                  }`}
                />
              </label>
            )
          })}
        </div>
      </fieldset>

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
