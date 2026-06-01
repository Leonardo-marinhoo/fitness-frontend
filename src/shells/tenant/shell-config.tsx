import { CommandIcon, LayoutDashboard } from 'lucide-react'

import type { ShellSidebarConfig } from '@/components/layout/shell/types'

export const tenantSidebarConfig: ShellSidebarConfig = {
  brand: {
    title: 'Tenant',
    subtitle: 'Área do cliente',
    url: '/',
    icon: <CommandIcon className="size-5!" />,
  },
  navMain: [
    {
      title: 'Início',
      url: '/',
      icon: <LayoutDashboard />,
      match: (path) => path === '/',
    },
  ],
}

export function getTenantPageTitle(pathname: string): string {
  if (pathname === '/') return 'Início'
  return 'Tenant'
}
