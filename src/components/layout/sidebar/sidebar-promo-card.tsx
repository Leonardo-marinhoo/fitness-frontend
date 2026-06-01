import { Link } from 'react-router-dom'

import type { ShellSidebarPromo } from '@/components/layout/shell/types'

type SidebarPromoCardProps = {
  promo: ShellSidebarPromo
}

export function SidebarPromoCard({ promo }: SidebarPromoCardProps) {
  return (
    <div className="sidebar-promo-card">
      <span className="sidebar-promo-card__accent" aria-hidden />
      <p className="sidebar-promo-card__title">{promo.title}</p>
      <p className="sidebar-promo-card__desc">{promo.description}</p>
      <Link to={promo.ctaUrl} className="sidebar-promo-card__cta">
        {promo.ctaLabel}
      </Link>
    </div>
  )
}
