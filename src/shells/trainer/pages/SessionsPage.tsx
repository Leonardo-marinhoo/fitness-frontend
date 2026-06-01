import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

import { fetchWorkoutSession, fetchWorkoutSessions, sendTrainerFeedback } from '@/api/trainer'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrainerButton,
  TrainerCard,
  TrainerEmptyState,
  TrainerPageHeader,
  TrainerSection,
} from '@/components/trainer-ui'
import { cn } from '@/lib/utils'
import type { WorkoutSession } from '@/types/fitness'

const statusConfig: Record<string, { label: string; className: string }> = {
  started: {
    label: 'Em andamento',
    className: 'bg-trainer-cyan/10 text-trainer-cyan',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-trainer-accent/10 text-trainer-accent',
  },
  skipped: {
    label: 'Pulada',
    className: 'bg-trainer-surface-hover text-trainer-muted',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-trainer-surface-hover text-trainer-subtle',
  },
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d))
}

export function SessionsPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<WorkoutSession | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackSaving, setFeedbackSaving] = useState(false)
  const [feedbackSaved, setFeedbackSaved] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchWorkoutSessions()
        setSessions(data)
      } catch {
        setSessions([])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (selectedId === null) return
    setDetailLoading(true)
    void (async () => {
      try {
        const data = await fetchWorkoutSession(selectedId)
        setDetail(data)
        setFeedback(data.trainer_feedback ?? '')
        setFeedbackSaved(false)
      } catch {
        setDetail(null)
      } finally {
        setDetailLoading(false)
      }
    })()
  }, [selectedId])

  async function saveFeedback() {
    if (selectedId === null) return
    setFeedbackSaving(true)
    try {
      await sendTrainerFeedback(selectedId, feedback)
      setFeedbackSaved(true)
    } catch {
      // silent
    } finally {
      setFeedbackSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <TrainerPageHeader
        title="Sessões de Treino"
        description="Acompanhe treinos realizados pelos alunos e envie feedback."
      />

      <div
        className={cn(
          'grid gap-4',
          selectedId !== null ? 'lg:grid-cols-2' : 'grid-cols-1',
        )}
      >
        <section className="flex flex-col gap-2">
          {isLoading ? (
            <Skeleton className="h-40 rounded-xl bg-trainer-surface" />
          ) : sessions.length === 0 ? (
            <TrainerEmptyState
              icon={Activity}
              title="Nenhuma sessão registrada ainda."
            />
          ) : (
            sessions.map((s) => {
              const sc = statusConfig[s.status] ?? statusConfig.cancelled
              const isSelected = selectedId === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(isSelected ? null : s.id)}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-300',
                    isSelected
                      ? 'border-trainer-accent/40 bg-trainer-accent/5 ring-1 ring-trainer-accent/30'
                      : 'border-trainer-border bg-trainer-surface hover:border-trainer-border-strong hover:bg-trainer-surface-hover',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-trainer-text">
                        {s.training_day?.name ?? `Divisão #${s.training_day_id}`}
                      </p>
                      <p className="mt-1 flex gap-2 text-xs text-trainer-muted">
                        <span>{formatDate(s.started_at)}</span>
                        {s.duration_in_minutes ? <span>{s.duration_in_minutes} min</span> : null}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold',
                        sc.className,
                      )}
                    >
                      {sc.label}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </section>

        {selectedId !== null ? (
          <TrainerCard className="p-5">
            {detailLoading ? (
              <p className="trainer-body py-8 text-center">Carregando detalhe...</p>
            ) : detail ? (
              <div className="flex flex-col gap-6">
                <h2 className="trainer-section-title">
                  {detail.training_day?.name ?? `Divisão #${detail.training_day_id}`}
                </h2>

                {(detail.exercises ?? []).length > 0 ? (
                  <TrainerSection title="Exercícios executados">
                    <div className="flex flex-col gap-2">
                      {(detail.exercises ?? []).map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-trainer-border bg-trainer-bg-elevated px-3 py-2.5"
                        >
                          <div>
                            <p className="text-sm font-medium text-trainer-text">
                              {ex.training_exercise?.exercise?.name ??
                                `Exercício #${ex.exercise_id}`}
                            </p>
                            <p className="mt-0.5 text-xs text-trainer-muted">
                              {ex.performed_sets ? `${ex.performed_sets} séries` : ''}
                              {ex.performed_reps ? ` × ${ex.performed_reps} reps` : ''}
                              {ex.performed_weight ? ` × ${ex.performed_weight} kg` : ''}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'rounded px-2 py-0.5 text-[11px]',
                              ex.status === 'completed'
                                ? 'bg-trainer-accent/10 text-trainer-accent'
                                : 'text-trainer-subtle',
                            )}
                          >
                            {ex.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TrainerSection>
                ) : null}

                {detail.student_notes ? (
                  <TrainerSection title="Observações do aluno">
                    <p className="rounded-lg border border-trainer-border bg-trainer-bg-elevated p-3 text-sm text-trainer-text">
                      {detail.student_notes}
                    </p>
                  </TrainerSection>
                ) : null}

                <TrainerSection title="Seu feedback">
                  <textarea
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value)
                      setFeedbackSaved(false)
                    }}
                    placeholder="Deixe um comentário para o aluno..."
                    className="min-h-20 w-full resize-y rounded-lg border border-trainer-border bg-trainer-bg-elevated px-3 py-2.5 text-sm text-trainer-text outline-none transition focus:border-trainer-accent/40 focus:ring-2 focus:ring-trainer-accent/20"
                  />
                  <TrainerButton
                    onClick={() => void saveFeedback()}
                    className={cn(feedbackSaved && 'opacity-80')}
                  >
                    {feedbackSaving ? 'Salvando...' : feedbackSaved ? 'Salvo' : 'Enviar feedback'}
                  </TrainerButton>
                </TrainerSection>
              </div>
            ) : null}
          </TrainerCard>
        ) : null}
      </div>
    </div>
  )
}


