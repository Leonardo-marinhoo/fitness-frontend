import { useState } from 'react'
import { Pencil, SlidersHorizontal } from 'lucide-react'

import type { PhysicalAssessment, TrainingExercise, TrainingSheet } from '@/types/fitness'

import {
  buildStudentProgressChartData,
  computeMuscleGroups,
  progressMetricDelta,
  type ProgressMetricId,
  type SheetDayStats,
} from './compute-sheet-stats'
import { MuscleGroupsChart } from './MuscleGroupsChart'
import { StudentProgressChart } from './StudentProgressChart'
import { builderCard, builderCardInner, builderLabel } from './styles'

type WorkoutSummaryPanelProps = {
  sheet: TrainingSheet
  dayStats: SheetDayStats
  exercises: TrainingExercise[]
  assessments: PhysicalAssessment[]
  studentWeight: number | null
  onSaveNotes: (notes: string) => void
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[var(--bg-subtle)] p-3.5">
      <p className={builderLabel}>{label}</p>
      <p className="type-metric mt-1.5">{value}</p>
      {sub && <p className="type-caption mt-1">{sub}</p>}
    </div>
  )
}

export function WorkoutSummaryPanel({
  sheet,
  dayStats,
  exercises,
  assessments,
  studentWeight,
  onSaveNotes,
}: WorkoutSummaryPanelProps) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(sheet.general_notes ?? '')
  const muscleSlices = computeMuscleGroups(exercises)
  const progressData = buildStudentProgressChartData(
    assessments,
    dayStats.volumeKg,
    studentWeight,
  )
  const progressDeltas: Record<ProgressMetricId, string | null> = {
    carga: progressMetricDelta(progressData, 'carga'),
    calorias: progressMetricDelta(progressData, 'calorias'),
    massa_magra: progressMetricDelta(progressData, 'massa_magra'),
  }

  const volumeLabel =
    dayStats.volumeKg > 0
      ? `${dayStats.volumeKg.toLocaleString('pt-BR')} kg`
      : '—'

  function saveNotes() {
    onSaveNotes(notesDraft)
    setEditingNotes(false)
  }

  return (
    <aside className={`${builderCard} xl:sticky xl:top-6 xl:self-start`}>
      <div className="space-y-6 p-5 lg:p-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-zinc-500" />
            <h3 className="type-shell-title">Resumo da ficha</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              label="Exercícios"
              value={String(dayStats.exerciseCount)}
              sub="exercícios"
            />
            <MetricCard label="Volume total" value={volumeLabel} sub="estimado" />
            <MetricCard label="Duração estimada" value={dayStats.durationLabel} />
            <MetricCard label="Descanso total" value={dayStats.restLabel} />
          </div>
        </div>

        <hr className="border-white/[0.06]" />

        <div>
          <h3 className="type-shell-title mb-3">Grupos musculares</h3>
          <MuscleGroupsChart slices={muscleSlices} />
        </div>

        <hr className="border-white/[0.06]" />

        <div>
          <h3 className="type-shell-title mb-3">Progresso do aluno</h3>
          <StudentProgressChart data={progressData} deltas={progressDeltas} />
        </div>

        <hr className="border-white/[0.06]" />

        <div className={`${builderCardInner} p-4`}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="type-shell-title">Observações</h3>
            {!editingNotes && (
              <button
                type="button"
                onClick={() => {
                  setNotesDraft(sheet.general_notes ?? '')
                  setEditingNotes(true)
                }}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                aria-label="Editar observações"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                className="type-body w-full resize-none rounded-lg border border-white/10 bg-[var(--bg-base)] px-3 py-2 outline-none focus:border-cyan-500/40"
                placeholder="Notas gerais da ficha…"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNotes(false)}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveNotes}
                  className="rounded-lg bg-cyan-500/15 px-2 py-1 text-xs font-medium text-cyan-300"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <p className="type-body leading-relaxed">
              {sheet.general_notes?.trim() ||
                'Foco em progressão de carga e execução controlada.'}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
