'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/elements/button'

export function SubmitButton({ children, pendingLabel }: { children: string; pendingLabel: string }) {
  // useFormStatus reads the enclosing form, so this stays a leaf and the form
  // itself does not need to thread a pending flag down.
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
      {pending ? pendingLabel : children}
    </Button>
  )
}
