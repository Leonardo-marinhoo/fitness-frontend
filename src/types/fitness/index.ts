import type { TrainerProfile } from '@/types/auth/user'

export type MuscleGroup = {
  id: number
  name: string
}

export type Exercise = {
  id: number
  name: string
  description: string | null
  muscle_group: MuscleGroup | null
  category: string | null
  equipment: string | null
  video_url: string | null
  image_url: string | null
  instructions: string | null
  is_global: boolean
  created_by_trainer_id: number | null
}

export type TrainingExerciseSet = {
  id: number
  set_number: number
  set_type: string
  target_reps: number | null
  target_reps_min: number | null
  target_reps_max: number | null
  target_weight: number | null
  duration_seconds: number | null
  distance_meters: number | null
  rest_seconds: number | null
  rir: number | null
  rpe: number | null
  notes: string | null
}

export type TrainingExercise = {
  id: number
  training_day_id: number
  exercise: Exercise
  order: number
  series_mode: 'simple' | 'advanced'
  prescription_type: 'reps' | 'time' | 'distance' | 'calories' | 'rounds' | 'custom'
  sets: number | null
  reps_min: number | null
  reps_max: number | null
  reps_text: string | null
  duration_seconds: number | null
  distance_meters: number | null
  target_weight: number | null
  rest_seconds: number | null
  cadence: string | null
  rir: number | null
  rpe: number | null
  notes: string | null
  sets_detail: TrainingExerciseSet[] | null
}

export type TrainingDay = {
  id: number
  training_sheet_id: number
  name: string
  description: string | null
  muscle_group: MuscleGroup | null
  day_of_week: string | null
  order: number
  notes: string | null
  training_exercises: TrainingExercise[] | null
}

export type TrainingSheet = {
  id: number
  student_id: number
  trainer_id: number
  name: string
  goal: string | null
  division_type: string | null
  start_date: string
  end_date: string | null
  status: 'draft' | 'active' | 'paused' | 'finished' | 'replaced' | 'archived'
  general_notes: string | null
  training_days: TrainingDay[] | null
}

export type StudentAnamnesisPhoto = {
  type: string
  image_url: string
}

export type Student = {
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
  gym_name: string | null
  physical_limitations: string | null
  injuries: string | null
  photo_url: string | null
  anamnesis_completed_at: string | null
  has_completed_anamnesis: boolean
  anamnesis_viewed_by_trainer_at: string | null
  anamnesis_viewed_by_trainer: boolean
  anamnesis_photos?: StudentAnamnesisPhoto[]
  created_at?: string
}

export type TrainerDashboard = {
  total_students: number
  active_sheets: number
  sessions_today: number
  sessions_this_week: number
  pending_anamneses: Student[]
  new_students_this_month: Student[]
}

export type WorkoutSessionExercise = {
  id: number
  training_exercise_id: number
  exercise_id: number
  status: string
  performed_sets: number | null
  performed_reps: number | null
  performed_weight: number | null
  difficulty: number | null
  pain_level: number | null
  student_feedback: string | null
  exercise?: Exercise | null
  training_exercise: TrainingExercise
}

export type WorkoutSession = {
  id: number
  student_id: number
  trainer_id: number
  trainer?: TrainerProfile | null
  training_sheet_id: number
  training_day_id: number
  training_day: TrainingDay | null
  started_at: string | null
  finished_at: string | null
  status: 'started' | 'completed' | 'skipped' | 'cancelled'
  student_notes: string | null
  trainer_feedback: string | null
  duration_in_minutes: number | null
  was_resumed?: boolean
  exercises: WorkoutSessionExercise[] | null
}

export type PhysicalAssessmentPhoto = {
  id: number
  type: 'front' | 'left_side' | 'right_side' | 'back'
  image_url: string
}

export type PhysicalAssessmentCircumference = {
  waist_cm: number | null
  abdomen_cm: number | null
  hip_cm: number | null
  right_arm_relaxed_cm: number | null
  right_arm_flexed_cm: number | null
  right_calf_cm: number | null
  right_thigh_cm: number | null
}

export type PhysicalAssessmentSkinfold = {
  abdominal_mm: number | null
  triceps_mm: number | null
  suprailiac_mm: number | null
  midaxillary_mm: number | null
  subscapular_mm: number | null
  chest_mm: number | null
  thigh_mm: number | null
}

export type CalculationMetadata = {
  formula: string
  inputs: Record<string, unknown>
  result: number | Record<string, unknown>
}

export type PhysicalAssessment = {
  id: number
  student_id: number
  trainer_id: number
  type: 'physical_assessment'
  title: string
  description: string | null
  assessment_date: string
  input_mode: 'manual' | 'automatic' | 'approximation'
  manual_method_name: string | null
  formula_used: string | null
  weight_kg: number | null
  height_cm: number | null
  bmr_kcal: number | null
  bmi: number | null
  body_fat_percentage: number | null
  lean_mass_percentage: number | null
  fat_mass_kg: number | null
  lean_mass_kg: number | null
  waist_hip_ratio: number | null
  calculation_metadata: Record<string, CalculationMetadata> | null
  notes: string | null
  created_at: string
  circumference: PhysicalAssessmentCircumference | null
  skinfold: PhysicalAssessmentSkinfold | null
  photos: PhysicalAssessmentPhoto[]
}

export type StudentEvolutionLeaderboardEntry = {
  student_id: number
  name: string
  rank: number
  is_current_user: boolean
  active_days_last_30: number
  completed_sessions_last_30: number
  current_streak_days: number
  longest_streak_days: number
  total_completed: number
}

export type StudentEvolutionActivityCell = {
  date: string
  day_label: string
  count: number
  level: number
  is_today: boolean
  is_future: boolean
}

export type StudentEvolutionWeekdayTotal = {
  day: string
  active_days: number
  session_count: number
}

export type StudentEvolutionWeeklyTotal = {
  week_label: string
  active_days: number
  session_count: number
  is_current_week: boolean
}

export type StudentEvolutionSummary = {
  leaderboard: {
    basis: string
    total_students: number
    me: StudentEvolutionLeaderboardEntry | null
    top: StudentEvolutionLeaderboardEntry[]
  }
  streak: {
    current_days: number
    best_days: number
    active_days_last_30: number
    sessions_last_30: number
    total_completed: number
  }
  activity_grid: StudentEvolutionActivityCell[]
  weekday_totals: StudentEvolutionWeekdayTotal[]
  weekly_totals: StudentEvolutionWeeklyTotal[]
}
