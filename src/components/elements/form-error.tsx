/** role="alert" so a screen reader hears the failure without moving focus. */
export function FormError({ children }: { children: string }) {
  return (
    <p role="alert" className="text-sm text-destructive">
      {children}
    </p>
  )
}
