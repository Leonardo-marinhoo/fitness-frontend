import { useEffect, useState } from 'react'

import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TrainingDay } from '@/types/fitness'

import { DAY_OF_WEEK_OPTIONS, inputClass, labelClass } from './constants'

export type DivisionFormPayload = {
  name: string
  day_of_week?: string | null
  description?: string | null
}

type AddDivisionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: TrainingDay | null
  onSubmit: (payload: DivisionFormPayload) => Promise<void>
}

export function AddDivisionDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: AddDivisionDialogProps) {
  const [name, setName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = editing !== null

  useEffect(() => {
    if (!open) return
    if (editing) {
      setName(editing.name)
      setDayOfWeek(editing.day_of_week ?? '')
      setDescription(editing.description ?? '')
    } else {
      setName('')
      setDayOfWeek('')
      setDescription('')
    }
    setError(null)
  }, [open, editing])

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setError(null)
    }
    onOpenChange(nextOpen)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Informe o nome da divisão.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload: DivisionFormPayload = {
        name: name.trim(),
        day_of_week: dayOfWeek || null,
        description: description.trim() || null,
      }
      await onSubmit(payload)
      handleClose(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar divisão.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-[var(--s-border)] bg-[var(--s2)]">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <p className="text-eyebrow mb-1">Divisões</p>
            <DialogTitle className="text-heading">
              {isEditing ? 'Editar divisão' : 'Nova divisão'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Altere o nome, o dia da semana ou a descrição desta divisão.'
                : 'Ex: Treino A, Peito e tríceps, Upper body…'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 px-5 py-4">
            <div>
              <label className={labelClass}>Nome *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Treino A"
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Dia da semana</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className={inputClass}
              >
                {DAY_OF_WEEK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} min-h-[72px] resize-none`}
                placeholder="Ex: Foco em peito e tríceps, progressão de carga…"
                rows={3}
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
