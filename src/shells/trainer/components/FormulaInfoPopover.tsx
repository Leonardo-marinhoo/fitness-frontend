import { useState } from 'react'
import { Info, X } from 'lucide-react'
import type { CalculationMetadata } from '@/types/fitness'

const FORMULA_NAMES: Record<string, string> = {
  mifflin_st_jeor: 'Mifflin-St Jeor',
  katch_mcardle: 'Katch-McArdle',
  jackson_pollock_7: 'Jackson & Pollock 7 dobras',
  'weight_kg / (height_m)²': 'IMC padrão OMS',
  'waist_cm / hip_cm': 'Razão cintura/quadril',
  'weight × fat% / (100 - fat%)': 'Composição corporal',
}

interface Props {
  metadata: CalculationMetadata
}

export function FormulaInfoPopover({ metadata }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 4 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'rgba(223,255,106,0.7)',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Ver fórmula usada"
      >
        <Info size={13} />
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              marginBottom: 8,
              width: 260,
              background: 'var(--s1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 14,
              padding: '14px 16px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(223,255,106,0.9)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Fórmula usada
              </p>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(247,247,244,0.4)', padding: 0 }}>
                <X size={13} />
              </button>
            </div>

            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#f7f7f4', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {FORMULA_NAMES[metadata.formula] ?? metadata.formula}
            </p>

            {typeof metadata.inputs === 'object' && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(247,247,244,0.4)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Dados usados
                </p>
                {Object.entries(metadata.inputs).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(247,247,244,0.7)', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingBottom: 2 }}>
                    <span>{k}</span>
                    <span style={{ color: '#f7f7f4', fontWeight: 500 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
              <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(247,247,244,0.4)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Resultado
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--accent-lime)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {typeof metadata.result === 'object' ? JSON.stringify(metadata.result) : String(metadata.result)}
              </p>
            </div>
          </div>
        </>
      )}
    </span>
  )
}
