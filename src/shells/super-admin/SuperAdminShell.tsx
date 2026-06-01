import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { DashboardShellLayout } from '@/components/layout/shell/dashboard-shell-layout'
import { superAdminSidebarConfig } from '@/shells/super-admin/shell-config'

export function SuperAdminShell() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    return () => {
      const stored = localStorage.getItem('theme')
      if (stored === 'light') {
        root.classList.remove('dark')
      }
    }
  }, [])

  return (
    <DashboardShellLayout sidebar={superAdminSidebarConfig} insetClassName="dashboard-bg">
      <Outlet />
    </DashboardShellLayout>
  )
}
