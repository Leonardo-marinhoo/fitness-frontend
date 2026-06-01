import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { isTrainer } from '@/enums/user-role'

export function TrainerRoleGuard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user || !isTrainer(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
