import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

type SectionEyebrowProps = {
  children: ReactNode
  href?: string
  linkLabel?: string
  className?: string
}

export function SectionEyebrow({ children, href, linkLabel = 'Ver todos', className }: SectionEyebrowProps) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <p className="text-eyebrow">{children}</p>
      {href && (
        <Link to={href} className="text-caption font-medium text-primary hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
