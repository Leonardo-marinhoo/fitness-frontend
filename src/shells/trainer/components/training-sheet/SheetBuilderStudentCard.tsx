import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { EnumBadge } from '@/components/ui/enum-badge'
import { getGenderStyle, getLevelStyle } from '@/lib/enum-colors'
import type { Student } from '@/types/fitness'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getPortraitUrl(student: Student): string | null {
  const photos = student.anamnesis_photos ?? []
  const front = photos.find((p) => p.type === 'front')
  return front?.image_url ?? photos[0]?.image_url ?? null
}

type SheetBuilderStudentCardProps = {
  student: Student
}

export function SheetBuilderStudentCard({ student }: SheetBuilderStudentCardProps) {
  const portrait = getPortraitUrl(student)
  const levelStyle = student.training_level ? getLevelStyle(student.training_level) : null
  const genderStyle = student.gender ? getGenderStyle(student.gender) : null

  return (
    <section className="border-b border-[var(--s-border)] px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4 rounded-lg border border-[var(--s-border)] bg-[var(--s1)] p-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {portrait ? (
            <img
              src={portrait}
              alt=""
              className="size-16 shrink-0 rounded-full object-cover ring-1 ring-[var(--s-border-h)]"
            />
          ) : (
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-1 ring-[var(--s-border-h)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(223,255,106,0.14), rgba(168,140,255,0.14))',
                color: 'var(--text-primary)',
              }}
            >
              {getInitials(student.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-eyebrow text-foreground/45">Aluno</p>
            <h2 className="truncate text-lg font-bold text-foreground">{student.name}</h2>

            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {student.weight != null && (
                <div className="flex gap-1.5">
                  <dt className="text-foreground/45">Peso</dt>
                  <dd className="font-medium tabular-nums text-foreground">{student.weight} kg</dd>
                </div>
              )}
              {student.height != null && (
                <div className="flex gap-1.5">
                  <dt className="text-foreground/45">Altura</dt>
                  <dd className="font-medium tabular-nums text-foreground">{student.height} cm</dd>
                </div>
              )}
              {student.goal && (
                <div className="flex min-w-0 gap-1.5">
                  <dt className="shrink-0 text-foreground/45">Objetivo</dt>
                  <dd className="truncate font-medium text-foreground">{student.goal}</dd>
                </div>
              )}
            </dl>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {levelStyle && <EnumBadge style={levelStyle} size="sm" />}
              {genderStyle && <EnumBadge style={genderStyle} size="sm" />}
              {student.gym_name && (
                <span className="text-xs text-foreground/45">{student.gym_name}</span>
              )}
            </div>
          </div>
        </div>

        <Link
          to={`/trainer/students/${student.id}`}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-[var(--s-border)] px-3 py-2 text-sm text-foreground/65 transition-colors hover:bg-[var(--s2)] hover:text-foreground sm:self-center"
        >
          Ver perfil
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  )
}
