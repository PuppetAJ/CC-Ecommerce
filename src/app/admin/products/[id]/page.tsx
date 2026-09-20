import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/features/admin/components/product-form'
import { categoryLabels } from '@/features/products/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { getAdminProduct } from '@/lib/db/queries/admin'

export const metadata = { title: 'Edit product · Admin' }

export const instant = false

export default async function Page({ params }: PageProps<'/admin/products/[id]'>) {
  await requireAdmin()
  const id = Number((await params).id)
  const product = Number.isInteger(id) ? await getAdminProduct(id) : null
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/products"
          className="text-sm text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white"
        >
          Back to products
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-tile">
            {product.image_url ? (
              <Image src={product.image_url} alt="" fill sizes="56px" className="object-cover" />
            ) : null}
          </div>
          <div>
            <span className="block text-xs text-olive-600 dark:text-olive-400">
              {categoryLabels[product.category]}
            </span>
            <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">{product.name}</h1>
          </div>
        </div>
      </div>

      <ProductForm product={product} />

      <Link
        href={`/products/${product.slug}`}
        className="self-start text-sm text-olive-600 underline underline-offset-4 dark:text-olive-400"
      >
        See it on the storefront
      </Link>
    </div>
  )
}
