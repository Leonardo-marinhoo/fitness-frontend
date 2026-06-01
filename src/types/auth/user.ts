import type { UserRole } from '@/enums/user-role'

export type TrainerProfile = {
  id: number
  user_id: number
  name: string
  cref: string | null
  bio: string | null
  instagram: string | null
  phone: string | null
  photo_url: string | null
}

export type StudentProfile = {
  id: number
  user_id: number
  trainer_id: number
  name: string
  birth_date: string | null
  gender: string | null
  height: number | null
  weight: number | null
  goal: string | null
  training_level: string | null
  physical_limitations: string | null
  injuries: string | null
  photo_url: string | null
  weekly_availability: string[] | null
  gym_name: string | null
  anamnesis_completed_at: string | null
  has_completed_anamnesis: boolean
}

export type AuthUser = {
  id: number
  name: string
  email: string
  role: UserRole
  trainer: TrainerProfile | null
  student: StudentProfile | null
}

export type LoginPayload = {
  email: string
  password: string
}

export type ApiValidationError = {
  message: string
  errors?: Record<string, string[]>
}

export type RegistrationInvitation = {
  id: number
  type: 'trainer' | 'student'
  invited_name: string | null
  email: string | null
  used_at: string | null
  is_used: boolean
  invite_url: string | null
  trainer?: TrainerProfile | null
}
