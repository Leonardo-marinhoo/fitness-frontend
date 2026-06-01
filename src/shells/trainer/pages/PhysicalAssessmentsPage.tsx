import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Plus, Scale, Trash2 } from 'lucide-react'

import { deleteAssessment, fetchStudent, fetchStudentAssessments } from '@/api/trainer'
import type { PhysicalAssessment, Student } from '@/types/fitness'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputModeConfig: Record<string, { label: string; tint: string }> = {
  manual: { label: 'Manual', tint: 'var(--color-cyan)' },
  automatic: { label: 'Automático', tint: 'var(--color-violet)' },
  approximation: { label: 'Aproximação', tint: 'var(--accent-lime)' },
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

// ─── Metric Badge ─────────────────────────────────────────────────────────────

function MetricChip({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null) return null
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-[var(--s-border)] bg-[var(--s2)] px-3 py-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

// ─── Assessment Card ──────────────────────────────────────────────────────────

function AssessmentCard({
  assessment,
  onOpen,
  onDelete,
  isDeleting,
}: {
  assessment: PhysicalAssessment
  onOpen: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  const mode = inputModeConfig[assessment.input_mode] ?? { label: assessment.input_mode, tint: 'rgba(255,255,255,0.4)' }

  return (
    <div
      className="s1 flex cursor-pointer flex-col gap-4 p-5 transition-all hover:border-[var(--s-border-h)] hover:bg-[var(--s2)]"
      onClick={onOpen}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${mode.tint}18` }}
          >
            <Scale size={18} style={{ color: mode.tint }} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{assessment.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: `${mode.tint}15`, color: mode.tint }}
              >
                {mode.label}
              </span>
              <span className="text-xs text-foreground/40">
                {new Date(assessment.assessment_date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-lg p-2 text-destructive/50 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
          <ArrowRight size={15} className="text-foreground/25" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-2">
        <MetricChip label="Peso" value={assessment.weight_kg ? `${assessment.weight_kg} kg` : null} />
        <MetricChip label="IMC" value={assessment.bmi?.toFixed(1)} />
        <MetricChip label="BF%" value={assessment.body_fat_percentage ? `${assessment.body_fat_percentage}%` : null} />
        <MetricChip label="TMB" value={assessment.bmr_kcal ? `${Math.round(assessment.bmr_kcal)} kcal` : null} />
      </div>

      {/* Photos */}
      {assessment.photos && assessment.photos.length > 0 && (
        <div className="flex gap-2">
          {assessment.photos.slice(0, 4).map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt={photo.type}
              className="h-16 w-12 rounded-lg border border-[var(--s-border)] object-cover"
            />
          ))}
          {assessment.photos.length > 4 && (
            <div className="flex h-16 w-12 items-center justify-center rounded-lg border border-[var(--s-border)] bg-[var(--s2)] text-xs font-semibold text-foreground/40">
              +{assessment.photos.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PhysicalAssessmentsPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!studentId) return
    const id = Number(studentId)
    void Promise.all([fetchStudent(id), fetchStudentAssessments(id)])
      .then(([s, a]) => {
        setStudent(s)
        setAssessments(a)
      })
      .finally(() => setIsLoading(false))
  }, [studentId])

  async function handleDelete(id: number) {
    if (!confirm('Remover esta avaliação permanentemente?')) return
    setDeletingId(id)
    try {
      await deleteAssessment(id)
      setAssessments((prev) => prev.filter((a) => a.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <p className="py-16 text-center text-sm text-foreground/40">Carregando avaliações...</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <Link
        to={`/trainer/students/${studentId}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Voltar para {student?.name ?? 'Aluno'}
      </Link>

      {/* Header */}
      <div className="s1 flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          {student && (
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(200,241,53,0.22), rgba(168,140,255,0.22))',
                color: 'var(--accent-lime)',
                border: '1px solid var(--s-border-h)',
              }}
            >
              {getInitials(student.name)}
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-foreground/40">
              Avaliações físicas
            </p>
            <h1 className="type-page-title text-xl">
              {student?.name ?? '—'}
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate(`/trainer/students/${studentId}/assessments/new`)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={15} />
          Nova avaliação
        </button>
      </div>

      {/* Stats summary */}
      {assessments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="s1 flex flex-col items-center gap-1 p-4 text-center">
            <span className="type-metric text-primary">{assessments.length}</span>
            <span className="text-xs text-foreground/50">Total de avaliações</span>
          </div>
          <div className="s1 flex flex-col items-center gap-1 p-4 text-center">
            <span className="type-metric" style={{ color: 'var(--color-cyan)' }}>
              {assessments[0]?.weight_kg ? `${assessments[0].weight_kg}` : '—'}
            </span>
            <span className="text-xs text-foreground/50">Peso atual (kg)</span>
          </div>
          <div className="s1 flex flex-col items-center gap-1 p-4 text-center">
            <span className="type-metric" style={{ color: 'var(--color-violet)' }}>
              {assessments[0]?.body_fat_percentage ? `${assessments[0].body_fat_percentage}%` : '—'}
            </span>
            <span className="text-xs text-foreground/50">BF% mais recente</span>
          </div>
        </div>
      )}

      {/* List */}
      {assessments.length === 0 ? (
        <div className="s1 flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-foreground/6">
            <Activity size={26} className="text-foreground/25" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/60">Nenhuma avaliação registrada</p>
            <p className="mt-1 text-xs text-foreground/35">Registre a primeira avaliação física deste aluno.</p>
          </div>
          <button
            onClick={() => navigate(`/trainer/students/${studentId}/assessments/new`)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <Plus size={14} />
            Registrar primeira avaliação
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {assessments.map((a) => (
            <AssessmentCard
              key={a.id}
              assessment={a}
              onOpen={() => navigate(`/trainer/students/${studentId}/assessments/${a.id}`)}
              onDelete={() => void handleDelete(a.id)}
              isDeleting={deletingId === a.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
