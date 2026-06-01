import { startTransition, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ListChecks } from 'lucide-react'

import {
  cancelWorkoutSession,
  fetchWorkoutSession,
  finishWorkoutSession,
  recordExercise,
} from '@/api/student'
import { ApiError } from '@/api/client'
import { ExerciseAdjustSheet, type ExerciseAdjustValues } from '@/components/student-workout/ExerciseAdjustSheet'
import { ExerciseDetailSheet } from '@/components/student-workout/ExerciseDetailSheet'
import { WorkoutActionToolbar } from '@/components/student-workout/WorkoutActionToolbar'
import { WorkoutExerciseListDrawer } from '@/components/student-workout/WorkoutExerciseListDrawer'
import { WorkoutExerciseStage } from '@/components/student-workout/WorkoutExerciseStage'
import { WorkoutIntroScene } from '@/components/student-workout/WorkoutIntroScene'
import { getTargetPerformance } from '@/lib/workout-prescription'
import type { WorkoutSession, WorkoutSessionExercise } from '@/types/fitness'

function isExerciseResolved(exercise: WorkoutSessionExercise) {
  return exercise.status !== 'pending'
}

function buildPayloadFromAdjust(values: ExerciseAdjustValues): Record<string, unknown> {
  const payload: Record<string, unknown> = { status: 'failed' }
  if (values.performed_sets) {
    payload.performed_sets = Number(values.performed_sets)
  }
  if (values.performed_reps) {
    payload.performed_reps = Number(values.performed_reps)
  }
  if (values.performed_weight) {
    payload.performed_weight = Number(values.performed_weight)
  }
  if (values.difficulty) {
    payload.difficulty = Number(values.difficulty)
  }
  if (values.pain_level) {
    payload.pain_level = Number(values.pain_level)
  }
  if (values.student_feedback) {
    payload.student_feedback = values.student_feedback
  }
  return payload
}

function getFirstOpenExerciseId(exercises: WorkoutSessionExercise[]) {
  return exercises.find((exercise) => !isExerciseResolved(exercise))?.id ?? null
}

function getNextOpenExerciseId(
  exercises: WorkoutSessionExercise[],
  currentExerciseId: number,
) {
  if (exercises.length === 0) {
    return null
  }

  const currentIndex = exercises.findIndex((exercise) => exercise.id === currentExerciseId)
  if (currentIndex === -1) {
    return getFirstOpenExerciseId(exercises)
  }

  for (let index = currentIndex + 1; index < exercises.length; index += 1) {
    if (!isExerciseResolved(exercises[index])) {
      return exercises[index].id
    }
  }

  for (let index = 0; index < currentIndex; index += 1) {
    if (!isExerciseResolved(exercises[index])) {
      return exercises[index].id
    }
  }

  return null
}

function getAdjustInitialValues(exercise: WorkoutSessionExercise): Partial<ExerciseAdjustValues> {
  return {
    performed_sets:
      exercise.performed_sets != null ? String(exercise.performed_sets) : undefined,
    performed_reps:
      exercise.performed_reps != null ? String(exercise.performed_reps) : undefined,
    performed_weight:
      exercise.performed_weight != null ? String(exercise.performed_weight) : undefined,
    difficulty: exercise.difficulty != null ? String(exercise.difficulty) : undefined,
    pain_level: exercise.pain_level != null ? String(exercise.pain_level) : undefined,
    student_feedback: exercise.student_feedback ?? undefined,
  }
}

function pickIntroPhrase(session: WorkoutSession | null) {
  const trainerName = session?.trainer?.name?.split(' ')[0] ?? 'Seu personal'
  const dayName = session?.training_day?.name ?? 'o treino'
  const phrases = [
    `${trainerName} já alinhou o desafio. Entre em ${dayName} com ritmo e controle desde a primeira série.`,
    `Respira, ajusta a postura e liga o foco. ${dayName} começa agora com a energia certa.`,
    `Hoje o combinado é simples: execução limpa, presença total e um passo a mais dentro de ${dayName}.`,
  ]

  return phrases[(session?.id ?? 0) % phrases.length]
}

