import { Play, X } from 'lucide-react'

import { resolveMediaUrl } from '@/lib/media-url'
import { formatPrescription, getYoutubeEmbedUrl } from '@/lib/workout-prescription'
import type { TrainingExercise } from '@/types/fitness'

type ExerciseDetailSheetProps = {
  exerciseName: string
  trainingExercise: TrainingExercise | undefined
  onClose: () => void
}

export function ExerciseDetailSheet({
  exerciseName,
  trainingExercise,
  onClose,
}: ExerciseDetailSheetProps) {
  const exercise = trainingExercise?.exercise
  const embedUrl = getYoutubeEmbedUrl(exercise?.video_url)
  const prescription = formatPrescription(trainingExercise)
  const imageUrl = resolveMediaUrl(exercise?.image_url)

  return (
    <>
      <button
        type="button"
        className="workout-sheet-backdrop"
        aria-label="Fechar detalhes"
        onClick={onClose}
      />
      <div className="workout-sheet-panel" role="dialog" aria-modal="true">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-eyebrow m-0 mb-1">Detalhes do exercício</p>
            <h2 className="text-heading m-0 text-xl">{exerciseName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--s-border)] bg-white/[0.04] text-[var(--text-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        {prescription ? (
          <p className="text-body mb-4 rounded-xl border border-[var(--s-border)] bg-black/20 px-3 py-2.5">
            {prescription}
          </p>
        ) : null}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={exerciseName}
            className="mb-4 w-full rounded-xl object-cover"
            style={{ maxHeight: 220 }}
          />
        ) : null}

        {embedUrl ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-[var(--s-border)]">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={embedUrl}
                title={`Vídeo: ${exerciseName}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : exercise?.video_url ? (
          <a
            href={exercise.video_url}
            target="_blank"
            rel="noreferrer"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-cyan)]"
          >
            <Play size={16} />
            Abrir vídeo do exercício
          </a>
        ) : null}

        {trainingExercise?.notes ? (
          <div className="mb-4 rounded-xl border border-[color-mix(in_oklab,var(--accent-lime)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent-lime)_8%,transparent)] px-3.5 py-3">
            <p className="text-eyebrow m-0 mb-1.5 text-[var(--accent-lime)]">Instrução do personal</p>
            <p className="text-body m-0 leading-relaxed text-[var(--text-primary)]">
              {trainingExercise.notes}
            </p>
          </div>
        ) : null}

        {exercise?.instructions ? (
          <div className="rounded-xl border border-[var(--s-border)] bg-black/15 px-3.5 py-3">
            <p className="text-eyebrow m-0 mb-1.5">Como executar</p>
            <p className="text-body m-0 whitespace-pre-wrap leading-relaxed">{exercise.instructions}</p>
          </div>
        ) : null}

        {!trainingExercise?.notes && !exercise?.instructions && !embedUrl && !exercise?.image_url ? (
          <p className="text-body m-0 text-center py-6">Sem materiais extras para este exercício.</p>
        ) : null}
      </div>
    </>
  )
}
