import { cn } from '@/lib/utils'

type TrainerAvatarProps = {
  initials: string
  className?: string
}

export function TrainerAvatar({ initials, className }: TrainerAvatarProps) {
  return (
    <span
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full border border-trainer-border bg-trainer-bg-elevated text-xs font-semibold text-trainer-muted',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
