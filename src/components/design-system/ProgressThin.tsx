import { cn } from '@/lib/utils'

type ProgressThinProps = {
  value: number
  max?: number
  className?: string
}

export function ProgressThin({ value, max = 100, className }: ProgressThinProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div
      className={cn('h-1 w-full overflow-hidden rounded-full bg-[var(--s-border)]', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
