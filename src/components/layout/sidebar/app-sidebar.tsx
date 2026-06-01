import * as React from 'react'
import { Link } from 'react-router-dom'

import type { ShellSidebarConfig } from '@/components/layout/shell/types'
import { NavDocuments } from './nav-documents'
import { NavGrouped } from './nav-grouped'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import { SidebarPromoCard } from './sidebar-promo-card'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  config: ShellSidebarConfig
  isTrainerShell?: boolean
}

export function AppSidebar({
  config,
  isTrainerShell = false,
  className,
  ...props
}: AppSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <Sidebar
      collapsible="offcanvas"
      data-shell-sidebar={isTrainerShell ? 'trainer' : undefined}
      className={cn(isTrainerShell && 'trainer-sidebar border-trainer-border bg-[#080809]', className)}
      {...props}
    >
      <SidebarHeader className={cn(isTrainerShell && 'trainer-sidebar__header')}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                'data-[slot=sidebar-menu-button]:p-1.5!',
                isTrainerShell && 'trainer-sidebar__brand',
              )}
              render={<Link to={config.brand.url ?? '#'} />}
            >
              {isTrainerShell ? (
                <span className="trainer-sidebar__brand-mark">
                  {config.brand.icon}
                </span>
              ) : (
                config.brand.icon
              )}
              <div
                className={cn(
                  'grid flex-1 text-left text-sm leading-tight',
                  isTrainerShell && 'trainer-sidebar__brand-copy',
                )}
              >
                <span
                  className={cn('truncate font-semibold', isTrainerShell && 'trainer-sidebar__brand-title')}
                >
                  {config.brand.title}
                </span>
                {config.brand.subtitle ? (
                  <span
                    className={cn(
                      'truncate text-xs text-muted-foreground',
                      isTrainerShell && 'trainer-sidebar__brand-subtitle',
                    )}
                  >
                    {config.brand.subtitle}
                  </span>
                ) : null}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={cn(isTrainerShell && 'trainer-sidebar__content')}>
        {config.navGroups ? (
          <NavGrouped groups={config.navGroups} />
        ) : (
          <NavMain items={config.navMain} showQuickCreate={config.showQuickCreate} />
        )}
        {config.documents ? (
          <NavDocuments
            label={config.documents.label}
            items={config.documents.items}
          />
        ) : null}
        {config.navSecondary ? (
          <NavSecondary items={config.navSecondary} className="mt-auto" />
        ) : null}
      </SidebarContent>
      {user ? (
        <SidebarFooter className={cn(isTrainerShell && 'trainer-sidebar__footer')}>
          {config.promo ? <SidebarPromoCard promo={config.promo} /> : null}
          <NavUser
            user={{ name: user.name, email: user.email }}
            onLogout={logout}
          />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
