import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Field({ label, hint, ...props }: { label: string; hint?: string } & ComponentProps<'input'>) {
  return (
    <div className="grid gap-2.5">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} className="h-10" {...props} />
      {hint ? <p className="text-xs text-olive-600 dark:text-olive-400">{hint}</p> : null}
    </div>
  )
}

/** role="alert" so a screen reader hears the failure without moving focus. */
export function FormError({ children }: { children: string }) {
  return (
    <p role="alert" className="text-sm text-destructive">
      {children}
    </p>
  )
}
