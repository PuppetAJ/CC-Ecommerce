import { FooterCategory, FooterLink, FooterWithLinkCategories } from '@/components/sections/footer-with-link-categories'
import { NewsletterForm } from '@/features/newsletter/components/newsletter-form'

export function SiteFooter() {
  return (
    <FooterWithLinkCategories
      notice={
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-md flex-col gap-2">
            <h2 className="font-display text-xl font-medium text-olive-950 dark:text-white">
              Hear when a batch is out
            </h2>
            <p className="text-sm/6 text-olive-700 dark:text-olive-400">
              One email when something new comes out of the kiln. Nothing else, and it&rsquo;s easy to stop.
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>
      }
      links={
        <>
          <FooterCategory title="Shop">
            <FooterLink href="/shop?category=tableware">Tableware</FooterLink>
            <FooterLink href="/shop?category=vases">Vases</FooterLink>
            <FooterLink href="/shop?category=lighting">Lighting</FooterLink>
            <FooterLink href="/shop?category=furniture">Furniture</FooterLink>
            <FooterLink href="/shop?category=textiles">Textiles</FooterLink>
            <FooterLink href="/shop?category=storage">Storage</FooterLink>
          </FooterCategory>
          <FooterCategory title="Studio">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/about#made">How it is made</FooterLink>
            <FooterLink href="/shop">The collection</FooterLink>
          </FooterCategory>
          <FooterCategory title="Help">
            <FooterLink href="/help#shipping">Shipping</FooterLink>
            <FooterLink href="/help#returns">Returns</FooterLink>
            <FooterLink href="/help#care">Care and repair</FooterLink>
            <FooterLink href="/help#contact">Contact us</FooterLink>
          </FooterCategory>
          <FooterCategory title="Account">
            <FooterLink href="/login">Log in</FooterLink>
            <FooterLink href="/register">Sign up</FooterLink>
            <FooterLink href="/account/orders">Orders</FooterLink>
            <FooterLink href="/cart">Cart</FooterLink>
          </FooterCategory>
          <FooterCategory title="Legal">
            <FooterLink href="/privacy">Privacy</FooterLink>
          </FooterCategory>
        </>
      }
      fineprint="© 2026 Wicken · A portfolio demo. No real orders are fulfilled."
    />
  )
}
