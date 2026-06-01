import { apiRequest } from '@/api/client'
import type { RegistrationInvitation } from '@/types/auth/user'
import type {
  Exercise,
  MuscleGroup,
  PhysicalAssessment,
  Student,
  TrainerDashboard,
  TrainingDay,
  TrainingExercise,
  TrainingSheet,
  WorkoutSession,
} from '@/types/fitness'

type ListResponse<T> = { data: T[] }
type SingleResponse<T> = { data: T }

// Dashboard
export async function fetchTrainerDashboard(): Promise<TrainerDashboard> {
  const res = await apiRequest<{ data: TrainerDashboard }>('/api/trainer/dashboard')
  return res.data
}

// Students
export async function fetchTrainerStudents(): Promise<Student[]> {
  const res = await apiRequest<ListResponse<Student>>('/api/trainer/students')
  return res.data
}

export async function createStudent(payload: Record<string, unknown>): Promise<Student> {
  const res = await apiRequest<SingleResponse<Student>>('/api/trainer/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function createStudentInvitation(payload: {
  invited_name?: string
}): Promise<RegistrationInvitation> {
  const res = await apiRequest<SingleResponse<RegistrationInvitation>>('/api/trainer/student-invitations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updateStudent(id: number, payload: Record<string, unknown>): Promise<Student> {
  const res = await apiRequest<SingleResponse<Student>>(`/api/trainer/students/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function fetchStudent(id: number): Promise<Student> {
  const res = await apiRequest<SingleResponse<Student>>(`/api/trainer/students/${id}`)
  return res.data
}

export async function deleteStudent(id: number): Promise<void> {
  await apiRequest<void>(`/api/trainer/students/${id}`, { method: 'DELETE' })
}

// Exercises
export async function fetchTrainerExercises(): Promise<Exercise[]> {
  const res = await apiRequest<ListResponse<Exercise>>('/api/trainer/exercises')
  return res.data
}

export async function createExercise(payload: Record<string, unknown>): Promise<Exercise> {
  const res = await apiRequest<SingleResponse<Exercise>>('/api/trainer/exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updateExercise(id: number, payload: Record<string, unknown>): Promise<Exercise> {
  const res = await apiRequest<SingleResponse<Exercise>>(`/api/trainer/exercises/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deleteExercise(id: number): Promise<void> {
  await apiRequest<void>(`/api/trainer/exercises/${id}`, { method: 'DELETE' })
}

export async function uploadExercisePhoto(exerciseId: number, file: File): Promise<string> {
  const form = new FormData()
  form.append('photo', file)

  const response = await fetch(`/api/trainer/exercises/${exerciseId}/upload-photo`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    body: form,
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar foto do exercício.')
  }

  const data = (await response.json()) as { data: { image_url: string } }
  return data.data.image_url
}

// Training Sheets
export async function fetchTrainingSheets(): Promise<TrainingSheet[]> {
  const res = await apiRequest<ListResponse<TrainingSheet>>('/api/trainer/training-sheets')
  return res.data
}

export async function fetchTrainingSheet(id: number): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>(`/api/trainer/training-sheets/${id}`)
  return res.data
}

export async function createTrainingSheet(payload: Record<string, unknown>): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>('/api/trainer/training-sheets', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updateTrainingSheet(
  id: number,
  payload: Record<string, unknown>,
): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>(
    `/api/trainer/training-sheets/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function activateTrainingSheet(id: number): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>(
    `/api/trainer/training-sheets/${id}/activate`,
    { method: 'POST' },
  )
  return res.data
}

export async function duplicateTrainingSheet(
  sheetId: number,
  studentId: number,
): Promise<TrainingSheet> {
  const res = await apiRequest<SingleResponse<TrainingSheet>>(
    `/api/trainer/training-sheets/${sheetId}/duplicate`,
    {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId }),
    },
  )
  return res.data
}

// Training Days
export async function createTrainingDay(
  sheetId: number,
  payload: Record<string, unknown>,
): Promise<TrainingDay> {
  const res = await apiRequest<SingleResponse<TrainingDay>>(
    `/api/trainer/training-sheets/${sheetId}/days`,
    { method: 'POST', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function updateTrainingDay(
  dayId: number,
  payload: Record<string, unknown>,
): Promise<TrainingDay> {
  const res = await apiRequest<SingleResponse<TrainingDay>>(
    `/api/trainer/training-days/${dayId}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function deleteTrainingDay(dayId: number): Promise<void> {
  await apiRequest<void>(`/api/trainer/training-days/${dayId}`, { method: 'DELETE' })
}

// Training Exercises
export async function createTrainingExercise(
  dayId: number,
  payload: Record<string, unknown>,
): Promise<TrainingExercise> {
  const res = await apiRequest<SingleResponse<TrainingExercise>>(
    `/api/trainer/training-days/${dayId}/exercises`,
    { method: 'POST', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function updateTrainingExercise(
  exerciseId: number,
  payload: Record<string, unknown>,
): Promise<TrainingExercise> {
  const res = await apiRequest<SingleResponse<TrainingExercise>>(
    `/api/trainer/training-exercises/${exerciseId}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function deleteTrainingExercise(exerciseId: number): Promise<void> {
  await apiRequest<void>(`/api/trainer/training-exercises/${exerciseId}`, { method: 'DELETE' })
}

// Workout Sessions
export async function fetchWorkoutSessions(): Promise<WorkoutSession[]> {
  const res = await apiRequest<ListResponse<WorkoutSession>>('/api/trainer/workout-sessions')
  return res.data
}

export async function fetchWorkoutSession(id: number): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>(
    `/api/trainer/workout-sessions/${id}`,
  )
  return res.data
}

export async function sendTrainerFeedback(
  sessionId: number,
  feedback: string,
): Promise<WorkoutSession> {
  const res = await apiRequest<SingleResponse<WorkoutSession>>(
    `/api/trainer/workout-sessions/${sessionId}/feedback`,
    { method: 'PATCH', body: JSON.stringify({ trainer_feedback: feedback }) },
  )
  return res.data
}

// Muscle Groups
export async function fetchMuscleGroups(): Promise<MuscleGroup[]> {
  const res = await apiRequest<ListResponse<MuscleGroup>>('/api/trainer/muscle-groups')
  return res.data
}

// Training Sheets by student
export async function fetchStudentTrainingSheets(studentId: number): Promise<TrainingSheet[]> {
  const res = await apiRequest<ListResponse<TrainingSheet>>('/api/trainer/training-sheets')
  return res.data.filter((s) => s.student_id === studentId)
}

// Physical Assessments
export async function fetchStudentAssessments(studentId: number): Promise<PhysicalAssessment[]> {
  const res = await apiRequest<ListResponse<PhysicalAssessment>>(
    `/api/trainer/students/${studentId}/physical-assessments`,
  )
  return res.data
}

export async function fetchAssessment(id: number): Promise<PhysicalAssessment> {
  const res = await apiRequest<SingleResponse<PhysicalAssessment>>(
    `/api/trainer/physical-assessments/${id}`,
  )
  return res.data
}

export async function createAssessment(
  studentId: number,
  payload: Record<string, unknown>,
): Promise<PhysicalAssessment> {
  const res = await apiRequest<SingleResponse<PhysicalAssessment>>(
    `/api/trainer/students/${studentId}/physical-assessments`,
    { method: 'POST', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function updateAssessment(
  id: number,
  payload: Record<string, unknown>,
): Promise<PhysicalAssessment> {
  const res = await apiRequest<SingleResponse<PhysicalAssessment>>(
    `/api/trainer/physical-assessments/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
  return res.data
}

export async function deleteAssessment(id: number): Promise<void> {
  await apiRequest<void>(`/api/trainer/physical-assessments/${id}`, { method: 'DELETE' })
}

export async function uploadAssessmentPhoto(
  assessmentId: number,
  type: string,
  file: File,
): Promise<void> {
  const form = new FormData()
  form.append('type', type)
  form.append('photo', file)

  const response = await fetch(`/api/trainer/physical-assessments/${assessmentId}/photos`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    body: form,
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar foto.')
  }
}
