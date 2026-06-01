import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { getShellHomePath } from '@/routes/index'

export function GuestRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    )
  }

  if (isAuthenticated && user) {
    return <Navigate to={getShellHomePath(user.role)} replace />
  }

  return <Outlet />
}
