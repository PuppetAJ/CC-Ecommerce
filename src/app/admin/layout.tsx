// Chrome only. The role check lives in each page rather than here: a layout receives
// `children` as an already-built element tree and Next serialises it into the flight
// payload, so guarding above it hid the markup from the HTML but still shipped the
// page's JSX to an unauthorised visitor. See docs/phases/04-auth.md.
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return children
}
