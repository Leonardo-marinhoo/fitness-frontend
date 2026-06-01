import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type TrainerListRowProps = {
  leading?: ReactNode
  title: string
  meta?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  className?: string
}

export function TrainerListRow({
  leading,
  title,
  meta,
  trailing,
  onClick,
  className,
}: TrainerListRowProps) {
  const content = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-trainer-text">{title}</span>
        {meta ? <span className="mt-1 block text-xs text-trainer-muted">{meta}</span> : null}
      </span>
      {trailing ?? (
        <ArrowRight
          size={14}
          className="shrink-0 text-trainer-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-trainer-muted"
        />
      )}
    </>
  )

  const base = cn(
    'group flex w-full items-center gap-3.5 rounded-xl border border-trainer-border bg-trainer-surface px-4 py-3.5 text-left transition-colors duration-200 hover:border-trainer-border-strong hover:bg-trainer-surface-hover',
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base}>
        {content}
      </button>
    )
  }

  return <article className={base}>{content}</article>
}
