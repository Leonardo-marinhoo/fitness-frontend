import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TrainerSectionProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function TrainerSection({ title, action, children, className }: TrainerSectionProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      {title || action ? (
        <header className="flex items-center justify-between gap-3">
          {title ? <h2 className="trainer-eyebrow">{title}</h2> : <span />}
          {action}
        </header>
      ) : null}
      {children}
    </section>
  )
}
