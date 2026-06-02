import { getStudentInitials, getStudentPortraitUrl } from '@/shells/trainer/lib/student-portrait'
import type { Student } from '@/types/fitness'

import { cn } from '@/lib/utils'

type StudentPortraitProps = {
  student: Student
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClass = {
  sm: 'size-11',
  md: 'size-20',
  lg: 'size-24 sm:size-28',
}

const fallbackTextClass = {
  sm: 'text-xs font-bold',
  md: 'text-lg font-bold',
  lg: 'text-lg font-bold sm:text-xl',
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
          className={cn('flex size-full items-center justify-center', fallbackTextClass[size])}
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
