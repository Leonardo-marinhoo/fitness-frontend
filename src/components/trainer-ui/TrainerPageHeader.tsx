import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TrainerPageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  className?: string
}

export function TrainerPageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: TrainerPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div>
        {eyebrow ? <p className="trainer-eyebrow">{eyebrow}</p> : null}
        <h1 className={cn('trainer-page-title', eyebrow && 'mt-1')}>{title}</h1>
        {description ? <p className="trainer-body mt-1.5 max-w-lg">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}
