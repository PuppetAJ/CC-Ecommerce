// Chrome only: a layout serialises children into the payload, so each page checks the role itself.
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return children
}
