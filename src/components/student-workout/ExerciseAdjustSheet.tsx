import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { formatPrescription, type TargetPerformance } from '@/lib/workout-prescription'
import type { TrainingExercise } from '@/types/fitness'

export type ExerciseAdjustValues = {
  performed_sets: string
  performed_reps: string
  performed_weight: string
  difficulty: string
  pain_level: string
  student_feedback: string
}

type ExerciseAdjustSheetProps = {
  exerciseName: string
  trainingExercise: TrainingExercise | undefined
  initial: TargetPerformance
  existingValues?: Partial<ExerciseAdjustValues>
  isSaving: boolean
  onClose: () => void
  onSave: (values: ExerciseAdjustValues) => void
}

function toFormValues(target: TargetPerformance, existing?: Partial<ExerciseAdjustValues>): ExerciseAdjustValues {
  return {
    performed_sets: existing?.performed_sets ?? (target.performed_sets != null ? String(target.performed_sets) : ''),
    performed_reps: existing?.performed_reps ?? (target.performed_reps != null ? String(target.performed_reps) : ''),
    performed_weight:
      existing?.performed_weight ?? (target.performed_weight != null ? String(target.performed_weight) : ''),
    difficulty: existing?.difficulty ?? '',
    pain_level: existing?.pain_level ?? '',
    student_feedback: existing?.student_feedback ?? '',
  }
}

export function ExerciseAdjustSheet({
  exerciseName,
  trainingExercise,
  initial,
  existingValues,
  isSaving,
  onClose,
  onSave,
}: ExerciseAdjustSheetProps) {
  const [form, setForm] = useState<ExerciseAdjustValues>(() => toFormValues(initial, existingValues))

  useEffect(() => {
    setForm(toFormValues(initial, existingValues))
  }, [existingValues, initial, exerciseName])

  const prescription = formatPrescription(trainingExercise)

  function updateField(field: keyof ExerciseAdjustValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <button
        type="button"
        className="workout-sheet-backdrop"
        aria-label="Fechar ajuste"
        onClick={onClose}
      />
      <div className="workout-sheet-panel" role="dialog" aria-modal="true">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-eyebrow m-0 mb-1 text-[var(--color-amber)]">Ajustar execução</p>
            <h2 className="text-heading m-0 text-lg">{exerciseName}</h2>
            {prescription ? (
              <p className="text-caption mt-1">Prescrito: {prescription}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--s-border)] bg-white/[0.04]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-body mb-4 text-sm leading-relaxed">
          Os campos já vêm preenchidos. Ajuste só o que mudou no que você conseguiu entregar.
        </p>

        <div className="mb-3 grid grid-cols-3 gap-2">
          {(
            [
              { key: 'performed_sets' as const, label: 'Séries' },
              { key: 'performed_reps' as const, label: 'Reps' },
              { key: 'performed_weight' as const, label: 'Peso (kg)' },
            ] as const
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="text-eyebrow mb-1 block text-[9px]">{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-2.5 py-2.5 text-center text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[color-mix(in_oklab,var(--accent-lime)_50%,transparent)]"
                step={key === 'performed_weight' ? '0.5' : '1'}
              />
            </div>
          ))}
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-eyebrow mb-1 block text-[9px]">Dificuldade (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
              className="w-full rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-2.5 py-2.5 text-center text-sm font-semibold outline-none"
            />
          </div>
          <div>
            <label className="text-eyebrow mb-1 block text-[9px]">Dor (0-10)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={form.pain_level}
              onChange={(e) => updateField('pain_level', e.target.value)}
              className="w-full rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-2.5 py-2.5 text-center text-sm font-semibold outline-none"
            />
          </div>
        </div>

        <input
          type="text"
          value={form.student_feedback}
          onChange={(e) => updateField('student_feedback', e.target.value)}
          placeholder="O que aconteceu? (opcional)"
          className="mb-4 w-full rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-3 py-2.5 text-sm outline-none"
        />

        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave(form)}
          className="btn-accent w-full py-3.5 text-[15px] disabled:opacity-60"
        >
          {isSaving ? 'Salvando...' : 'Salvar e continuar'}
        </button>
      </div>
    </>
  )
}
