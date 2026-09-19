export function Divider({ label }: { label?: string }) {
  if (!label) return <span className="h-px bg-olive-950/10 dark:bg-white/10" />

  return (
    <div className="flex items-center gap-3 text-xs text-olive-600 dark:text-olive-400">
      <span className="h-px flex-1 bg-olive-950/10 dark:bg-white/10" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-olive-950/10 dark:bg-white/10" />
    </div>
  )
}
