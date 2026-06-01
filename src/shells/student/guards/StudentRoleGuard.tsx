import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { isStudent } from '@/enums/user-role'

const ANAMNESIS_PATH = '/app/anamnese'

export function StudentRoleGuard() {
  const { user, isLoading } = useAuth()
  const { pathname } = useLocation()

  if (isLoading) return null

  if (!user || !isStudent(user.role)) {
    return <Navigate to="/login" replace />
  }

  const anamnesisComplete = user.student?.has_completed_anamnesis ?? false

  // Redireciona para a anamnese se estiver pendente, exceto se já estiver na página
  if (!anamnesisComplete && pathname !== ANAMNESIS_PATH) {
    return <Navigate to={ANAMNESIS_PATH} replace />
  }

  // Se anamnese já foi preenchida e está tentando acessá-la, redireciona para home
  if (anamnesisComplete && pathname === ANAMNESIS_PATH) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
