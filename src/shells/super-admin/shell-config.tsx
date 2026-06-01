import { CommandIcon, Dumbbell, LayoutDashboard } from 'lucide-react'

import type { ShellSidebarConfig } from '@/components/layout/shell/types'

const iconClass = 'size-4'

export const superAdminSidebarConfig: ShellSidebarConfig = {
  brand: {
    title: 'FitnessCode',
    subtitle: 'Super Admin',
    url: '/admin',
    icon: <CommandIcon className="size-5!" />,
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: <LayoutDashboard className={iconClass} />,
      match: (path) => path === '/admin',
    },
    {
      title: 'Trainers',
      url: '/admin/trainers',
      icon: <Dumbbell className={iconClass} />,
      match: (path) => path.startsWith('/admin/trainers'),
    },
  ],
  promo: {
    title: 'Plataforma FitnessCode',
    description: 'Gerencie profissionais e acompanhe o crescimento.',
    ctaLabel: 'Ver trainers',
    ctaUrl: '/admin/trainers',
  },
}

export function getSuperAdminPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard'
  if (pathname === '/admin/trainers') return 'Personal Trainers'
  return 'Super Admin'
}
