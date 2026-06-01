import { type FormEvent, useState } from 'react'

import { createTenantUser } from '@/api/super-admin'
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
import type { AuthUser } from '@/types/auth/user'

type CreateTenantUserSheetProps = {
  tenantId: number
  tenantName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (user: AuthUser) => void
}

export function CreateTenantUserSheet({
  tenantId,
  tenantName,
  open,
  onOpenChange,
  onCreated,
}: CreateTenantUserSheetProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setName('')
    setEmail('')
    setPassword('')
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
      const user = await createTenantUser(tenantId, { name, email, password })
      onCreated(user)
      handleOpenChange(false)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível criar o usuário.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar usuário</SheetTitle>
          <SheetDescription>
            {`Novo usuário com perfil tenant em ${tenantName}.`}
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-tenant-user-form"
          className="flex flex-1 flex-col gap-4 px-4"
          onSubmit={handleSubmit}
        >
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="create-user-name">Nome completo</Label>
            <Input
              id="create-user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-user-email">E-mail</Label>
            <Input
              id="create-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-user-password">Senha inicial</Label>
            <Input
              id="create-user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
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
          <Button type="submit" form="create-tenant-user-form" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Adicionar usuário'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
