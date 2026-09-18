import { clsx } from 'clsx/lite'

// Stands in until the curated photo set lands. Sized so swapping in next/image causes no shift.
export function PhotoPlaceholder({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      className={clsx(
        'flex w-full items-center justify-center bg-tile text-sm text-olive-500 dark:text-olive-600',
        className,
      )}
    >
      {label}
    </div>
  )
}
