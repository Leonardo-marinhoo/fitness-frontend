import { apiRequest } from '@/api/client'
import type {
  PhysicalAssessment,
  StudentEvolutionSummary,
  TrainingSheet,
  WorkoutSession,
  WorkoutSessionExercise,
} from '@/types/fitness'

type SingleResponse<T> = { data: T }
type ListResponse<T> = { data: T[] }

export async function fetchActiveTrainingSheet(): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>(
    '/api/student/training-sheets/active',
  )
  return res.data
}

export async function fetchStudentWorkoutSessions(): Promise<WorkoutSession[]> {
  const res = await apiRequest<ListResponse<WorkoutSession>>('/api/student/workout-sessions')
  return res.data
}

export async function startWorkoutSession(trainingDayId: number): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>('/api/student/workout-sessions', {
    method: 'POST',
    body: JSON.stringify({ training_day_id: trainingDayId }),
  })
  return res.data
}

export async function fetchWorkoutSession(id: number): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>(
    `/api/student/workout-sessions/${id}`,
  )
  return res.data
}

export async function finishWorkoutSession(
  id: number,
  studentNotes?: string,
): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>(
    `/api/student/workout-sessions/${id}/finish`,
    { method: 'PATCH', body: JSON.stringify({ student_notes: studentNotes }) },
  )
  return res.data
}

export async function cancelWorkoutSession(
  id: number,
  studentNotes?: string,
): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>(
    `/api/student/workout-sessions/${id}/cancel`,
    { method: 'PATCH', body: JSON.stringify({ student_notes: studentNotes }) },
  )
  return res.data
}

export async function recordExercise(
  sessionExerciseId: number,
  data: Record<string, unknown>,
): Promise<WorkoutSessionExercise> {
  const res = await apiRequest<SingleResponse<WorkoutSessionExercise>>(
    `/api/student/workout-session-exercises/${sessionExerciseId}`,
    { method: 'PATCH', body: JSON.stringify(data) },
  )
  return res.data
}

export async function updateAnamnesis(data: Record<string, unknown>): Promise<void> {
  await apiRequest<void>('/api/student/anamnesis', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function uploadAnamnesisPhoto(type: string, file: File): Promise<void> {
  const form = new FormData()
  form.append('type', type)
  form.append('photo', file)

  const response = await fetch('/api/student/anamnesis/photos', {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    body: form,
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar foto.')
  }
}

export async function fetchMyAssessments(): Promise<PhysicalAssessment[]> {
  const res = await apiRequest<ListResponse<PhysicalAssessment>>('/api/student/physical-assessments')
  return res.data
}

export async function fetchMyAssessmentDetail(id: number): Promise<PhysicalAssessment> {
  const res = await apiRequest<SingleResponse<PhysicalAssessment>>(
    `/api/student/physical-assessments/${id}`,
  )
  return res.data
}

export async function fetchStudentProfile(): Promise<Record<string, unknown>> {
  const res = await apiRequest<SingleResponse<Record<string, unknown>>>('/api/student/profile')
  return res.data
}

export async function fetchStudentEvolutionSummary(): Promise<StudentEvolutionSummary> {
  const res = await apiRequest<SingleResponse<StudentEvolutionSummary>>('/api/student/evolution-summary')
  return res.data
}

export async function updateStudentProfile(data: Record<string, unknown>): Promise<void> {
  await apiRequest<void>('/api/student/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
