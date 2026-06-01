import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TrainerEmptyStateProps = {
  icon?: ElementType
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function TrainerEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: TrainerEmptyStateProps) {
  return (
    <article
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-trainer-border bg-trainer-surface px-6 py-16 text-center',
        className,
      )}
    >
      {Icon ? <Icon size={40} className="text-trainer-subtle" strokeWidth={1.5} /> : null}
      <p className="text-sm font-medium text-trainer-text">{title}</p>
      {description ? <p className="max-w-sm text-sm text-trainer-muted">{description}</p> : null}
      {action}
    </article>
  )
}