export function WorkoutSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const shouldBootWithIntro = new URLSearchParams(location.search).get('intro') === '1'

  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showIntro, setShowIntro] = useState(shouldBootWithIntro)
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [detailExerciseId, setDetailExerciseId] = useState<number | null>(null)
  const [adjustExerciseId, setAdjustExerciseId] = useState<number | null>(null)
  const [showExerciseList, setShowExerciseList] = useState(false)
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [studentNotes, setStudentNotes] = useState('')
  const [cancelNotes, setCancelNotes] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (shouldBootWithIntro) {
      void navigate(location.pathname, { replace: true })
    }
  }, [location.pathname, navigate, shouldBootWithIntro])

  useEffect(() => {
    if (!sessionId) {
      return
    }

    void (async () => {
      try {
        const data = await fetchWorkoutSession(Number(sessionId))
        setSession(data)
        setCurrentExerciseId(getFirstOpenExerciseId(data.exercises ?? []))
      } catch (err) {
        if (!(err instanceof ApiError)) {
          throw err
        }
        setLoadError('Sessão não encontrada.')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [sessionId])

  const exercises = useMemo(() => session?.exercises ?? [], [session?.exercises])
  const completedCount = exercises.filter(isExerciseResolved).length
  const isWorkoutResolved = exercises.length > 0 && completedCount === exercises.length

  useEffect(() => {
    if (!showIntro) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentExerciseId, showIntro])

  useEffect(() => {
    if (exercises.length === 0) {
      return
    }

    const currentStillExists =
      currentExerciseId != null &&
      exercises.some((exercise) => exercise.id === currentExerciseId)

    if (currentStillExists) {
      return
    }

    const fallbackId = isWorkoutResolved ? null : getFirstOpenExerciseId(exercises)
    if (fallbackId === currentExerciseId) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => setCurrentExerciseId(fallbackId))
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [currentExerciseId, exercises, isWorkoutResolved])

  const currentExercise = useMemo(
    () =>
      currentExerciseId != null
        ? exercises.find((exercise) => exercise.id === currentExerciseId) ?? null
        : null,
    [currentExerciseId, exercises],
  )

  const currentIndex = currentExercise
    ? exercises.findIndex((exercise) => exercise.id === currentExercise.id)
    : -1
  const progressPercent =
    currentIndex >= 0 && exercises.length > 0
      ? Math.max(1, Math.round(((currentIndex + 1) / exercises.length) * 100))
      : 0
  const trainerPortraitUrl =
    (session?.trainer as { photo_url?: string | null } | null)?.photo_url ?? null
  const trainerName = session?.trainer?.name ?? 'Personal'
  const trainerFirstName = trainerName.split(' ')[0] ?? trainerName
  const trainerInitials = trainerName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const detailExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === detailExerciseId) ?? null,
    [detailExerciseId, exercises],
  )

  const adjustExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === adjustExerciseId) ?? null,
    [adjustExerciseId, exercises],
  )

  async function persistExercise(
    exercise: WorkoutSessionExercise,
    payload: Record<string, unknown>,
  ) {
    setSavingId(exercise.id)
    try {
      const updatedExercise = await recordExercise(exercise.id, payload)
      const nextExercises = exercises.map((item) =>
        item.id === updatedExercise.id ? updatedExercise : item,
      )

      setSession((prev) => (prev ? { ...prev, exercises: nextExercises } : prev))
      setAdjustExerciseId(null)

      const nextOpenId = getNextOpenExerciseId(nextExercises, exercise.id)
      if (nextOpenId == null) {
        startTransition(() => setCurrentExerciseId(null))
        setShowAdvanceModal(false)
        setShowFinishModal(true)
        return
      }

      setShowAdvanceModal(false)
      startTransition(() => setCurrentExerciseId(nextOpenId))
    } catch {
      // aluno pode tentar novamente
    } finally {
      setSavingId(null)
    }
  }

  async function handleQuickComplete(exercise: WorkoutSessionExercise) {
    const target = getTargetPerformance(exercise.training_exercise)
    await persistExercise(exercise, {
      status: 'completed',
      ...(target.performed_sets != null ? { performed_sets: target.performed_sets } : {}),
      ...(target.performed_reps != null ? { performed_reps: target.performed_reps } : {}),
      ...(target.performed_weight != null ? { performed_weight: target.performed_weight } : {}),
    })
  }

  async function handleAdjustSave(values: ExerciseAdjustValues) {
    if (!adjustExercise) {
      return
    }
    await persistExercise(adjustExercise, buildPayloadFromAdjust(values))
  }

  async function handleFinish() {
    if (!sessionId) {
      return
    }

    setIsFinishing(true)
    try {
      await finishWorkoutSession(Number(sessionId), studentNotes || undefined)
      void navigate('/app/evolucao')
    } catch {
      setIsFinishing(false)
    }
  }

  async function handleInterrupt() {
    if (!sessionId || !session) {
      return
    }

    setIsCancelling(true)
    try {
      await cancelWorkoutSession(Number(sessionId), cancelNotes || undefined)
      void navigate(`/app/treino/${session.training_day_id}`)
    } catch {
      setIsCancelling(false)
    }
  }

  function handleJumpToExercise(exerciseId: number) {
    startTransition(() => setCurrentExerciseId(exerciseId))
    setShowExerciseList(false)
  }

  function handleAdvance() {
    if (!currentExercise) {
      return
    }

    if (isExerciseResolved(currentExercise)) {
      const nextOpenId = getNextOpenExerciseId(exercises, currentExercise.id)
      if (nextOpenId == null) {
        setCurrentExerciseId(null)
        setShowFinishModal(true)
        return
      }

      startTransition(() => setCurrentExerciseId(nextOpenId))
      return
    }

    setShowAdvanceModal(true)
  }

  if (isLoading) {
    return <div className="py-12 text-center text-body">Carregando seu treino...</div>
  }

  if (!session || loadError) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            void navigate('/app/treino')
          }}
          className="mb-5 flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm text-[var(--text-secondary)]"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <p className="text-body text-center">{loadError ?? 'Sessão não encontrada.'}</p>
      </div>
    )
  }

  if (showIntro) {
    return (
      <WorkoutIntroScene
        trainerName={session.trainer?.name ?? 'Seu personal'}
        trainerPortraitUrl={trainerPortraitUrl}
        trainingDayName={session.training_day?.name ?? 'Treino ao vivo'}
        phrase={pickIntroPhrase(session)}
        onComplete={() => setShowIntro(false)}
      />
    )
  }

  return (
    <div className="workout-session-page">
      <header className="workout-session-page__header">
        <button
          type="button"
          onClick={() => {
            void navigate(`/app/treino/${session.training_day_id}`)
          }}
          className="workout-session-page__back"
          aria-label="Voltar para a ficha"
        >
          <ArrowLeft size={18} />
        </button>

        <strong className="workout-session-page__header-title">
          {session.training_day?.name ?? 'Treino em andamento'}
        </strong>
        <div className="workout-session-page__trainer">
          <span className="workout-session-page__trainer-avatar" aria-hidden="true">
            {trainerPortraitUrl ? (
              <img src={trainerPortraitUrl} alt="" />
            ) : (
              trainerInitials
            )}
          </span>
          <span className="workout-session-page__trainer-name">{trainerFirstName}</span>
        </div>
      </header>

      {currentExercise ? (
        <WorkoutExerciseStage
          exercise={currentExercise}
          index={currentIndex}
          onDetails={() => setDetailExerciseId(currentExercise.id)}
        />
      ) : (
        <article className="workout-stage__hero workout-stage__hero--complete glass-premium">
          <div className="workout-stage__complete-icon" aria-hidden="true">
            <CheckCircle2 size={28} />
          </div>
          <div className="workout-stage__hero-content">
            <div>
              <p className="workout-stage__section-label">Treino fechado</p>
              <h2 className="workout-stage__title">Sua sessão está pronta para ser enviada.</h2>
              <p className="workout-stage__body">
                Você registrou {completedCount} de {exercises.length} exercícios. Faça uma nota final
                para o personal ou encerre direto.
              </p>
            </div>

            <div className="workout-stage__complete-actions">
              <button
                type="button"
                onClick={() => setShowFinishModal(true)}
                className="btn-accent w-full py-4 text-base"
              >
                Finalizar treino
              </button>
              <button
                type="button"
                onClick={() => setShowExerciseList(true)}
                className="workout-stage__detail-button w-full justify-center"
              >
                <ListChecks size={16} />
                Rever lista
              </button>
            </div>
          </div>
        </article>
      )}

      {currentExercise ? (
        <WorkoutActionToolbar
          startedAt={session.started_at}
          currentIndex={currentIndex}
          totalCount={exercises.length}
          progressPercent={progressPercent}
          isSaving={savingId === currentExercise.id}
          onAdvance={handleAdvance}
          onOpenList={() => setShowExerciseList(true)}
          onInterrupt={() => setShowCancelModal(true)}
        />
      ) : (
        <div className="workout-complete-dock">
          <button
            type="button"
            onClick={() => setShowFinishModal(true)}
            className="btn-accent w-full py-4 text-base"
          >
            Finalizar treino
          </button>
        </div>
      )}

      <WorkoutExerciseListDrawer
        open={showExerciseList}
        onOpenChange={setShowExerciseList}
        exercises={exercises}
        currentExerciseId={currentExerciseId}
        onJump={handleJumpToExercise}
      />

      {detailExercise ? (
        <ExerciseDetailSheet
          exerciseName={detailExercise.training_exercise?.exercise?.name ?? 'Exercício'}
          trainingExercise={detailExercise.training_exercise}
          onClose={() => setDetailExerciseId(null)}
        />
      ) : null}

      {adjustExercise ? (
        <ExerciseAdjustSheet
          exerciseName={adjustExercise.training_exercise?.exercise?.name ?? 'Exercício'}
          trainingExercise={adjustExercise.training_exercise}
          initial={getTargetPerformance(adjustExercise.training_exercise)}
          existingValues={getAdjustInitialValues(adjustExercise)}
          isSaving={savingId === adjustExercise.id}
          onClose={() => setAdjustExerciseId(null)}
          onSave={(values) => void handleAdjustSave(values)}
        />
      ) : null}

      {showAdvanceModal && currentExercise ? (
        <>
          <button
            type="button"
            className="workout-sheet-backdrop z-[100]"
            aria-label="Fechar"
            onClick={() => setShowAdvanceModal(false)}
          />
          <div
            className="workout-sheet-panel z-[110]"
            role="dialog"
            aria-modal="true"
            style={{ bottom: '1rem' }}
          >
            <h2 className="text-heading m-0 mb-2 text-xl">Como foi esse exercício?</h2>
            <p className="text-body mb-5 text-sm">
              Marque se você conseguiu executar como combinado, ou abra o ajuste para registrar o que saiu diferente.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={savingId === currentExercise.id}
                onClick={() => void handleQuickComplete(currentExercise)}
                className="btn-accent w-full py-3.5 text-base disabled:opacity-60"
              >
                {savingId === currentExercise.id ? 'Salvando...' : 'Consegui executar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdvanceModal(false)
                  setAdjustExerciseId(currentExercise.id)
                }}
                className="w-full rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-5 py-3.5 text-sm font-semibold text-[var(--text-primary)]"
              >
                Não saiu como o planejado
              </button>
              <button
                type="button"
                onClick={() => setShowAdvanceModal(false)}
                className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]"
              >
                Voltar
              </button>
            </div>
          </div>
        </>
      ) : null}

      {showFinishModal ? (
        <>
          <button
            type="button"
            className="workout-sheet-backdrop z-[100]"
            aria-label="Fechar"
            onClick={() => setShowFinishModal(false)}
          />
          <div
            className="workout-sheet-panel z-[110]"
            role="dialog"
            aria-modal="true"
            style={{ bottom: '1rem' }}
          >
            <h2 className="text-heading m-0 mb-2 text-xl">Encerrar a sessão?</h2>
            <p className="text-body mb-4 text-sm">
              Seu personal vai receber {completedCount} registros desta sessão.
            </p>
            <textarea
              value={studentNotes}
              onChange={(event) => setStudentNotes(event.target.value)}
              placeholder="Como você se sentiu hoje? (opcional)"
              className="mb-4 min-h-[80px] w-full resize-y rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-3.5 py-2.5 text-sm outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isFinishing}
                onClick={() => void handleFinish()}
                className="btn-accent flex-1 py-3 disabled:opacity-60"
              >
                {isFinishing ? 'Finalizando...' : 'Finalizar treino'}
              </button>
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-5 py-3 text-sm font-semibold"
              >
                Voltar
              </button>
            </div>
          </div>
        </>
      ) : null}

      {showCancelModal ? (
        <>
          <button
            type="button"
            className="workout-sheet-backdrop z-[100]"
            aria-label="Fechar"
            onClick={() => setShowCancelModal(false)}
          />
          <div
            className="workout-sheet-panel z-[110]"
            role="dialog"
            aria-modal="true"
            style={{ bottom: '1rem' }}
          >
            <h2 className="text-heading m-0 mb-2 text-xl">Interromper treino?</h2>
            <p className="text-body mb-4 text-sm">
              Se quiser apenas pausar, use “Voltar ao treino”. Aqui você encerra esta sessão agora e pode deixar um contexto para o personal.
            </p>
            <textarea
              value={cancelNotes}
              onChange={(event) => setCancelNotes(event.target.value)}
              placeholder="Quer deixar um contexto rápido? (opcional)"
              className="mb-4 min-h-[80px] w-full resize-y rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-3.5 py-2.5 text-sm outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => void handleInterrupt()}
                className="flex-1 rounded-xl border border-[color-mix(in_oklab,var(--color-red)_40%,transparent)] bg-[color-mix(in_oklab,var(--color-red)_14%,transparent)] px-5 py-3 text-sm font-semibold text-[var(--color-red)] disabled:opacity-60"
              >
                {isCancelling ? 'Encerrando...' : 'Interromper agora'}
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-[var(--s-border)] bg-white/[0.06] px-5 py-3 text-sm font-semibold"
              >
                Continuar treino
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
