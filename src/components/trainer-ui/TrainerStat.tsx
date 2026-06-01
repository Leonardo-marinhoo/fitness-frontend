import type { ElementType } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type TrainerStatProps = {
  label: string
  value: number | string
  icon?: ElementType
  highlight?: boolean
  loading?: boolean
  className?: string
}

export function TrainerStat({
  label,
  value,
  icon: Icon,
  highlight = false,
  loading = false,
  className,
}: TrainerStatProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-trainer-border bg-trainer-surface p-5 transition-colors duration-200 hover:border-trainer-border-strong hover:bg-trainer-surface-hover',
        className,
      )}
    >
      {Icon ? (
        <span className="flex size-9 items-center justify-center rounded-lg border border-trainer-border bg-trainer-bg-elevated text-trainer-muted">
          <Icon size={18} strokeWidth={2} />
        </span>
      ) : null}
      <p className="trainer-eyebrow mt-3">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16 bg-trainer-surface-hover" />
      ) : (
        <p className={cn('trainer-metric mt-1', highlight && 'trainer-metric--accent')}>
          {value}
        </p>
      )}
    </article>
  )
}
