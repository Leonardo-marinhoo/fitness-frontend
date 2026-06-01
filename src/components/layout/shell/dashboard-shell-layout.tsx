import type { CSSProperties, ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/header/site-header'
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import type { ShellSidebarConfig } from './types'

/** Mesmas variáveis do block dashboard-01 do shadcn */
const dashboardLayoutStyle = {
  '--sidebar-width': 'calc(var(--spacing) * 72)',
  '--header-height': 'calc(var(--spacing) * 12)',
} as CSSProperties

const trainerDashboardLayoutStyle = {
  ...dashboardLayoutStyle,
  '--sidebar-width': 'calc(var(--spacing) * 56)',
} as CSSProperties

type DashboardShellLayoutProps = {
  sidebar: ShellSidebarConfig
  children: ReactNode
  hideHeader?: boolean
  flushContent?: boolean
  insetClassName?: string
  shell?: 'trainer'
}

export function DashboardShellLayout({
  sidebar,
  children,
  hideHeader = false,
  flushContent = false,
  insetClassName,
  shell,
}: DashboardShellLayoutProps) {
  return (
    <SidebarProvider style={shell === 'trainer' ? trainerDashboardLayoutStyle : dashboardLayoutStyle}>
      <AppSidebar variant="sidebar" config={sidebar} isTrainerShell={shell === 'trainer'} />
      <SidebarInset
        className={cn('dashboard-bg', insetClassName)}
        {...(shell === 'trainer' ? { 'data-shell': 'trainer' } : {})}
      >
        {!hideHeader && <SiteHeader />}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {flushContent ? (
            children
          ) : (
            <div className="@container/main flex min-h-0 flex-1 flex-col">
              <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
                {children}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
