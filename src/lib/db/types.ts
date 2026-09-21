export const categories = ['tableware', 'vases', 'lighting', 'furniture', 'textiles', 'storage'] as const
export type Category = (typeof categories)[number]

export const orderStatuses = ['pending', 'paid', 'canceled'] as const
export type OrderStatus = (typeof orderStatuses)[number]

export const eventNames = ['view', 'product_view', 'add_to_cart', 'checkout_started', 'purchase'] as const
export type EventName = (typeof eventNames)[number]

export const reviewSorts = ['helpful', 'recent', 'highest', 'lowest'] as const
export type ReviewSort = (typeof reviewSorts)[number]

export type Product = {
  id: number
  slug: string
  name: string
  description: string
  category: Category
  price_cents: number
  /** Null unless on sale; the effective price is COALESCE(sale_price_cents, price_cents). */
  sale_price_cents: number | null
  stock_quantity: number
  dimensions: string | null
  materials: string | null
  /** Grouped rows for the details table: group name to label to value. */
  specs: Record<string, Record<string, string>>
  image_url: string | null
  is_featured: boolean
  created_at: Date
}

/** A cart row joined to its product, which is what every cart view needs. */
export type CartItem = {
  product_id: number
  slug: string
  name: string
  image_url: string | null
  unit_price_cents: number
  stock_quantity: number
  quantity: number
}

export type OrderItem = {
  product_id: number | null
  product_name: string
  product_slug: string
  image_url: string | null
  quantity: number
  unit_price_cents: number
}

export type Order = {
  id: number
  user_id: string
  status: OrderStatus
  stripe_session_id: string | null
  total_cents: number
  created_at: Date
  paid_at: Date | null
  items: OrderItem[]
}
