import type { ComponentProps } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function Field({ label, hint, ...props }: { label: string; hint?: string } & ComponentProps<'input'>) {
  return (
    <div className="grid gap-2.5">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} className="h-10" {...props} />
      {hint ? <p className="text-xs text-olive-600 dark:text-olive-400">{hint}</p> : null}
    </div>
  )
}
