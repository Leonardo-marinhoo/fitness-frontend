import { createBrowserRouter, Navigate } from 'react-router-dom'

import { GuestRoute } from '@/app/auth/GuestRoute'
import { ProtectedRoute } from '@/app/auth/ProtectedRoute'
import { InvitationSignupPage } from '@/app/pages/InvitationSignupPage'
import { LoginPage } from '@/app/pages/LoginPage'
import { UserRole } from '@/enums/user-role'
import { SuperAdminShell } from '@/shells/super-admin/SuperAdminShell'
import { SuperAdminRoleGuard } from '@/shells/super-admin/guards/SuperAdminRoleGuard'
import { SuperAdminDashboardPage } from '@/shells/super-admin/pages/DashboardPage'
import { TrainersPage } from '@/shells/super-admin/pages/TrainersPage'
import { TrainerShell } from '@/shells/trainer/TrainerShell'
import { TrainerRoleGuard } from '@/shells/trainer/guards/TrainerRoleGuard'
import { CreateStudentPage } from '@/shells/trainer/pages/CreateStudentPage'
import { CreateTrainingSheetPage } from '@/shells/trainer/pages/CreateTrainingSheetPage'
import { TrainerDashboardPage } from '@/shells/trainer/pages/DashboardPage'
import { EditStudentPage } from '@/shells/trainer/pages/EditStudentPage'
import { ExercisesPage } from '@/shells/trainer/pages/ExercisesPage'
import { CreatePhysicalAssessmentPage } from '@/shells/trainer/pages/CreatePhysicalAssessmentPage'
import { PhysicalAssessmentsPage } from '@/shells/trainer/pages/PhysicalAssessmentsPage'
import { StudentAnamnesisPage } from '@/shells/trainer/pages/StudentAnamnesisPage'
import { SessionsPage } from '@/shells/trainer/pages/SessionsPage'
import { StudentDetailPage } from '@/shells/trainer/pages/StudentDetailPage'
import { StudentsPage } from '@/shells/trainer/pages/StudentsPage'
import { TrainingSheetDetailPage } from '@/shells/trainer/pages/TrainingSheetDetailPage'
import { TrainingSheetsPage } from '@/shells/trainer/pages/TrainingSheetsPage'
import { StudentShell } from '@/shells/student/StudentShell'
import { StudentRoleGuard } from '@/shells/student/guards/StudentRoleGuard'
import { AnamnesisOnboardingPage } from '@/shells/student/pages/AnamnesisOnboardingPage'
import { EvolucaoPage } from '@/shells/student/pages/EvolucaoPage'
import { StudentHomePage } from '@/shells/student/pages/HomePage'
import { PerfilPage } from '@/shells/student/pages/PerfilPage'
import { SessionsHistoryPage } from '@/shells/student/pages/SessionsHistoryPage'
import { TrainingDayPage } from '@/shells/student/pages/TrainingDayPage'
import { TreinoPage } from '@/shells/student/pages/TreinoPage'
import { WorkoutSessionPage } from '@/shells/student/pages/WorkoutSessionPage'
import type { AuthUser } from '@/types/auth/user'

export function getShellHomePath(role: AuthUser['role']): string {
  if (role === UserRole.SuperAdmin) return '/admin'
  if (role === UserRole.Trainer) return '/trainer'
  return '/app'
}

export const router = createBrowserRouter([
  {
    path: '/convite/:token',
    element: <InvitationSignupPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      // Super Admin
      {
        element: <SuperAdminRoleGuard />,
        children: [
          {
            path: '/admin',
            element: <SuperAdminShell />,
            children: [
              { index: true, element: <SuperAdminDashboardPage /> },
              { path: 'trainers', element: <TrainersPage /> },
            ],
          },
        ],
      },
      // Trainer
      {
        element: <TrainerRoleGuard />,
        children: [
          {
            path: '/trainer',
            element: <TrainerShell />,
            children: [
              { index: true, element: <TrainerDashboardPage /> },
              { path: 'students', element: <StudentsPage /> },
              { path: 'students/new', element: <CreateStudentPage /> },
              { path: 'students/:studentId', element: <StudentDetailPage /> },
              { path: 'students/:studentId/edit', element: <EditStudentPage /> },
              { path: 'students/:studentId/anamnesis', element: <StudentAnamnesisPage /> },
              { path: 'students/:studentId/assessments', element: <PhysicalAssessmentsPage /> },
              { path: 'students/:studentId/assessments/new', element: <CreatePhysicalAssessmentPage /> },
              { path: 'students/:studentId/training-sheets/new', element: <CreateTrainingSheetPage /> },
              { path: 'training-sheets', element: <TrainingSheetsPage /> },
              { path: 'training-sheets/new', element: <CreateTrainingSheetPage /> },
              { path: 'training-sheets/:sheetId', element: <TrainingSheetDetailPage /> },
              { path: 'exercises', element: <ExercisesPage /> },
              { path: 'sessions', element: <SessionsPage /> },
            ],
          },
        ],
      },
      // Student
      {
        element: <StudentRoleGuard />,
        children: [
          // Onboarding de anamnese — fora do StudentShell (sem bottom nav)
          { path: '/app/anamnese', element: <AnamnesisOnboardingPage /> },
          {
            path: '/app',
            element: <StudentShell />,
            children: [
              { index: true, element: <StudentHomePage /> },
              { path: 'treino', element: <TreinoPage /> },
              { path: 'treino/:dayId', element: <TrainingDayPage /> },
              { path: 'workout/:sessionId', element: <WorkoutSessionPage /> },
              { path: 'evolucao', element: <EvolucaoPage /> },
              { path: 'sessions', element: <SessionsHistoryPage /> },
              { path: 'perfil', element: <PerfilPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
