import { resolveMediaUrl } from '@/lib/media-url'
import { formatSheetPeriod, getSheetCoverImage } from '@/lib/student-training'
import type { TrainingSheet } from '@/types/fitness'

type TreinoSheetHeroProps = {
  sheet: TrainingSheet
  trainingCount: number
  exerciseCount: number
}

export function TreinoSheetHero({ sheet, trainingCount, exerciseCount }: TreinoSheetHeroProps) {
  const cover = resolveMediaUrl(getSheetCoverImage(sheet)) ?? getSheetCoverImage(sheet)
  const period = formatSheetPeriod(sheet)

  return (
    <section className="treino-hero">
      <div className="treino-hero__media" style={{ backgroundImage: `url('${cover}')` }}>
        <div className="treino-hero__content">
          <div className="treino-hero__topline">
            <span className="treino-hero__kicker">Plano ativo</span>
            <span className="treino-hero__period">{period}</span>
          </div>

          <h1 className="treino-hero__title">{sheet.name}</h1>

          {sheet.goal ? <p className="treino-hero__goal">{sheet.goal}</p> : null}

          <div className="treino-hero__stats" aria-label="Resumo da ficha">
            <div className="treino-hero__stat">
              <span className="treino-hero__stat-value">{trainingCount}</span>
              <span className="treino-hero__stat-label">
                treino{trainingCount === 1 ? '' : 's'}
              </span>
            </div>
            <span className="treino-hero__stat-divider" aria-hidden />
            <div className="treino-hero__stat">
              <span className="treino-hero__stat-value">{exerciseCount}</span>
              <span className="treino-hero__stat-label">
                exercício{exerciseCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
