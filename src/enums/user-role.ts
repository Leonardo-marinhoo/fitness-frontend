/** Espelha `App\Enums\UserRole` do backend. */
export const UserRole = {
  SuperAdmin: 'super_admin',
  Trainer: 'trainer',
  Student: 'student',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SuperAdmin
}

export function isTrainer(role: UserRole): boolean {
  return role === UserRole.Trainer
}

export function isStudent(role: UserRole): boolean {
  return role === UserRole.Student
}
