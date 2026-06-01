import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Hash, Plus, Users } from 'lucide-react'

import { fetchTenant, fetchTenantUsers } from '@/api/super-admin'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateTenantUserSheet } from '@/shells/super-admin/components/create-tenant-user-sheet'
import { EmptyState } from '@/shells/super-admin/components/empty-state'
import { formatDate } from '@/shells/super-admin/lib/format'
import { getInitials } from '@/lib/string/get-initials'
import type { AuthUser } from '@/types/auth/user'
import type { Tenant } from '@/types/tenant/tenant'

export function TenantDetailPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const id = Number(tenantId)

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [createUserOpen, setCreateUserOpen] = useState(false)

  async function loadData() {
    if (!id) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const [tenantData, usersData] = await Promise.all([
        fetchTenant(id),
        fetchTenantUsers(id),
      ])
      setTenant(tenantData)
      setUsers(usersData)
    } catch {
      setLoadError('Não foi possível carregar este tenant.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [id])

  if (!id) {
    return (
      <p className="text-destructive text-sm">Identificador de tenant inválido.</p>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <p className="text-destructive text-sm">{loadError}</p>
            <Button type="button" variant="outline" onClick={() => void loadData()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : tenant ? (
        <>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-2xl">{tenant.name}</CardTitle>
                    <Badge variant="outline">Tenant</Badge>
                  </div>
                  <CardDescription>
                    Identificador interno e resumo da organização na plataforma.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                  <Hash className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Slug
                    </p>
                    <p className="mt-1 font-mono text-sm">{tenant.slug}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                  <Users className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Usuários
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {users.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                  <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Criado em
                    </p>
                    <p className="mt-1 text-sm">{formatDate(tenant.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden py-0">
            <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  Contas com acesso à área do tenant. Cada usuário pertence apenas a esta
                  organização.
                </CardDescription>
              </div>
              <Button type="button" onClick={() => setCreateUserOpen(true)}>
                <Plus className="size-4" />
                Adicionar usuário
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {users.length === 0 ? (
                <EmptyState
                  icon={<Users className="size-5" />}
                  title="Nenhum usuário ainda"
                  description="Adicione o primeiro usuário para que ele possa acessar a área do tenant."
                  actionLabel="Adicionar usuário"
                  onAction={() => setCreateUserOpen(true)}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Perfil</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Tenant</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <CreateTenantUserSheet
            tenantId={id}
            tenantName={tenant.name}
            open={createUserOpen}
            onOpenChange={setCreateUserOpen}
            onCreated={(user) => {
              setUsers((current) =>
                [...current, user].sort((a, b) => a.name.localeCompare(b.name)),
              )
              setTenant((current) =>
                current
                  ? {
                      ...current,
                      users_count: (current.users_count ?? users.length) + 1,
                    }
                  : current,
              )
            }}
          />
        </>
      ) : null}
    </div>
  )
}
