import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { isSuperAdmin } from '@/enums/user-role'

export function SuperAdminRoleGuard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user || !isSuperAdmin(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
