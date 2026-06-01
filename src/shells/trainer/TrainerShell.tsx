import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { DashboardShellLayout } from '@/components/layout/shell/dashboard-shell-layout'
import { useAuth } from '@/contexts/AuthContext'

import { trainerSidebarConfig } from './shell-config'

export function TrainerShell() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isSheetBuilder = /\/training-sheets\/\d+/.test(pathname)

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

  const sidebar = {
    ...trainerSidebarConfig,
    brand: {
      ...trainerSidebarConfig.brand,
      subtitle: user?.trainer?.name ?? 'Personal Trainer',
    },
  }

  return (
    <DashboardShellLayout
      shell="trainer"
      sidebar={sidebar}
      hideHeader={isSheetBuilder}
      flushContent={isSheetBuilder}
      insetClassName={isSheetBuilder ? 'workout-builder-inset' : undefined}
    >
      <Outlet />
    </DashboardShellLayout>
  )
}
