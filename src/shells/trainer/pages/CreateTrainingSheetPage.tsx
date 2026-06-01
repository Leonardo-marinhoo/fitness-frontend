import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

import { ApiError } from '@/api/client'
import {
  createTrainingSheet,
  duplicateTrainingSheet,
  fetchStudent,
  fetchTrainerStudents,
  fetchTrainingSheets,
  updateTrainingSheet,
} from '@/api/trainer'
import type { Student, TrainingSheet } from '@/types/fitness'

const inputClass =
  'w-full rounded-xl border border-[var(--s-border-h)] bg-[var(--s2)] px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition'

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[2px] text-foreground/45">
      {children}
      {required && <span className="ml-1 text-primary">*</span>}
    </label>
  )
}

export function CreateTrainingSheetPage() {
  const { studentId } = useParams<{ studentId?: string }>()
  const navigate = useNavigate()
  const presetStudentId = studentId ? Number(studentId) : null

  const [students, setStudents] = useState<Student[]>([])
  const [existingSheets, setExistingSheets] = useState<TrainingSheet[]>([])
  const [copyFromSheetId, setCopyFromSheetId] = useState('')
  const [presetStudent, setPresetStudent] = useState<Student | null>(null)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    student_id: presetStudentId ? String(presetStudentId) : '',
    name: '',
    goal: '',
    division_type: '',
    start_date: today,
    end_date: '',
    general_notes: '',
  })

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        if (presetStudentId) {
          const s = await fetchStudent(presetStudentId)
          if (!mounted) return
          setPresetStudent(s)
          setForm((prev) => ({
            ...prev,
            goal: prev.goal || s.goal || '',
            name: prev.name || (s.goal ? `Ficha — ${s.goal}` : ''),
          }))
        } else {
          const list = await fetchTrainerStudents()
          if (!mounted) return
          setStudents(list)
        }
        const sheets = await fetchTrainingSheets()
        if (mounted) setExistingSheets(sheets)
      } catch {
        if (mounted) setError('Não foi possível carregar os dados.')
      } finally {
        if (mounted) setLoadingMeta(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [presetStudentId])

  function setField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field as string]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field as string]
        return next
      })
    }
  }

  const canSubmit = useMemo(
    () => Boolean(form.student_id && form.name.trim()) && !isSubmitting,
    [form.student_id, form.name, isSubmitting],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!form.student_id) errors.student_id = 'Selecione um aluno.'
    if (!form.name.trim()) errors.name = 'Dê um nome à ficha.'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const studentIdNum = Number(form.student_id)

      if (copyFromSheetId) {
        const duplicated = await duplicateTrainingSheet(Number(copyFromSheetId), studentIdNum)
        if (form.name.trim() !== duplicated.name) {
          await updateTrainingSheet(duplicated.id, { name: form.name.trim() })
        }
        navigate(`/trainer/training-sheets/${duplicated.id}`)
        return
      }

      const payload: Record<string, unknown> = {
        student_id: studentIdNum,
        name: form.name.trim(),
        start_date: form.start_date || today,
      }
      if (form.goal.trim()) payload.goal = form.goal.trim()
      if (form.division_type.trim()) payload.division_type = form.division_type.trim()
      if (form.end_date) payload.end_date = form.end_date
      if (form.general_notes.trim()) payload.general_notes = form.general_notes.trim()

      const created = await createTrainingSheet(payload)
      navigate(`/trainer/training-sheets/${created.id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        const fields = err.payload?.errors
        if (fields) {
          const formatted: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(fields)) {
            formatted[key] = msgs[0]
          }
          setFieldErrors(formatted)
        }
        setError(err.message)
      } else {
        setError('Erro ao criar ficha. Tente novamente.')
      }
      setIsSubmitting(false)
    }
  }

  if (loadingMeta) {
    return <div className="py-20 text-center text-sm text-foreground/40">Carregando...</div>
  }

  const goBack = presetStudentId
    ? () => navigate(`/trainer/students/${presetStudentId}`)
    : () => navigate('/trainer/training-sheets')

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/55 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Voltar
      </button>

      <form onSubmit={(e) => void handleSubmit(e)} className="surface-soft flex flex-col gap-5 p-6">
        <div>
          <h1 className="text-display text-2xl">Nova ficha</h1>
          <p className="mt-1.5 text-sm text-foreground/55 leading-relaxed">
            Em seguida você monta divisões e exercícios na mesma tela — sem trocar de página.
          </p>
        </div>

        {presetStudent ? (
          <div className="rounded-xl border border-[var(--s-border)] bg-[var(--s2)] px-4 py-3">
            <p className="text-eyebrow">Aluno</p>
            <p className="mt-0.5 font-semibold text-foreground">{presetStudent.name}</p>
          </div>
        ) : (
          <div>
            <FieldLabel required>Aluno</FieldLabel>
            <select
              value={form.student_id}
              onChange={(e) => setField('student_id', e.target.value)}
              className={inputClass}
            >
              <option value="">Selecionar aluno</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {fieldErrors.student_id && (
              <p className="mt-1.5 text-xs text-red-400">{fieldErrors.student_id}</p>
            )}
          </div>
        )}

        <div>
          <FieldLabel required>Nome da ficha</FieldLabel>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Ex: Hipertrofia — Maio/26"
            className={inputClass}
            autoFocus
          />
          {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>}
        </div>

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center justify-between rounded-xl border border-dashed border-[var(--s-border-h)] px-4 py-2.5 text-sm text-foreground/55 transition-colors hover:text-foreground/80"
        >
          Mais opções
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showMore && (
          <div className="flex flex-col gap-3 border-t border-[var(--s-border)] pt-4">
            {existingSheets.length > 0 && (
              <div>
                <FieldLabel>Copiar estrutura de</FieldLabel>
                <select
                  value={copyFromSheetId}
                  onChange={(e) => setCopyFromSheetId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Ficha em branco</option>
                  {existingSheets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-foreground/40">
                  Duplica divisões e exercícios da ficha escolhida.
                </p>
              </div>
            )}
            <div>
              <FieldLabel>Objetivo</FieldLabel>
              <input
                type="text"
                value={form.goal}
                onChange={(e) => setField('goal', e.target.value)}
                className={inputClass}
                placeholder="Hipertrofia, força..."
              />
            </div>
            <div>
              <FieldLabel>Tipo de divisão</FieldLabel>
              <input
                type="text"
                value={form.division_type}
                onChange={(e) => setField('division_type', e.target.value)}
                className={inputClass}
                placeholder="ABC, PPL..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Início</FieldLabel>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setField('start_date', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Término</FieldLabel>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setField('end_date', e.target.value)}
                  className={inputClass}
                  min={form.start_date}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Observações</FieldLabel>
              <textarea
                value={form.general_notes}
                onChange={(e) => setField('general_notes', e.target.value)}
                rows={2}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold"
        >
          {isSubmitting ? 'Criando...' : (
            <>
              Criar e montar ficha
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
