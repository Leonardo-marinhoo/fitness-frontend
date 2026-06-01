import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Clock,
  Dumbbell,
  FileHeart,
  FileText,
  Pencil,
  Plus,
  Scale,
} from 'lucide-react'

import { fetchStudent, fetchStudentAssessments, fetchStudentTrainingSheets } from '@/api/trainer'
import { StudentPortrait } from '@/shells/trainer/components/student/StudentPortrait'
import { EnumBadge } from '@/components/ui/enum-badge'
import {
  getAssessmentModeStyle,
  getGenderStyle,
  getLevelStyle,
  getSheetStatusStyle,
} from '@/lib/enum-colors'
import type { PhysicalAssessment, Student, TrainingSheet } from '@/types/fitness'

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR')
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--s-border)] py-2.5 last:border-0">
      <span className="text-sm text-foreground/50">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function InfoBadgeRow({
  label,
  badge,
}: {
  label: string
  badge: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--s-border)] py-2.5 last:border-0">
      <span className="text-sm text-foreground/50">{label}</span>
      <div className="shrink-0">{badge}</div>
    </div>
  )
}

// ─── Glass Action Card ────────────────────────────────────────────────────────

function GlassActionCard({
  label,
  desc,
  icon: Icon,
  tint,
  badge,
  onClick,
}: {
  label: string
  desc: string
  icon: React.ElementType
  tint: string
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-soft group relative flex flex-col items-start gap-4 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle, ${tint} 0%, transparent 65%)`, filter: 'blur(24px)' }}
      />

      <div
        className="pointer-events-none absolute right-6 top-6 size-1.5 rounded-full opacity-70"
        style={{ background: tint, boxShadow: `0 0 12px ${tint}` }}
      />

      <div
        className="relative flex size-14 items-center justify-center rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${tint}30, ${tint}12)`,
          border: `1px solid ${tint}40`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 18px -12px ${tint}55`,
        }}
      >
        <Icon size={26} style={{ color: tint }} />
      </div>

      <div className="relative w-full min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-base font-extrabold text-foreground">{label}</p>
          {badge && (
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
              style={{ background: `${tint}22`, color: tint, border: `1px solid ${tint}38` }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-foreground/55 leading-snug">{desc}</p>
      </div>

      <div className="relative flex w-full items-center justify-between gap-2 border-t border-[var(--s-border)] pt-3">
        <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: tint }}>
          Acessar
        </span>
        <ArrowRight
          size={14}
          className="text-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-foreground/70"
        />
      </div>
    </button>
  )
}

// ─── Assessment Row ───────────────────────────────────────────────────────────

function AssessmentRow({
  assessment,
  onClick,
}: {
  assessment: PhysicalAssessment
  onClick: () => void
}) {
  const modeStyle = getAssessmentModeStyle(assessment.input_mode)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-[var(--s-border)] px-4 py-3 text-left transition-all hover:border-[var(--s-border-h)] hover:bg-[var(--s2)]"
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${modeStyle.solid}1f` }}
      >
        <Scale size={15} style={{ color: modeStyle.solid }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{assessment.title}</p>
        <p className="text-xs text-foreground/40">
          {new Date(assessment.assessment_date).toLocaleDateString('pt-BR')}
          {assessment.weight_kg ? ` · ${assessment.weight_kg} kg` : ''}
          {assessment.bmi ? ` · IMC ${assessment.bmi.toFixed(1)}` : ''}
        </p>
      </div>
      <EnumBadge size="sm" style={modeStyle} />
      <ArrowRight size={13} className="shrink-0 text-foreground/20 group-hover:text-foreground/50" />
    </button>
  )
}

// ─── Training sheet card (premium) ────────────────────────────────────────────

