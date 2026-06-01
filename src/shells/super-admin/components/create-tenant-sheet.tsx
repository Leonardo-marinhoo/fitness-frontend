import { type FormEvent, useState } from 'react'

import { createTenant } from '@/api/super-admin'
import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Tenant } from '@/types/tenant/tenant'

type CreateTenantSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (tenant: Tenant) => void
}

export function CreateTenantSheet({
  open,
  onOpenChange,
  onCreated,
}: CreateTenantSheetProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setName('')
    setSlug('')
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    onOpenChange(next)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const tenant = await createTenant({
        name,
        slug: slug.trim() || undefined,
      })
      onCreated(tenant)
      handleOpenChange(false)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível criar o tenant.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Novo tenant</SheetTitle>
          <SheetDescription>
            Cadastre um cliente da plataforma. O slug é usado em URLs e identificadores internos.
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-tenant-form"
          className="flex flex-1 flex-col gap-4 px-4"
          onSubmit={handleSubmit}
        >
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="create-tenant-name">Nome da organização</Label>
            <Input
              id="create-tenant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Acme Corp"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-tenant-slug">
              Slug <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="create-tenant-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-corp"
            />
            <p className="text-muted-foreground text-xs">
              Se vazio, será gerado automaticamente a partir do nome.
            </p>
          </div>
        </form>
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="create-tenant-form" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Criar tenant'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
