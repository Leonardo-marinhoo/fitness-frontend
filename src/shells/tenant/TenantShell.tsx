import { Outlet } from 'react-router-dom'

import { DashboardShellLayout } from '@/components/layout/shell/dashboard-shell-layout'
import { tenantSidebarConfig } from '@/shells/tenant/shell-config'

/**
 * Legacy tenant shell — kept for compatibility but routes no longer use this shell.
 */
export function TenantShell() {
  return (
    <DashboardShellLayout sidebar={tenantSidebarConfig}>
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Outlet />
      </div>
    </DashboardShellLayout>
  )
}
