import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Plus,
  Search,
} from 'lucide-react'

import { fetchTrainerStudents, fetchTrainingSheets } from '@/api/trainer'
import { TrainerButton, TrainerCard, TrainerPageHeader } from '@/components/trainer-ui'
import { EnumBadge } from '@/components/ui/enum-badge'
import { getSheetStatusStyle, SHEET_STATUS } from '@/lib/enum-colors'
import { StudentPortrait } from '@/shells/trainer/components/student/StudentPortrait'
import type { Student, TrainingSheet } from '@/types/fitness'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return '—'
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR')
}

function studentName(students: Student[], id: number) {
  return students.find((s) => s.id === id)?.name ?? null
}

// ─── Sheet Card ─────────────────────────────────────────────────────────────

function SheetCard({
  sheet,
  studentLabel,
}: {
  sheet: TrainingSheet
  studentLabel: string | null
}) {
  const statusStyle = getSheetStatusStyle(sheet.status)
  const days = sheet.training_days?.length ?? 0

  return (
    <Link to={`/trainer/training-sheets/${sheet.id}`} className="block">
      <TrainerCard variant="interactive" className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `${statusStyle.solid}22`,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            <ClipboardList size={20} style={{ color: statusStyle.solid }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-trainer-text">{sheet.name}</p>
            {studentLabel ? (
              <p className="mt-0.5 truncate text-xs text-trainer-muted">{studentLabel}</p>
            ) : null}
          </div>
        </div>
        <EnumBadge size="sm" style={statusStyle} />
      </div>

      <div className="relative flex flex-wrap items-center gap-1.5">
        {sheet.division_type && (
          <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] font-medium text-foreground/65">
            {sheet.division_type}
          </span>
        )}
        {sheet.goal ? (
          <span className="rounded-full bg-trainer-accent/10 px-2.5 py-1 text-[11px] text-trainer-accent">
            {sheet.goal}
          </span>
        ) : null}
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] font-medium text-foreground/55">
          {days} {days === 1 ? 'divisão' : 'divisões'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-trainer-border pt-3 text-[11px] text-trainer-muted">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={11} />
          {formatDate(sheet.start_date)}
          {sheet.end_date ? ` → ${formatDate(sheet.end_date)}` : ' · sem término'}
        </span>
        <ArrowRight size={13} className="text-trainer-subtle" />
      </div>
      </TrainerCard>
    </Link>
  )
}

// ─── Status filter pills ────────────────────────────────────────────────────

function StatusFilter({
  value,
  onChange,
  counts,
}: {
  value: string
  onChange: (v: string) => void
  counts: Record<string, number>
}) {
  const items: Array<{ key: string; label: string; total: number }> = [
    { key: 'all', label: 'Todas', total: Object.values(counts).reduce((a, b) => a + b, 0) },
    ...Object.entries(SHEET_STATUS).map(([key, val]) => ({
      key,
      label: val.label,
      total: counts[key] ?? 0,
    })),
  ]
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((it) => {
        const active = value === it.key
        const style =
          it.key === 'all' ? null : (SHEET_STATUS as Record<string, { text: string; bg: string }>)[it.key]
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              active
                ? 'bg-white/12 text-foreground shadow-sm'
                : 'bg-white/4 text-foreground/55 hover:bg-white/8 hover:text-foreground/85'
            }`}
            style={active && style ? { color: style.text, background: style.bg } : undefined}
          >
            {it.label}
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                active ? 'bg-[var(--bg-subtle)]/60' : 'bg-white/8'
              }`}
            >
              {it.total}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function TrainingSheetsPage() {
  const navigate = useNavigate()
  const [sheets, setSheets] = useState<TrainingSheet[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [sheetsData, studentsData] = await Promise.all([
        fetchTrainingSheets(),
        fetchTrainerStudents(),
      ])
      setSheets(sheetsData)
      setStudents(studentsData)
    } catch {
      setSheets([])
    } finally {
      setIsLoading(false)
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of sheets) c[s.status] = (c[s.status] ?? 0) + 1
    return c
  }, [sheets])

  const visibleSheets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return sheets.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (!term) return true
      const name = studentName(students, s.student_id) ?? ''
      return (
        s.name.toLowerCase().includes(term) ||
        name.toLowerCase().includes(term) ||
        (s.goal ?? '').toLowerCase().includes(term) ||
        (s.division_type ?? '').toLowerCase().includes(term)
      )
    })
  }, [sheets, students, statusFilter, search])

  const activeCount = counts.active ?? 0
  const activeStudents = useMemo(() => {
    const ids = new Set(
      sheets.filter((s) => s.status === 'active').map((s) => s.student_id),
    )

    return students.filter((s) => ids.has(s.id)).slice(0, 4)
  }, [sheets, students])

  return (
    <div className="flex flex-col gap-6">
      <TrainerPageHeader
        eyebrow="Fichas de Treino"
        title="Gerencie os planos dos seus alunos"
        description={`${activeCount} ativa${activeCount !== 1 ? 's' : ''} · ${sheets.length} ficha${sheets.length !== 1 ? 's' : ''} no total`}
        actions={
          <TrainerButton onClick={() => navigate('/trainer/training-sheets/new')}>
            <Plus size={18} />
            Nova ficha
          </TrainerButton>
        }
      />

      {activeStudents.length > 0 ? (
        <div className="flex items-center gap-2">
          <div className="td-avatar-stack">
            {activeStudents.map((student) => (
              <StudentPortrait
                key={student.id}
                student={student}
                size="sm"
                className="!size-8 shrink-0"
              />
            ))}
          </div>
          <span className="text-xs text-zinc-400">Alunos com ficha ativa</span>
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome da ficha, aluno, objetivo..."
            className="w-full rounded-2xl border border-[var(--s-border)] bg-[var(--s1)] py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/35 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition"
          />
        </div>

        <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="s1 h-40 animate-pulse" />
          ))}
        </div>
      ) : visibleSheets.length === 0 ? (
        <div className="surface-soft flex flex-col items-center gap-4 p-12 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(200,241,53,0.10)',
              border: '1px solid rgba(200,241,53,0.20)',
            }}
          >
            <ClipboardList size={28} className="text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="font-display text-lg font-bold text-foreground">
              {sheets.length === 0 ? 'Crie sua primeira ficha' : 'Nenhum resultado'}
            </h3>
            <p className="mt-1 text-sm text-foreground/55">
              {sheets.length === 0
                ? 'Comece criando uma ficha para um dos seus alunos. Depois você adiciona divisões e exercícios.'
                : 'Ajuste os filtros ou a busca para encontrar a ficha.'}
            </p>
          </div>
          {sheets.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/trainer/training-sheets/new')}
              className="btn-premium flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold"
            >
              <Plus size={16} />
              Criar ficha
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSheets.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              studentLabel={studentName(students, sheet.student_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
