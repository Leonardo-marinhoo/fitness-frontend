import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'

import { fetchStudent } from '@/api/trainer'
import type { Student } from '@/types/fitness'

// ─── Design helpers ────────────────────────────────────────────────────────────

const surface: React.CSSProperties = {
  background: 'var(--s1)',
  border: '1px solid var(--s-border)',
  borderRadius: 16,
  padding: '20px 22px',
  marginBottom: 14,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '4px',
  textTransform: 'uppercase',
  color: 'var(--color-primary, var(--accent-lime))',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  margin: '0 0 14px',
  opacity: 0.85,
}

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === '') return null
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--s-border)] py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-foreground/50">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="text-sm italic text-foreground/30">{message}</p>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a YYYY-MM-DD date string to a pt-BR formatted date without UTC offset issues.
 */
function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR')
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const levelLabel: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
  athlete: 'Atleta',
}

const genderLabel: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  other: 'Outro',
}

const photoLabel: Record<string, string> = {
  front: 'Frente',
  left_side: 'Lado esquerdo',
  right_side: 'Lado direito',
  back: 'Costas',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StudentAnamnesisPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    fetchStudent(Number(studentId))
      .then(setStudent)
      .catch(() => setStudent(null))
      .finally(() => setIsLoading(false))
  }, [studentId])

  if (isLoading) {
    return <p className="py-16 text-center text-sm text-foreground/40">Carregando anamnese...</p>
  }

  if (!student) {
    return <p className="py-16 text-center text-sm text-foreground/40">Aluno não encontrado.</p>
  }

  const photos: { type: string; image_url: string }[] =
    (student as unknown as { anamnesis_photos?: { type: string; image_url: string }[] }).anamnesis_photos ?? []

  return (
    <div className="mx-auto max-w-4xl overflow-x-hidden">
      {/* Back */}
      <Link
        to={`/trainer/students/${student.id}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Voltar para {student.name}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[4px] text-foreground/40">
          Anamnese do aluno
        </p>
        <h1 className="type-page-title mb-2">
          {student.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              student.has_completed_anamnesis
                ? 'bg-primary/12 text-primary'
                : 'bg-amber-500/12 text-amber-400'
            }`}
          >
            {student.has_completed_anamnesis ? '✓ Anamnese completa' : '⚠ Anamnese pendente'}
          </span>
          {student.anamnesis_completed_at && (
            <span className="text-xs text-foreground/40">
              Preenchida em {new Date(student.anamnesis_completed_at).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {/* Two-column layout on wide screens */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

        {/* Dados pessoais */}
        <div style={surface}>
          <p style={sectionTitle}>Dados pessoais</p>
          <Row label="Nome" value={student.name} />
          <Row label="Gênero" value={student.gender ? genderLabel[student.gender] ?? student.gender : null} />
          <Row label="Data de nascimento" value={formatDate(student.birth_date)} />
          <Row
            label="Idade"
            value={
              student.birth_date
                ? `${Math.floor((Date.now() - new Date(student.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000))} anos`
                : null
            }
          />
          <Row label="Academia" value={student.gym_name} />
        </div>

        {/* Medidas físicas */}
        <div style={surface}>
          <p style={sectionTitle}>Medidas físicas</p>
          <Row label="Altura" value={student.height ? `${student.height} cm` : null} />
          <Row label="Peso" value={student.weight ? `${student.weight} kg` : null} />
          {student.height && student.weight && (
            <Row
              label="IMC estimado"
              value={(() => {
                const h = student.height / 100
                return (student.weight / (h * h)).toFixed(1)
              })()}
            />
          )}
          {!student.height && !student.weight && (
            <EmptyRow message="Dados físicos não informados ainda." />
          )}
        </div>

        {/* Treino */}
        <div style={surface}>
          <p style={sectionTitle}>Treino e objetivos</p>
          <Row label="Objetivo" value={student.goal} />
          <Row
            label="Nível de treino"
            value={student.training_level ? levelLabel[student.training_level] ?? student.training_level : null}
          />
          {!student.goal && !student.training_level && (
            <EmptyRow message="Objetivo e nível não informados ainda." />
          )}
        </div>

        {/* Saúde */}
        <div style={surface}>
          <p style={sectionTitle}>Histórico de saúde</p>
          {student.physical_limitations ? (
            <div className="mb-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/38">
                Limitações físicas
              </p>
              <p className="text-sm leading-relaxed text-foreground">{student.physical_limitations}</p>
            </div>
          ) : null}
          {student.injuries ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/38">
                Lesões anteriores / em tratamento
              </p>
              <p className="text-sm leading-relaxed text-foreground">{student.injuries}</p>
            </div>
          ) : null}
          {!student.physical_limitations && !student.injuries && (
            <EmptyRow message="Nenhuma limitação ou lesão informada." />
          )}
        </div>
      </div>

      {/* Photos */}
      <div style={{ ...surface, marginTop: 0 }}>
        <div className="mb-4 flex items-center gap-2">
          <Camera size={15} className="text-primary opacity-85" />
          <p style={sectionTitle} className="!m-0">Fotos da anamnese</p>
        </div>

        {photos.length === 0 ? (
          <p className="text-sm italic text-foreground/30">Nenhuma foto enviada pelo aluno.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.type}>
                <img
                  src={photo.image_url}
                  alt={photoLabel[photo.type] ?? photo.type}
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    objectFit: 'cover',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                />
                <p className="mt-1.5 text-center text-xs text-foreground/50">
                  {photoLabel[photo.type] ?? photo.type}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
