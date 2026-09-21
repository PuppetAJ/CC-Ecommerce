import { FooterCategory, FooterLink, FooterWithLinkCategories } from '@/components/sections/footer-with-link-categories'

export function SiteFooter() {
  return (
    <FooterWithLinkCategories
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