function TrainingSheetCard({ sheet, onClick }: { sheet: TrainingSheet; onClick: () => void }) {
  const statusStyle = getSheetStatusStyle(sheet.status)
  const start = formatDate(sheet.start_date)
  const end = formatDate(sheet.end_date)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-[var(--s-border)] bg-[var(--s1)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/25 hover:bg-[var(--s2)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-25 blur-2xl"
        style={{ background: statusStyle.solid }}
      />

      <div className="relative flex items-center gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-md"
          style={{
            background: `linear-gradient(135deg, ${statusStyle.solid}28, ${statusStyle.solid}10)`,
            border: `1px solid ${statusStyle.solid}35`,
          }}
        >
          <ClipboardList size={20} style={{ color: statusStyle.solid }} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">{sheet.name}</p>
          <p className="mt-0.5 text-xs text-foreground/45">
            {start ? `Início ${start}` : 'Sem data de início'}
            {end ? ` · Fim ${end}` : ''}
            {sheet.goal ? ` · ${sheet.goal}` : ''}
          </p>
        </div>

        <EnumBadge size="sm" style={statusStyle} />
        <ArrowRight
          size={15}
          className="shrink-0 text-foreground/25 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/55"
        />
      </div>
    </button>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  tint,
  onNew,
  newLabel,
  onManage,
  manageLabel,
}: {
  title: string
  tint: string
  onNew: () => void
  newLabel: string
  onManage: () => void
  manageLabel: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-0.5 rounded-full" style={{ background: tint }} />
        <h2 className="text-eyebrow" style={{ color: tint }}>
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm font-semibold transition-colors"
          style={{
            borderColor: `color-mix(in oklab, ${tint} 40%, transparent)`,
            background: `color-mix(in oklab, ${tint} 12%, transparent)`,
            color: tint,
          }}
        >
          <Plus size={14} strokeWidth={2.25} />
          {newLabel}
        </button>
        <button
          type="button"
          onClick={onManage}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[var(--s-border)] bg-[var(--s2)] px-3.5 text-sm font-medium text-foreground/55 transition-colors hover:border-[var(--s-border-h)] hover:text-foreground"
        >
          {manageLabel}
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([])
  const [sheets, setSheets] = useState<TrainingSheet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    const id = Number(studentId)
    void Promise.all([
      fetchStudent(id),
      fetchStudentAssessments(id),
      fetchStudentTrainingSheets(id),
    ])
      .then(([s, a, sh]) => {
        setStudent(s)
        setAssessments(a)
        setSheets(sh)
      })
      .catch(() => setStudent(null))
      .finally(() => setIsLoading(false))
  }, [studentId])

  if (isLoading) {
    return <p className="py-10 text-center text-sm text-foreground/40">Carregando...</p>
  }

  if (!student) {
    return <p className="py-10 text-center text-sm text-foreground/40">Aluno não encontrado.</p>
  }

  const hasAnamnesis = student.has_completed_anamnesis
  const recentAssessments = assessments.slice(0, 3)
  const recentSheets = sheets.slice(0, 5)
  const activeSheet = sheets.find((s) => s.status === 'active')

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/trainer/students"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Voltar para Alunos
      </Link>

      {/* Perfil premium */}
      <div className="s1 relative overflow-hidden p-6 sm:p-7">
        <div
          className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--accent-lime)' }}
        />
        <div
          className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--color-cyan)' }}
        />

        <button
          type="button"
          onClick={() => navigate(`/trainer/students/${studentId ?? ''}/edit`)}
          className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-md border border-[var(--s-border)] bg-[var(--s2)] text-foreground/55 transition-colors hover:border-cyan-500/35 hover:text-cyan-300"
          aria-label="Editar aluno"
        >
          <Pencil size={15} strokeWidth={2.25} />
        </button>

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <StudentPortrait student={student} size="lg" />

          <div className="min-w-0 flex-1 pr-10">
            <p className="text-eyebrow text-[var(--color-cyan)]">Perfil do aluno</p>
            <h1 className="type-page-title mt-1">{student.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {student.training_level && (
                <EnumBadge size="sm" style={getLevelStyle(student.training_level)} />
              )}
              {student.gender && (
                <EnumBadge size="sm" style={getGenderStyle(student.gender)} />
              )}
              {student.gym_name && (
                <span className="rounded-full border border-[var(--s-border)] bg-[var(--s2)] px-2.5 py-1 text-xs text-foreground/55">
                  {student.gym_name}
                </span>
              )}
              <EnumBadge
                size="sm"
                style={
                  hasAnamnesis
                    ? {
                        label: 'Anamnese completa',
                        text: 'var(--accent-lime)',
                        bg: 'rgba(200,241,53,0.14)',
                        border: 'rgba(200,241,53,0.28)',
                        solid: 'var(--accent-lime)',
                      }
                    : {
                        label: 'Anamnese pendente',
                        text: '#f3bb61',
                        bg: 'rgba(243,187,97,0.15)',
                        border: 'rgba(243,187,97,0.28)',
                        solid: '#f3bb61',
                      }
                }
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ProfileMetric label="Peso" value={student.weight != null ? `${student.weight} kg` : '—'} />
              <ProfileMetric label="Altura" value={student.height != null ? `${student.height} cm` : '—'} />
              <ProfileMetric
                label="Objetivo"
                value={student.goal ?? '—'}
                className="col-span-2 sm:col-span-1"
              />
              <ProfileMetric
                label="Fichas"
                value={sheets.length > 0 ? String(sheets.length) : '—'}
                className="col-span-2 sm:col-span-1"
              />
            </dl>
          </div>
        </div>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <GlassActionCard
          label="Ver Anamnese"
          desc={hasAnamnesis ? 'Dados físicos, saúde e fotos' : 'Anamnese ainda não preenchida'}
          icon={FileHeart}
          tint="var(--accent-lime)"
          badge={hasAnamnesis ? undefined : 'Pendente'}
          onClick={() => navigate(`/trainer/students/${student.id}/anamnesis`)}
        />
        <GlassActionCard
          label="Avaliações Físicas"
          desc={
            assessments.length > 0
              ? `${assessments.length} avaliação${assessments.length !== 1 ? 'ões' : ''} registrada${assessments.length !== 1 ? 's' : ''}`
              : 'Nenhuma avaliação ainda'
          }
          icon={Activity}
          tint="var(--color-violet)"
          badge={assessments.length > 0 ? String(assessments.length) : undefined}
          onClick={() => navigate(`/trainer/students/${student.id}/assessments`)}
        />
        <GlassActionCard
          label="Ficha ativa"
          desc={
            activeSheet
              ? activeSheet.name
              : sheets.length > 0
                ? 'Nenhuma ficha ativa no momento'
                : 'Crie a primeira ficha de treino'
          }
          icon={ClipboardList}
          tint="var(--color-cyan)"
          badge={activeSheet ? 'Ativa' : undefined}
          onClick={() => {
            if (activeSheet) navigate(`/trainer/training-sheets/${activeSheet.id}`)
            else navigate(`/trainer/students/${student.id}/training-sheets/new`)
          }}
        />
      </div>

      {/* Dados */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="s1 flex flex-col p-5">
          <p className="text-eyebrow mb-3">Dados pessoais</p>
          <InfoRow label="Data de nascimento" value={formatDate(student.birth_date)} />
          <InfoBadgeRow
            label="Gênero"
            badge={
              student.gender ? (
                <EnumBadge style={getGenderStyle(student.gender)} size="sm" />
              ) : (
                <EnumBadge label="Não informado" size="sm" />
              )
            }
          />
          <InfoRow label="Altura" value={student.height ? `${student.height} cm` : null} />
          <InfoRow label="Peso" value={student.weight ? `${student.weight} kg` : null} />
          {!student.birth_date && !student.gender && !student.height && !student.weight && (
            <p className="py-2 text-sm italic text-foreground/30">Aguardando anamnese.</p>
          )}
        </div>

        <div className="s1 flex flex-col p-5">
          <p className="text-eyebrow mb-3">Treino e objetivos</p>
          <InfoBadgeRow
            label="Objetivo"
            badge={
              student.goal ? (
                <EnumBadge
                  size="sm"
                  label={student.goal}
                  style={{
                    label: student.goal,
                    text: 'var(--accent-lime)',
                    bg: 'rgba(200,241,53,0.14)',
                    border: 'rgba(200,241,53,0.28)',
                    solid: 'var(--accent-lime)',
                  }}
                />
              ) : (
                <EnumBadge label="Não informado" size="sm" />
              )
            }
          />
          <InfoBadgeRow
            label="Nível"
            badge={
              student.training_level ? (
                <EnumBadge size="sm" style={getLevelStyle(student.training_level)} />
              ) : (
                <EnumBadge label="Não informado" size="sm" />
              )
            }
          />
          <InfoBadgeRow
            label="Anamnese"
            badge={
              <EnumBadge
                size="sm"
                style={
                  hasAnamnesis
                    ? {
                        label: 'Completa',
                        text: 'var(--accent-lime)',
                        bg: 'rgba(200,241,53,0.14)',
                        border: 'rgba(200,241,53,0.28)',
                        solid: 'var(--accent-lime)',
                      }
                    : {
                        label: 'Pendente',
                        text: '#f3bb61',
                        bg: 'rgba(243,187,97,0.15)',
                        border: 'rgba(243,187,97,0.28)',
                        solid: '#f3bb61',
                      }
                }
              />
            }
          />
          <InfoBadgeRow
            label="Academia"
            badge={
              student.gym_name ? (
                <EnumBadge
                  size="sm"
                  label={student.gym_name}
                  style={{
                    label: student.gym_name,
                    text: '#70d7ff',
                    bg: 'rgba(112,215,255,0.15)',
                    border: 'rgba(112,215,255,0.28)',
                    solid: '#70d7ff',
                  }}
                />
              ) : (
                <EnumBadge label="Não informada" size="sm" />
              )
            }
          />
        </div>
      </div>

      {/* Fichas de treino — destaque */}
      <div className="s1 flex flex-col gap-4 p-5 sm:p-6">
        <SectionHeader
          title="Fichas de treino"
          tint="var(--color-cyan)"
          newLabel="Nova ficha"
          manageLabel="Ver todas"
          onNew={() => navigate(`/trainer/students/${student.id}/training-sheets/new`)}
          onManage={() => navigate('/trainer/training-sheets')}
        />

        {recentSheets.length === 0 ? (
          <button
            type="button"
            onClick={() => navigate(`/trainer/students/${student.id}/training-sheets/new`)}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-500/35 py-12 text-center transition-colors hover:border-cyan-500/55 hover:bg-cyan-500/[0.04]"
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-cyan-500/35 bg-cyan-500/10 text-cyan-300">
              <Plus size={18} />
            </span>
            <span className="text-sm font-semibold text-foreground/70">Criar primeira ficha de treino</span>
            <span className="text-xs text-foreground/40">Monte divisões e exercícios para este aluno</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentSheets.map((sh) => (
              <TrainingSheetCard
                key={sh.id}
                sheet={sh}
                onClick={() => navigate(`/trainer/training-sheets/${sh.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Avaliações */}
      <div className="s1 flex flex-col gap-4 p-5 sm:p-6">
        <SectionHeader
          title="Últimas avaliações físicas"
          tint="var(--color-violet)"
          newLabel="Nova avaliação"
          manageLabel="Ver todas"
          onNew={() => navigate(`/trainer/students/${student.id}/assessments/new`)}
          onManage={() => navigate(`/trainer/students/${student.id}/assessments`)}
        />

        {recentAssessments.length === 0 ? (
          <p className="py-6 text-center text-sm italic text-foreground/30">Nenhuma avaliação registrada.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentAssessments.map((a) => (
              <AssessmentRow
                key={a.id}
                assessment={a}
                onClick={() => navigate(`/trainer/students/${student.id}/assessments/${a.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Acesso rápido */}
      <div className="s1 flex flex-col gap-3 p-5">
        <p className="text-eyebrow text-foreground/45">Acesso rápido</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <QuickNavLink label="Exercícios" desc="Biblioteca" icon={Dumbbell} to="/trainer/exercises" tint="var(--color-amber)" />
          <QuickNavLink label="Sessões" desc="Registros de treino" icon={Clock} to="/trainer/sessions" tint="var(--color-red)" />
          <QuickNavLink label="Todas as fichas" desc="Lista completa" icon={FileText} to="/trainer/training-sheets" tint="var(--color-cyan)" />
        </div>
      </div>
    </div>
  )
}

function ProfileMetric({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40">{label}</dt>
      <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  )
}

function QuickNavLink({
  label,
  desc,
  icon: Icon,
  to,
  tint,
}: {
  label: string
  desc: string
  icon: React.ElementType
  to: string
  tint: string
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-[var(--s-border)] bg-[var(--s2)] px-4 py-3 transition-all hover:border-[var(--s-border-h)]"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `color-mix(in oklab, ${tint} 18%, transparent)` }}
      >
        <Icon size={16} style={{ color: tint }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-foreground/40">{desc}</p>
      </div>
      <ArrowRight size={13} className="text-foreground/20 group-hover:text-foreground/50" />
    </Link>
  )
}
