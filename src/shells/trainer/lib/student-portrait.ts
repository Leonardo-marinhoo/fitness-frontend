import type { Student } from '@/types/fitness'

export function getStudentInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getStudentPortraitUrl(student: Student): string | null {
  if (student.photo_url) return student.photo_url

  const photos = student.anamnesis_photos ?? []
  const front = photos.find((p) => p.type === 'front')
  return front?.image_url ?? photos[0]?.image_url ?? null
}
