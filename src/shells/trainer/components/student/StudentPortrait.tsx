import { getStudentInitials, getStudentPortraitUrl } from '@/shells/trainer/lib/student-portrait'
import type { Student } from '@/types/fitness'

import { cn } from '@/lib/utils'

type StudentPortraitProps = {
  student: Student
  size?: 'md' | 'lg'
  className?: string
}

const sizeClass = {
  md: 'size-20',
  lg: 'size-24 sm:size-28',
}

export function StudentPortrait({ student, size = 'lg', className }: StudentPortraitProps) {
  const portrait = getStudentPortraitUrl(student)

  return (
    <div
      className={cn(
        sizeClass[size],
        'shrink-0 overflow-hidden rounded-lg ring-1 ring-[var(--s-border-h)]',
        className,
      )}
    >
      {portrait ? (
        <img src={portrait} alt="" className="size-full object-cover" />
      ) : (
        <div
          className="flex size-full items-center justify-center text-lg font-bold sm:text-xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(200,241,53,0.18), rgba(112,215,255,0.14))',
            color: 'var(--accent-lime)',
          }}
        >
          {getStudentInitials(student.name)}
        </div>
      )}
    </div>
  )
}
