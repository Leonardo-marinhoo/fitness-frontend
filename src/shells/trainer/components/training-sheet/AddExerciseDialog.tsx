import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { inputClass, labelClass } from './constants'
import type { Exercise, TrainingExercise } from '@/types/fitness'

type AddExerciseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercises: Exercise[]
  editing: TrainingExercise | null
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
}

export function AddExerciseDialog({
  open,
  onOpenChange,
  exercises,
  editing,
  onSubmit,
}: AddExerciseDialogProps) {
  const [search, setSearch] = useState('')
  const [exerciseId, setExerciseId] = useState('')
  const [sets, setSets] = useState('')
  const [repsMin, setRepsMin] = useState('')
  const [repsMax, setRepsMax] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [restSeconds, setRestSeconds] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    if (editing) {
      setExerciseId(String(editing.exercise.id))
      setSets(editing.sets != null ? String(editing.sets) : '')
      setRepsMin(editing.reps_min != null ? String(editing.reps_min) : '')
      setRepsMax(editing.reps_max != null ? String(editing.reps_max) : '')
      setTargetWeight(editing.target_weight != null ? String(editing.target_weight) : '')
      setRestSeconds(editing.rest_seconds != null ? String(editing.rest_seconds) : '')
      setNotes(editing.notes ?? '')
    } else {
      setExerciseId('')
      setSets('3')
      setRepsMin('8')
      setRepsMax('12')
      setTargetWeight('')
      setRestSeconds('60')
      setNotes('')
    }
    setSearch('')
    setError(null)
  }, [open, editing])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return exercises
    return exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.muscle_group?.name.toLowerCase().includes(q),
    )
  }, [exercises, search])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!exerciseId) {
      setError('Selecione um exercício.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = {
        exercise_id: Number(exerciseId),
        series_mode: 'simple',
        prescription_type: 'reps',
      }
      if (sets) payload.sets = Number(sets)
      if (repsMin) payload.reps_min = Number(repsMin)
      if (repsMax) payload.reps_max = Number(repsMax)
      if (targetWeight) payload.target_weight = Number(targetWeight)
      if (restSeconds) payload.rest_seconds = Number(restSeconds)
      if (notes.trim()) payload.notes = notes.trim()
      else if (editing) payload.notes = null
      await onSubmit(payload)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar exercício.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] max-w-lg">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader>
            <p className="text-eyebrow mb-1">Biblioteca</p>
            <DialogTitle className="text-heading">{editing ? 'Editar exercício' : 'Adicionar exercício'}</DialogTitle>
            <DialogDescription>Busque na biblioteca e defina a prescrição.</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {!editing && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/35" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar exercício..."
                  className={`${inputClass} pl-9`}
                />
              </div>
            )}

            {!editing && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--s-border)]">
                {filtered.length === 0 ? (
                  <p className="p-4 text-center text-xs text-foreground/40">Nenhum exercício encontrado.</p>
                ) : (
                  filtered.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setExerciseId(String(ex.id))}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                        exerciseId === String(ex.id)
                          ? 'bg-primary/12 text-foreground'
                          : 'hover:bg-[var(--s2)] text-foreground/80'
                      }`}
                    >
                      <span className="truncate font-medium">{ex.name}</span>
                      {ex.muscle_group && (
                        <span className="ml-2 shrink-0 text-[10px] text-foreground/40">
                          {ex.muscle_group.name}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Séries
                </label>
                <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} className={inputClass} min={1} />
              </div>
              <div>
                <label className={labelClass}>
                  Reps mín
                </label>
                <input type="number" value={repsMin} onChange={(e) => setRepsMin(e.target.value)} className={inputClass} min={1} />
              </div>
              <div>
                <label className={labelClass}>
                  Reps máx
                </label>
                <input type="number" value={repsMax} onChange={(e) => setRepsMax(e.target.value)} className={inputClass} min={1} />
              </div>
              <div>
                <label className={labelClass}>
                  Carga (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>
                  Descanso (s)
                </label>
                <input
                  type="number"
                  value={restSeconds}
                  onChange={(e) => setRestSeconds(e.target.value)}
                  className={inputClass}
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Observações</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Manter escápulas retraídas, amplitude completa..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : editing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
