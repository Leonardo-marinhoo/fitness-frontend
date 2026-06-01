import type { ReactNode } from 'react'

import { resolveMediaUrl } from '@/lib/media-url'
import { cn } from '@/lib/utils'

type StudentPageHeroProps = {
  kicker?: string
  title: string
  description?: string
  coverImage: string
  badges?: ReactNode
  footer?: ReactNode
  className?: string
}

export function StudentPageHero({
  kicker,
  title,
  description,
  coverImage,
  badges,
  footer,
  className,
}: StudentPageHeroProps) {
  const resolvedCover = resolveMediaUrl(coverImage) ?? coverImage

  return (
    <section className={cn('student-shell__hero-card mb-4', className)}>
      <div
        className="student-shell__hero-media"
        style={{ backgroundImage: `url('${resolvedCover}')` }}
      >
        <div className="student-shell__hero-content">
          {kicker ? <span className="student-shell__hero-kicker">{kicker}</span> : null}
          {badges ? <div className="student-hero-badges">{badges}</div> : null}
          <h1 className="student-hero-title m-0">{title}</h1>
          {description ? <p className="student-hero-description m-0">{description}</p> : null}
          {footer ? <div className="student-hero-footer">{footer}</div> : null}
        </div>
      </div>
    </section>
  )
}
