import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { createAssessment } from '@/api/trainer'
import { ArrowLeft, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

// ─── Shared input style ────────────────────────────────────────────────────────

const inp =
  'w-full bg-white/6 border border-white/14 rounded-xl px-3 py-3 text-white/90 text-sm placeholder-white/25 outline-none focus:border-lime-400/40 transition-colors'

const lbl = 'block text-[10px] font-semibold tracking-[2px] uppercase text-white/40 mb-1.5 font-poppins'

// ─── Tooltip for auto fields ───────────────────────────────────────────────────

function AutoBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] ml-1">
      <Info size={10} />
      calculado
    </span>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-soft mb-4 p-5">
      <p className="text-eyebrow mb-4">{title}</p>
      {children}
    </div>
  )
}

// ─── Form state type ──────────────────────────────────────────────────────────

type Mode = 'manual' | 'automatic'

// ─── Component ────────────────────────────────────────────────────────────────

export function CreatePhysicalAssessmentPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    assessment_date: new Date().toISOString().slice(0, 10),
    manual_method_name: '',
    weight_kg: '',
    height_cm: '',
    bmr_kcal: '',
    bmi: '',
    body_fat_percentage: '',
    lean_mass_percentage: '',
    fat_mass_kg: '',
    lean_mass_kg: '',
    notes: '',
    // circumferences
    waist_cm: '',
    abdomen_cm: '',
    hip_cm: '',
    right_arm_relaxed_cm: '',
    right_arm_flexed_cm: '',
    right_calf_cm: '',
    right_thigh_cm: '',
    // skinfolds
    abdominal_mm: '',
    triceps_mm: '',
    suprailiac_mm: '',
    midaxillary_mm: '',
    subscapular_mm: '',
    chest_mm: '',
    thigh_mm: '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function numOrNull(v: string): number | null {
    const n = parseFloat(v)
    return isNaN(n) ? null : n
  }

  async function handleSubmit() {
    if (!mode || !studentId) return
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {
        input_mode: mode,
        title: form.title || undefined,
        description: form.description || undefined,
        assessment_date: form.assessment_date,
        notes: form.notes || undefined,
        weight_kg: numOrNull(form.weight_kg),
        height_cm: numOrNull(form.height_cm),
      }

      if (mode === 'manual') {
        payload.manual_method_name = form.manual_method_name || undefined
        payload.bmr_kcal = numOrNull(form.bmr_kcal)
        payload.bmi = numOrNull(form.bmi)
        payload.body_fat_percentage = numOrNull(form.body_fat_percentage)
        payload.lean_mass_percentage = numOrNull(form.lean_mass_percentage)
        payload.fat_mass_kg = numOrNull(form.fat_mass_kg)
        payload.lean_mass_kg = numOrNull(form.lean_mass_kg)
      }

      const circumferences = {
        waist_cm: numOrNull(form.waist_cm),
        abdomen_cm: numOrNull(form.abdomen_cm),
        hip_cm: numOrNull(form.hip_cm),
        right_arm_relaxed_cm: numOrNull(form.right_arm_relaxed_cm),
        right_arm_flexed_cm: numOrNull(form.right_arm_flexed_cm),
        right_calf_cm: numOrNull(form.right_calf_cm),
        right_thigh_cm: numOrNull(form.right_thigh_cm),
      }

      if (Object.values(circumferences).some((v) => v !== null)) {
        payload.circumferences = circumferences
      }

      const skinfolds = {
        abdominal_mm: numOrNull(form.abdominal_mm),
        triceps_mm: numOrNull(form.triceps_mm),
        suprailiac_mm: numOrNull(form.suprailiac_mm),
        midaxillary_mm: numOrNull(form.midaxillary_mm),
        subscapular_mm: numOrNull(form.subscapular_mm),
        chest_mm: numOrNull(form.chest_mm),
        thigh_mm: numOrNull(form.thigh_mm),
      }

      if (Object.values(skinfolds).some((v) => v !== null)) {
        payload.skinfolds = skinfolds
      }

      await createAssessment(Number(studentId), payload)
      navigate(`/trainer/students/${studentId}/assessments`)
    } catch {
      setError('Não foi possível salvar a avaliação. Verifique os dados e tente novamente.')
      setIsSubmitting(false)
    }
  }

  // ── Mode selection ────────────────────────────────────────────────────────

  if (!mode) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </button>
          <div>
            <p className="text-[10px] font-semibold tracking-[4px] uppercase text-eyebrow mb-1">Nova Avaliação</p>
            <h1 className="text-xl font-bold text-white font-nunito">Como você quer registrar?</h1>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setMode('manual')}
            className="surface-soft rounded-[22px] p-6 text-left hover:bg-white/10 transition-all"
          >
            <p className="text-[10px] font-semibold tracking-[4px] uppercase mb-2" style={{ color: 'rgba(112,215,255,0.9)' }}>
              Manual
            </p>
            <h2 className="text-lg font-bold text-white font-nunito mb-2">Inserir dados manualmente</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Dados de bioimpedância, InBody ou qualquer método externo. Você informa os resultados diretamente.
            </p>
          </button>

          <button
            onClick={() => setMode('automatic')}
            className="surface-soft rounded-[22px] p-6 text-left hover:bg-white/10 transition-all"
          >
            <p className="text-[10px] font-semibold tracking-[4px] uppercase mb-2" style={{ color: 'rgba(168,140,255,0.9)' }}>
              Automático
            </p>
            <h2 className="text-lg font-bold text-white font-nunito mb-2">Calcular a partir das medidas</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Informe peso, altura, circunferências e/ou dobras cutâneas. O sistema calcula IMC, TMB, composição corporal e mais.
            </p>
          </button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  const isAutomatic = mode === 'automatic'

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setMode(null)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <div>
          <p className="text-[10px] font-semibold tracking-[4px] uppercase text-eyebrow mb-1">
            {isAutomatic ? 'Automático' : 'Manual'} — Nova Avaliação
          </p>
          <h1 className="text-xl font-bold text-white font-nunito">Dados da avaliação</h1>
        </div>
      </div>

      {/* Identificação */}
      <Section title="Identificação">
        <div className="flex flex-col gap-3">
          <div>
            <label className={lbl}>Título (opcional)</label>
            <input
              className={inp}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={`Avaliação física - ${new Date().toLocaleDateString('pt-BR')}`}
            />
          </div>
          <div>
            <label className={lbl}>Data</label>
            <input
              className={inp}
              type="date"
              value={form.assessment_date}
              onChange={(e) => set('assessment_date', e.target.value)}
            />
          </div>
          {!isAutomatic && (
            <div>
              <label className={lbl}>Método utilizado</label>
              <input
                className={inp}
                value={form.manual_method_name}
                onChange={(e) => set('manual_method_name', e.target.value)}
                placeholder="Ex: Bioimpedância InBody, Omron, avaliação manual..."
              />
            </div>
          )}
        </div>
      </Section>

      {/* Medidas básicas */}
      <Section title="Composição corporal">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Peso (kg)</label>
            <input className={inp} type="number" step="0.1" value={form.weight_kg} onChange={(e) => set('weight_kg', e.target.value)} placeholder="80.0" />
          </div>
          <div>
            <label className={lbl}>Altura (cm)</label>
            <input className={inp} type="number" value={form.height_cm} onChange={(e) => set('height_cm', e.target.value)} placeholder="175" />
          </div>

          {!isAutomatic && (
            <>
              <div>
                <label className={lbl}>IMC</label>
                <input className={inp} type="number" step="0.01" value={form.bmi} onChange={(e) => set('bmi', e.target.value)} placeholder="24.7" />
              </div>
              <div>
                <label className={lbl}>BF% gordura</label>
                <input className={inp} type="number" step="0.1" value={form.body_fat_percentage} onChange={(e) => set('body_fat_percentage', e.target.value)} placeholder="18.0" />
              </div>
              <div>
                <label className={lbl}>Massa gorda (kg)</label>
                <input className={inp} type="number" step="0.1" value={form.fat_mass_kg} onChange={(e) => set('fat_mass_kg', e.target.value)} placeholder="14.4" />
              </div>
              <div>
                <label className={lbl}>Massa magra (kg)</label>
                <input className={inp} type="number" step="0.1" value={form.lean_mass_kg} onChange={(e) => set('lean_mass_kg', e.target.value)} placeholder="65.6" />
              </div>
              <div>
                <label className={lbl}>TMB (kcal/dia)</label>
                <input className={inp} type="number" value={form.bmr_kcal} onChange={(e) => set('bmr_kcal', e.target.value)} placeholder="1780" />
              </div>
            </>
          )}

          {isAutomatic && (
            <div className="col-span-2 text-xs text-white/40 flex items-center gap-1.5 mt-1">
              <Info size={12} className="text-[var(--text-tertiary)] flex-shrink-0" />
              IMC, TMB e composição serão calculados automaticamente com base nos dados preenchidos.
            </div>
          )}
        </div>
      </Section>

      {/* Circunferências */}
      <Section title="Circunferências (cm)">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['waist_cm', 'Cintura'],
            ['abdomen_cm', 'Abdômen'],
            ['hip_cm', 'Quadril'],
            ['right_arm_relaxed_cm', 'Braço D. relaxado'],
            ['right_arm_flexed_cm', 'Braço D. contraído'],
            ['right_calf_cm', 'Panturrilha D.'],
            ['right_thigh_cm', 'Coxa D.'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className={lbl}>{label}</label>
              <input
                className={inp}
                type="number"
                step="0.1"
                value={form[field as keyof typeof form]}
                onChange={(e) => set(field, e.target.value)}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Dobras cutâneas */}
      <Section title="Dobras cutâneas (mm)">
        {isAutomatic && (
          <p className="text-xs text-white/40 mb-3 flex items-center gap-1.5">
            <Info size={12} className="text-[var(--text-tertiary)] flex-shrink-0" />
            Com as 7 dobras preenchidas, o sistema calcula BF% via Jackson & Pollock.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['chest_mm', 'Tórax'],
            ['midaxillary_mm', 'Axilar média'],
            ['triceps_mm', 'Tríceps'],
            ['subscapular_mm', 'Subescapular'],
            ['abdominal_mm', 'Abdominal'],
            ['suprailiac_mm', 'Suprailíaca'],
            ['thigh_mm', 'Coxa'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className={lbl}>{label}</label>
              <input
                className={inp}
                type="number"
                step="0.1"
                value={form[field as keyof typeof form]}
                onChange={(e) => set(field, e.target.value)}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Observações */}
      <Section title="Observações">
        <textarea
          className={`${inp} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Observações sobre a avaliação..."
        />
      </Section>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Auto badge legend */}
      {isAutomatic && (
        <div className="flex items-center gap-2 mb-4 text-xs text-white/40">
          <AutoBadge />
          <span>= valores calculados automaticamente pelo sistema</span>
        </div>
      )}

      <button
        onClick={() => void handleSubmit()}
        disabled={isSubmitting}
        className={cn('btn-accent w-full py-4 text-base', isSubmitting && 'opacity-50')}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar avaliação'}
      </button>
    </div>
  )
}
