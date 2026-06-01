import { Link } from 'react-router-dom'
import { MapPin, Pencil, Ruler, Target, Weight } from 'lucide-react'

import { getGenderStyle, getLevelStyle } from '@/lib/enum-colors'
import {
  getStudentInitials,
  getStudentPortraitUrl,
} from '@/shells/trainer/lib/student-portrait'
import type { Student } from '@/types/fitness'

import { builderCard, pillBlue } from './styles'

function levelLabel(student: Student): string | null {
  if (!student.training_level) return null
  return getLevelStyle(student.training_level).label
}

function genderLabel(student: Student): string | null {
  if (!student.gender) return null
  return getGenderStyle(student.gender).label
}

type StudentSummaryCardProps = {
  student: Student
}

export function StudentSummaryCard({ student }: StudentSummaryCardProps) {
  const portrait = getStudentPortraitUrl(student)
  const level = levelLabel(student)
  const gender = genderLabel(student)

  return (
    <div
      className={`${builderCard} relative p-5 sm:p-6`}
      style={{
        background:
          'radial-gradient(ellipse 70% 80% at 0% 0%, rgba(163,255,18,0.04), transparent 50%), var(--s1)',
      }}
    >
      <Link
        to={`/trainer/students/${student.id}/edit`}
        className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-md border border-white/10 bg-[var(--s2)] text-zinc-400 shadow-md transition-colors hover:border-cyan-500/40 hover:text-cyan-300 sm:right-5 sm:top-5"
        aria-label="Editar aluno"
        title="Editar aluno"
      >
        <Pencil size={15} strokeWidth={2.25} />
      </Link>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="size-[5.5rem] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:size-24">
          {portrait ? (
            <img src={portrait} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-[#171D28] text-xl font-bold text-zinc-200">
              {getStudentInitials(student.name)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-10 sm:pr-12">
          <p className="type-label text-[var(--builder-accent-secondary)]">Aluno</p>
          <h2 className="type-section-title mt-0.5 sm:text-2xl">{student.name}</h2>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {level && <span className={pillBlue}>{level}</span>}
            {gender && <span className={pillBlue}>{gender}</span>}
            {student.gym_name && (
              <span className="type-caption inline-flex items-center gap-1">
                <MapPin size={12} className="opacity-70" />
                {student.gym_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:divide-x sm:divide-white/[0.06]">
        <Metric
          icon={Weight}
          label="Peso"
          value={student.weight != null ? `${Number(student.weight).toFixed(2)} kg` : '—'}
        />
        <Metric
          icon={Ruler}
          label="Altura"
          value={student.height != null ? `${Number(student.height).toFixed(2)} cm` : '—'}
          className="sm:pl-6"
        />
        <Metric icon={Target} label="Objetivo" value={student.goal ?? '—'} className="sm:pl-6" />
      </div>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Weight
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-3 ${className ?? ''}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-[var(--bg-subtle)] text-zinc-500">
        <Icon size={15} />
      </span>
      <div>
        <p className="type-label">{label}</p>
        <p className="type-body-medium">{value}</p>
      </div>
    </div>
  )
}
