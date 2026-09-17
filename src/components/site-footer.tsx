import {
  FooterCategory,
  FooterLink,
  FooterWithLinkCategories,
} from '@/components/sections/footer-with-link-categories'

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
          </FooterCategory>
          <FooterCategory title="Studio">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </FooterCategory>
          <FooterCategory title="Account">
            <FooterLink href="/login">Log in</FooterLink>
            <FooterLink href="/register">Register</FooterLink>
            <FooterLink href="/account/orders">Orders</FooterLink>
          </FooterCategory>
          <FooterCategory title="Legal">
            <FooterLink href="/privacy">Privacy</FooterLink>
          </FooterCategory>
        </>
      }
      fineprint={<p>© {new Date().getFullYear()} Wicken. A portfolio demo — no real orders are fulfilled.</p>}
    />
  )
}
