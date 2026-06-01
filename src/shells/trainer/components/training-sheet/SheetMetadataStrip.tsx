import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import { inputClass, labelClass } from './constants'
import type { TrainingSheet } from '@/types/fitness'

type MetadataFields = {
  goal: string
  division_type: string
  start_date: string
  end_date: string
  general_notes: string
}

type SheetMetadataStripProps = {
  sheet: TrainingSheet
  onSave: (fields: Partial<MetadataFields>) => void
  variant?: 'card' | 'footer'
}

export function SheetMetadataStrip({ sheet, onSave, variant = 'footer' }: SheetMetadataStripProps) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState<MetadataFields>({
    goal: sheet.goal ?? '',
    division_type: sheet.division_type ?? '',
    start_date: sheet.start_date ?? '',
    end_date: sheet.end_date ?? '',
    general_notes: sheet.general_notes ?? '',
  })
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setFields({
      goal: sheet.goal ?? '',
      division_type: sheet.division_type ?? '',
      start_date: sheet.start_date ?? '',
      end_date: sheet.end_date ?? '',
      general_notes: sheet.general_notes ?? '',
    })
  }, [sheet])

  function scheduleSave(next: MetadataFields) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const payload: Partial<MetadataFields> = {}
      if (next.goal !== (sheet.goal ?? '')) payload.goal = next.goal || undefined
      if (next.division_type !== (sheet.division_type ?? ''))
        payload.division_type = next.division_type || undefined
      if (next.start_date !== sheet.start_date) payload.start_date = next.start_date
      if (next.end_date !== (sheet.end_date ?? '')) payload.end_date = next.end_date || undefined
      if (next.general_notes !== (sheet.general_notes ?? ''))
        payload.general_notes = next.general_notes || undefined
      if (Object.keys(payload).length > 0) onSave(payload)
    }, 600)
  }

  function update<K extends keyof MetadataFields>(key: K, value: MetadataFields[K]) {
    setFields((prev) => {
      const next = { ...prev, [key]: value }
      scheduleSave(next)
      return next
    })
  }

  return (
    <div
      className={cn(
        'overflow-hidden',
        variant === 'footer' ? 'sheet-builder-footer' : 's1 rounded-lg',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--s2)] lg:px-6"
      >
        <span className="text-eyebrow shrink-0">Metadados da ficha</span>
        {!open && (
          <span className="min-w-0 truncate text-xs text-foreground/40">
            {[sheet.goal, sheet.division_type].filter(Boolean).join(' · ') || 'Objetivo, datas, notas'}
          </span>
        )}
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-foreground/40" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-foreground/40" />
        )}
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--s-border)] p-4 sm:grid-cols-2 lg:px-5 lg:pb-5">
          <div>
            <label className={labelClass}>Objetivo</label>
            <input
              value={fields.goal}
              onChange={(e) => update('goal', e.target.value)}
              className={inputClass}
              placeholder="Hipertrofia..."
            />
          </div>
          <div>
            <label className={labelClass}>Tipo de divisão</label>
            <input
              value={fields.division_type}
              onChange={(e) => update('division_type', e.target.value)}
              className={inputClass}
              placeholder="ABC, PPL..."
            />
          </div>
          <div>
            <label className={labelClass}>Início</label>
            <input
              type="date"
              value={fields.start_date}
              onChange={(e) => update('start_date', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Término</label>
            <input
              type="date"
              value={fields.end_date}
              onChange={(e) => update('end_date', e.target.value)}
              className={inputClass}
              min={fields.start_date}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Observações</label>
            <textarea
              value={fields.general_notes}
              onChange={(e) => update('general_notes', e.target.value)}
              rows={2}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
