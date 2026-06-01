import { Check, X } from 'lucide-react'

import type { Student } from '@/types/fitness'

import { getInitials } from './tints'
import type { TintKey } from './tints'
import { TINT } from './tints'

export type ActionCardType = 'anamnesis' | 'new'

type TrainerActionCardProps = {
  student: Student
  type: ActionCardType
  onReview: () => void
  onDismiss: () => void
}

export function TrainerActionCard({ student, type, onReview, onDismiss }: TrainerActionCardProps) {
  const isAnamnesis = type === 'anamnesis'
  const tintKey: TintKey = isAnamnesis ? 'lime' : 'cyan'
  const tint = TINT[tintKey]
  const meta = isAnamnesis
    ? student.anamnesis_completed_at
      ? `Preenchida em ${new Date(student.anamnesis_completed_at).toLocaleDateString('pt-BR')}`
      : 'Aguardando revisão'
    : student.created_at
      ? `Cadastrado em ${new Date(student.created_at).toLocaleDateString('pt-BR')}`
      : 'Novo este mês'

  return (
    <article className="td-action-card">
      <div className="flex items-start gap-3">
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: `${tint.color}18`,
            color: tint.color,
            border: `1px solid ${tint.color}35`,
          }}
        >
          {getInitials(student.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-zinc-50">{student.name}</p>
            <span className="shrink-0 text-[10px] text-zinc-500">Agora</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            {isAnamnesis
              ? 'Anamnese pronta para você revisar antes de montar a ficha.'
              : 'Novo aluno cadastrado neste mês. Confira o perfil e objetivos.'}
          </p>
          <p className="mt-1 text-[10px] text-zinc-500">{meta}</p>
        </div>
      </div>
      <div className="td-action-card__actions">
        <button
          type="button"
          className="td-action-btn"
          aria-label="Depois"
          onClick={onDismiss}
        >
          <X size={14} />
        </button>
        <button
          type="button"
          className="td-action-btn td-action-btn--primary"
          aria-label="Revisar"
          onClick={onReview}
        >
          <Check size={14} />
        </button>
      </div>
    </article>
  )
}
