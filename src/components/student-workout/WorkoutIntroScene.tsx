import { useEffect, useMemo, useState } from 'react'

import { resolveMediaUrl } from '@/lib/media-url'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const ASSET_MESSAGES = [
  '/carregando/halteres',
  '/sincronizando/anilhas',
  '/aquecendo/crono',
  '/travando/foco',
  '/armando/desafio',
]

const FALLBACK_TRAINER_ART = '/trainer-loading-fallback.png'

function resolveTrainerPortraitUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return FALLBACK_TRAINER_ART
  }

  if (value.startsWith('/storage/') || value.startsWith('storage/')) {
    return resolveMediaUrl(value) ?? FALLBACK_TRAINER_ART
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return resolveMediaUrl(value) ?? value
  }

  if (value.startsWith('/')) {
    return value
  }

  return resolveMediaUrl(value) ?? FALLBACK_TRAINER_ART
}

type WorkoutIntroSceneProps = {
  trainerName: string
  trainerPortraitUrl?: string | null
  trainingDayName: string
  phrase: string
  onComplete: () => void
}

export function WorkoutIntroScene({
  trainerName,
  trainerPortraitUrl,
  trainingDayName,
  phrase,
  onComplete,
}: WorkoutIntroSceneProps) {
  const loadingDurationMs = 5000
  const countdownDurationMs = 5000
  const totalDurationMs = loadingDurationMs + countdownDurationMs
  const [elapsedMs, setElapsedMs] = useState(0)
  const trainerInitials = useMemo(() => getInitials(trainerName), [trainerName])
  const portraitUrl = useMemo(
    () => resolveTrainerPortraitUrl(trainerPortraitUrl),
    [trainerPortraitUrl],
  )

  useEffect(() => {
    let frameId = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const nextElapsed = Math.min(totalDurationMs, now - startedAt)
      setElapsedMs(nextElapsed)

      if (nextElapsed >= totalDurationMs) {
        onComplete()
        return
      }

      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [onComplete])

  const isLoadingPhase = elapsedMs < loadingDurationMs
  const loadingProgress = Math.min((elapsedMs / loadingDurationMs) * 100, 100)
  const loadingIndex = Math.min(
    ASSET_MESSAGES.length - 1,
    Math.floor((loadingProgress / 100) * ASSET_MESSAGES.length),
  )
  const countdownElapsedMs = Math.max(0, elapsedMs - loadingDurationMs)
  const countdownRemainingMs = Math.max(0, countdownDurationMs - countdownElapsedMs)
  const countdownSeconds = Math.max(1, Math.ceil(countdownRemainingMs / 1000))
  const countdownProgress = countdownRemainingMs / countdownDurationMs
  const countdownRadius = 108
  const countdownCircumference = 2 * Math.PI * countdownRadius
  const countdownOffset = countdownCircumference * (1 - countdownProgress)
  const handoffProgress = Math.max(0, Math.min(1, (elapsedMs - (totalDurationMs - 500)) / 500))

  return (
    <section
      className={`workout-intro ${isLoadingPhase ? 'workout-intro--loading' : 'workout-intro--countdown'}`}
      aria-live="polite"
      style={{
        opacity: 1 - handoffProgress * 0.85,
        transform: `scale(${1 - handoffProgress * 0.025})`,
      }}
    >
      <div className="workout-intro__ambient" aria-hidden="true" />
      <div className="workout-intro__scanlines" aria-hidden="true" />

      {isLoadingPhase ? (
          <div className="workout-intro__center workout-intro__center--loading">
          <div className="workout-intro__showcase glass-premium">
            <div className="workout-intro__portrait-frame">
              <img
                className="workout-intro__portrait-art"
                src={portraitUrl}
                alt=""
                aria-hidden="true"
              />
              <div className="workout-intro__portrait-frame-inner">
                <span className="workout-intro__portrait-badge" aria-hidden="true">
                  {trainerInitials}
                </span>
                <p className="workout-intro__frame-label">Quadro do personal</p>
                <h1 className="workout-intro__frame-name">{trainerName}</h1>
                <p className="workout-intro__frame-day">{trainingDayName}</p>
              </div>
            </div>

            <div className="workout-intro__loading-copy">
              <p className="workout-intro__phase-label">Preparando a sessão</p>
              <p className="workout-intro__text">{phrase}</p>

              <div className="workout-intro__loading-board">
                <div className="min-w-0 flex-1">
                  <p className="workout-intro__asset-line">{ASSET_MESSAGES[loadingIndex]}</p>
                  <div className="workout-intro__progress-track" aria-hidden="true">
                    <span
                      className="workout-intro__progress-fill"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className="workout-intro__progress-meta">
                    <span>Preparando a arena</span>
                    <strong>{Math.round(loadingProgress)}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="workout-intro__hud">
            <div className="workout-intro__trainer-badge">
              <span className="workout-intro__avatar" aria-hidden="true">
                <img src={portraitUrl} alt="" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="workout-intro__label">Preparado por</p>
                <strong className="workout-intro__trainer-name">{trainerName}</strong>
              </div>
            </div>
          </div>

          <div className="workout-intro__center workout-intro__center--countdown">
            <p className="workout-intro__kicker">{trainingDayName}</p>
            <h1 className="workout-intro__title">Prepare-se</h1>

            <div className="workout-intro__countdown-block">
              <svg
                className="workout-intro__countdown-svg"
                viewBox="0 0 260 260"
                aria-hidden="true"
              >
                <circle
                  className="workout-intro__countdown-track"
                  cx="130"
                  cy="130"
                  r={countdownRadius}
                />
                <circle
                  className="workout-intro__countdown-progress"
                  cx="130"
                  cy="130"
                  r={countdownRadius}
                  strokeDasharray={countdownCircumference}
                  strokeDashoffset={countdownOffset}
                />
              </svg>
              <div className="workout-intro__countdown-value">{countdownSeconds}</div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
