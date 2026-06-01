import type { ReactNode } from 'react'

export type ShellNavItem = {
  title: string
  url: string
  icon: ReactNode
  match?: (pathname: string) => boolean
}

export type ShellNavGroup = {
  label: string
  items: ShellNavItem[]
}

export type ShellSidebarPromo = {
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
}

export type ShellSidebarConfig = {
  brand: {
    title: string
    subtitle?: string
    icon?: ReactNode
    url?: string
  }
  navMain: ShellNavItem[]
  navGroups?: ShellNavGroup[]
  navSecondary?: ShellNavItem[]
  documents?: {
    label?: string
    items: { name: string; url: string; icon: ReactNode }[]
  }
  showQuickCreate?: boolean
  promo?: ShellSidebarPromo
}
