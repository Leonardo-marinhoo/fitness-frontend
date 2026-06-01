import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { fetchActiveTrainingSheet, startWorkoutSession } from '@/api/student'
import { ApiError } from '@/api/client'
import { StudentPageHero } from '@/shells/student/components/StudentPageHero'
import { resolveMediaUrl } from '@/lib/media-url'
import { formatPrescription } from '@/lib/workout-prescription'
import {
  countDayExercises,
  dayHasExercises,
  DOW_LABELS,
  getDayCoverImage,
  getSheetCoverImage,
} from '@/lib/student-training'
import type { TrainingDay, TrainingSheet } from '@/types/fitness'

export function TrainingDayPage() {
  const { dayId } = useParams<{ dayId: string }>()
  const navigate = useNavigate()
  const [sheet, setSheet] = useState<TrainingSheet | null>(null)
  const [day, setDay] = useState<TrainingDay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  useEffect(() => {
    if (!dayId) {
      return
    }
    void (async () => {
      try {
        const activeSheet = await fetchActiveTrainingSheet()
        const found = activeSheet.training_days?.find((item) => item.id === Number(dayId)) ?? null
        setSheet(activeSheet)
        setDay(found)
      } catch (err) {
        if (!(err instanceof ApiError)) {
          throw err
        }
        setSheet(null)
        setDay(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [dayId])

  async function handleStart() {
    if (!dayId || !dayHasExercises(day!)) {
      return
    }
    setIsStarting(true)
    setStartError(null)
    try {
      const session = await startWorkoutSession(Number(dayId))
      const introQuery = session.was_resumed === true ? '' : '?intro=1'
      void navigate(`/app/workout/${session.id}${introQuery}`)
    } catch {
      setStartError('Não foi possível iniciar. Confira se o treino tem exercícios na ficha ativa.')
      setIsStarting(false)
    }
  }

  if (isLoading) {
    return <div className="py-12 text-center text-body">Carregando treino...</div>
  }

  if (!day || !sheet) {
    return (
      <div>
        <button
          type="button"
          onClick={() => { void navigate('/app/treino') }}
          className="mb-4 flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm text-[var(--text-secondary)]"
        >
          <ArrowLeft size={16} />
          Voltar aos treinos
        </button>
        <p className="text-body text-center">Treino não encontrado na ficha ativa.</p>
      </div>
    )
  }

  const exercises = day.training_exercises ?? []
  const canStart = dayHasExercises(day)
  const dayLabel = day.day_of_week ? DOW_LABELS[day.day_of_week] ?? day.day_of_week : null

  return (
    <div className="pb-28">
      <button
        type="button"
        onClick={() => { void navigate('/app/treino') }}
        className="mb-3 flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm text-[var(--text-secondary)]"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <StudentPageHero
        kicker={sheet.name}
        title={day.name}
        description={day.description ?? 'Revise os exercícios antes de começar. Toque em iniciar quando estiver pronto.'}
        coverImage={getDayCoverImage(day, getSheetCoverImage(sheet))}
        badges={
          <>
            {dayLabel ? <span className="student-hero-chip">{dayLabel}</span> : null}
            <span className="student-hero-chip student-hero-chip--muted">
              {countDayExercises(day)} exercício{countDayExercises(day) === 1 ? '' : 's'}
            </span>
          </>
        }
      />

      <div className="flex flex-col gap-2.5">
        {exercises.length === 0 ? (
          <div className="s1 px-4 py-8 text-center text-body">
            Nenhum exercício neste treino. Peça ao seu personal para completar a ficha.
          </div>
        ) : (
          exercises.map((te, idx) => {
            const thumbUrl = resolveMediaUrl(te.exercise.image_url)

            return (
            <article key={te.id} className="training-day-exercise-row">
              <div className="training-day-exercise-row__thumb">
                {thumbUrl ? (
                  <img src={thumbUrl} alt={te.exercise.name} loading="lazy" />
                ) : (
                  <span className="training-day-exercise-row__placeholder">{idx + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-accent-lime">#{idx + 1}</span>
                  {te.exercise.muscle_group ? (
                    <span className="text-[10px] font-semibold text-[var(--color-violet)]">
                      {te.exercise.muscle_group.name}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-heading m-0 text-base">{te.exercise.name}</h3>
                <p className="text-caption mt-1">{formatPrescription(te)}</p>
                {te.notes ? <p className="text-body mt-2 text-xs leading-relaxed">{te.notes}</p> : null}
              </div>
            </article>
            )
          })
        )}
      </div>

      <div className="workout-finish-bar">
        {startError ? <p className="text-body mb-2 text-center text-sm text-[var(--color-amber)]">{startError}</p> : null}
        <button
          type="button"
          onClick={() => void handleStart()}
          disabled={isStarting || !canStart}
          className="btn-accent w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStarting ? 'Iniciando...' : canStart ? 'Iniciar treino' : 'Adicione exercícios para iniciar'}
        </button>
      </div>
    </div>
  )
}
