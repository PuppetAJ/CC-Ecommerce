import Link from 'next/link'
import { CheckIcon } from 'lucide-react'
import { colorLabels, colorSwatches, materialLabels, shopHref, toggleFacet, type ShopSearch } from '../schemas'
import type { colors, materials } from '../schemas'

type Material = (typeof materials)[number]
type Color = (typeof colors)[number]

/**
 * Links rather than checkboxes, so every filter combination is a URL and the whole thing
 * works with JavaScript off. aria-pressed carries the state a checkbox would have.
 */
export function FacetFilters({
  search,
  facets,
}: {
  search: ShopSearch
  facets: { materials: [string, number][]; colors: [string, number][] }
}) {
  return (
    <div className="flex flex-col gap-8">
      <Facet title="Material">
        {facets.materials.map(([value, count]) => {
          const material = value as Material
          const on = search.material?.includes(material) ?? false
          return (
            <Pill
              key={value}
              href={shopHref({ ...search, material: toggleFacet(search.material, material) })}
              on={on}
              label={materialLabels[material]}
              count={count}
              facet="material"
            />
          )
        })}
      </Facet>

      <Facet title="Colour">
        {facets.colors.map(([value, count]) => {
          const color = value as Color
          const on = search.color?.includes(color) ?? false
          return (
            <Pill
              key={value}
              href={shopHref({ ...search, color: toggleFacet(search.color, color) })}
              on={on}
              label={colorLabels[color]}
              count={count}
              swatch={colorSwatches[color]}
              facet="color"
            />
          )
        })}
      </Facet>
    </div>
  )
}

function Facet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-olive-950 dark:text-white">{title}</h3>
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">{children}</ul>
    </div>
  )
}

function Pill({
  href,
  on,
  label,
  count,
  swatch,
  facet,
}: {
  href: string
  on: boolean
  label: string
  count: number
  swatch?: string
  facet: 'material' | 'color'
}) {
  return (
    <li>
      <Link
        href={href}
        // aria-pressed belongs to buttons; a link expresses selection with aria-current.
        aria-current={on ? 'true' : undefined}
        data-facet={facet}
        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
          on
            ? 'bg-olive-950/10 font-medium text-olive-950 dark:bg-white/15 dark:text-white'
            : 'text-olive-600 hover:bg-olive-950/5 hover:text-olive-950 dark:text-olive-400 dark:hover:bg-white/5 dark:hover:text-white'
        }`}
      >
        {swatch ? (
          <span
            aria-hidden
            className="size-4 shrink-0 rounded-full border border-olive-950/15 dark:border-white/20"
            style={swatch.startsWith('linear') ? { backgroundImage: swatch } : { backgroundColor: swatch }}
          />
        ) : (
          <span aria-hidden className="flex size-4 shrink-0 items-center justify-center">
            {on ? <CheckIcon className="size-3.5" /> : null}
          </span>
        )}
        <span className="flex-1">{label}</span>
        {on ? <span className="sr-only">selected</span> : null}
        <span className="text-xs text-olive-600 dark:text-olive-400">{count}</span>
      </Link>
    </li>
  )
}
