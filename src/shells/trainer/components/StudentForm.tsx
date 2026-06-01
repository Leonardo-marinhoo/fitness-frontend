import { useState } from 'react'

import { ApiError } from '@/api/client'
import { createStudent, updateStudent } from '@/api/trainer'
import type { Student } from '@/types/fitness'

// ─── Design tokens ──────────────────────────────────────────────────────────

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(247,247,244,0.65)',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
}

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 10,
  padding: '11px 14px',
  color: '#f7f7f4',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  transition: 'border-color 0.15s',
}

const select: React.CSSProperties = {
  ...input,
  background: '#141414',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(247,247,244,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: 700,
  fontSize: 11,
  color: 'rgba(247,247,244,0.35)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: '1px solid rgba(255,255,255,0.07)',
}

const section: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: 28,
}

const row2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
}

const errorBox: React.CSSProperties = {
  background: 'rgba(255,80,80,0.10)',
  border: '1px solid rgba(255,80,80,0.28)',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 13,
  color: '#ff8080',
  marginBottom: 8,
}

// ─── Goal suggestions ────────────────────────────────────────────────────────

const GOAL_SUGGESTIONS = [
  'Hipertrofia',
  'Emagrecimento',
  'Força',
  'Condicionamento físico',
  'Reabilitação',
  'Manutenção',
  'Performance esportiva',
]

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  name: string
  email: string
  password: string
  birth_date: string
  gender: string
  training_level: string
  gym_name: string
  physical_limitations: string
  injuries: string
}

type Props = {
  /** Quando fornecido, opera em modo edição (sem email/senha). */
  student?: Student | null
  onSuccess: (student: Student) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StudentForm({ student, onSuccess }: Props) {
  const isEditing = !!student

  const [form, setForm] = useState<FormData>({
    name: student?.name ?? '',
    email: '',
    password: '',
    birth_date: student?.birth_date ?? '',
    gender: student?.gender ?? '',
    training_level: student?.training_level ?? '',
    gym_name: student?.gym_name ?? '',
    physical_limitations: student?.physical_limitations ?? '',
    injuries: student?.injuries ?? '',
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        birth_date: form.birth_date || undefined,
        gender: form.gender || undefined,
        training_level: form.training_level || undefined,
        gym_name: form.gym_name || undefined,
        physical_limitations: form.physical_limitations || undefined,
        injuries: form.injuries || undefined,
      }

      let result: Student

      if (isEditing && student) {
        result = await updateStudent(student.id, payload)
      } else {
        payload.email = form.email
        payload.password = form.password
        result = await createStudent(payload)
      }

      onSuccess(result)
    } catch (err) {
      if (err instanceof ApiError) {
        const firstError = Object.values(err.payload?.errors ?? {})[0]?.[0]
        setError(firstError ?? err.message)
      } else {
        setError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      {error && <div style={errorBox}>{error}</div>}

      {/* ── Acesso (apenas no cadastro) ──────────────────────────── */}
      {!isEditing && (
        <div style={section}>
          <p style={sectionTitle}>Acesso</p>
          <div style={field}>
            <label style={label}>E-mail *</label>
            <input
              style={input}
              name="email"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={handleChange}
              placeholder="aluno@email.com"
              required
            />
          </div>
          <div style={field}>
            <label style={label}>Senha inicial *</label>
            <input
              style={input}
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              required
            />
            <span style={{ fontSize: 12, color: 'rgba(247,247,244,0.35)' }}>
              O aluno poderá alterar depois do primeiro acesso.
            </span>
          </div>
        </div>
      )}

      {/* ── Dados Básicos ────────────────────────────────────────── */}
      <div style={section}>
        <p style={sectionTitle}>Dados Básicos</p>
        <div style={field}>
          <label style={label}>Nome completo *</label>
          <input
            style={input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo do aluno"
            required
          />
        </div>
        <div style={row2}>
          <div style={field}>
            <label style={label}>Data de nascimento</label>
            <input
              style={{ ...input, colorScheme: 'dark' }}
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
            />
          </div>
          <div style={field}>
            <label style={label}>Gênero</label>
            <select style={select} name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Selecionar</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>
        <div style={field}>
          <label style={label}>Academia</label>
          <input
            style={input}
            name="gym_name"
            value={form.gym_name}
            onChange={handleChange}
            placeholder="Nome da academia onde treina"
          />
        </div>
      </div>

      {/* ── Perfil de Treino ─────────────────────────────────────── */}
      <div style={section}>
        <p style={sectionTitle}>Perfil de Treino</p>
        <div style={field}>
          <label style={label}>Nível de treino</label>
          <select style={select} name="training_level" value={form.training_level} onChange={handleChange}>
            <option value="">Selecionar</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
            <option value="athlete">Atleta</option>
          </select>
          <span style={{ fontSize: 12, color: 'rgba(247,247,244,0.35)' }}>
            O próprio aluno poderá ajustar o nível na anamnese.
          </span>
        </div>
      </div>

      {/* ── Saúde ────────────────────────────────────────────────── */}
      <div style={section}>
        <p style={sectionTitle}>Saúde (opcional)</p>
        <div style={field}>
          <label style={label}>Limitações físicas</label>
          <textarea
            style={{ ...input, minHeight: 72, resize: 'vertical' } as React.CSSProperties}
            name="physical_limitations"
            value={form.physical_limitations}
            onChange={handleChange}
            placeholder="Ex: dor no joelho, escoliose..."
          />
        </div>
        <div style={field}>
          <label style={label}>Lesões</label>
          <textarea
            style={{ ...input, minHeight: 72, resize: 'vertical' } as React.CSSProperties}
            name="injuries"
            value={form.injuries}
            onChange={handleChange}
            placeholder="Ex: ombro operado em 2022..."
          />
        </div>
      </div>

      {/* ── Objetivo (informativo) ───────────────────────────────── */}
      <div
        style={{
          background: 'rgba(223,255,106,0.05)',
          border: '1px solid rgba(223,255,106,0.15)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 28,
          fontSize: 13,
          color: 'rgba(247,247,244,0.5)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'rgba(247,247,244,0.7)' }}>Objetivo do aluno</strong> — Este campo é
        preenchido pelo próprio aluno na anamnese. Sugestões:{' '}
        <span style={{ color: 'rgba(223,255,106,0.7)' }}>{GOAL_SUGGESTIONS.join(', ')}</span>.
      </div>

      {/* ── Submit ───────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn-accent w-full ${isSubmitting ? 'opacity-55' : ''}`}
      >
        {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar aluno'}
      </button>
    </form>
  )
}
