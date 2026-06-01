import {
  Dumbbell,
  Info,
  Layers3,
  PlayCircle,
  Repeat2,
  Timer,
} from 'lucide-react'

import { resolveMediaUrl } from '@/lib/media-url'
import { getYoutubeEmbedUrl } from '@/lib/workout-prescription'
import type { WorkoutSessionExercise } from '@/types/fitness'

function buildExerciseStats(exercise: WorkoutSessionExercise) {
  const trainingExercise = exercise.training_exercise
  const firstSet = trainingExercise?.sets_detail?.[0]
  const stats = [
    {
      label: 'Séries',
      icon: Layers3,
      value:
        trainingExercise?.sets ??
        trainingExercise?.sets_detail?.length ??
        exercise.performed_sets ??
        null,
    },
    {
      label: 'Reps',
      icon: Repeat2,
      value:
        trainingExercise?.reps_text ??
        (trainingExercise?.reps_min && trainingExercise?.reps_max
          ? `${trainingExercise.reps_min}-${trainingExercise.reps_max}`
          : trainingExercise?.reps_min ?? exercise.performed_reps ?? null),
    },
    {
      label: 'Carga',
      icon: Dumbbell,
      value:
        trainingExercise?.target_weight ??
        firstSet?.target_weight ??
        exercise.performed_weight ??
        null,
      suffix: 'kg',
    },
    {
      label: 'Pausa',
      icon: Timer,
      value: trainingExercise?.rest_seconds ?? firstSet?.rest_seconds ?? null,
      suffix: 's',
    },
  ]

  return stats.filter((stat) => stat.value !== null && stat.value !== '')
}

type WorkoutExerciseStageProps = {
  exercise: WorkoutSessionExercise
  index: number
  onDetails: () => void
}

export function WorkoutExerciseStage({
  exercise,
  index,
  onDetails,
}: WorkoutExerciseStageProps) {
  const trainingExercise = exercise.training_exercise
  const exerciseDetails = trainingExercise?.exercise ?? exercise.exercise
  const imageUrl = resolveMediaUrl(exerciseDetails?.image_url)
  const muscleName = exerciseDetails?.muscle_group?.name
  const hasVideo = Boolean(getYoutubeEmbedUrl(exerciseDetails?.video_url) ?? exerciseDetails?.video_url)
  const stats = buildExerciseStats(exercise)

  return (
    <section className="workout-stage">
      <article className="workout-stage__hero glass-premium">
        <div className="workout-stage__media">
          {imageUrl ? (
            <img src={imageUrl} alt={exerciseDetails?.name ?? `Exercício ${index + 1}`} loading="lazy" />
          ) : (
            <div className="workout-stage__media-fallback" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
          )}

          <div className="workout-stage__media-overlay">
            <div className="workout-stage__media-copy">
              {muscleName ? <p className="workout-stage__media-kicker">{muscleName}</p> : null}
              <h1 className="workout-stage__media-title">
                {exerciseDetails?.name ?? `Exercício ${index + 1}`}
              </h1>
            </div>

            {stats.length > 0 ? (
              <div className="workout-stage__overlay-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="workout-stage__stat">
                    <div className="workout-stage__stat-head">
                      <span>{stat.label}</span>
                      <stat.icon size={16} />
                    </div>
                    <strong>
                      {stat.value}
                      {stat.suffix ? ` ${stat.suffix}` : ''}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {trainingExercise?.notes ? (
          <div className="workout-stage__hero-content">
            <div className="workout-stage__coach-note">
              <p className="workout-stage__section-label">Ajuste do personal</p>
              <p>{trainingExercise.notes}</p>
            </div>
          </div>
        ) : null}
      </article>

      {exerciseDetails?.description ? (
        <article className="workout-stage__surface glass-elevated">
          <p className="workout-stage__section-label">O foco aqui</p>
          <p className="workout-stage__body">{exerciseDetails.description}</p>
        </article>
      ) : null}

      {exerciseDetails?.instructions ? (
        <article className="workout-stage__surface glass-elevated">
          <p className="workout-stage__section-label">Como executar</p>
          <p className="workout-stage__body workout-stage__body--pre">
            {exerciseDetails.instructions}
          </p>
        </article>
      ) : null}

      {exerciseDetails?.equipment || hasVideo ? (
        <article className="workout-stage__surface glass-elevated">
          <div className="workout-stage__surface-row">
            <div>
              <p className="workout-stage__section-label">Apoio rápido</p>
              <p className="workout-stage__body">
                {exerciseDetails?.equipment
                  ? `Equipamento: ${exerciseDetails.equipment}`
                  : 'Abra o guia visual para revisar a execução.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onDetails}
              className="workout-stage__detail-button"
            >
              {hasVideo ? <PlayCircle size={16} /> : <Info size={16} />}
              Ver guia
            </button>
          </div>
        </article>
      ) : null}
    </section>
  )
}
