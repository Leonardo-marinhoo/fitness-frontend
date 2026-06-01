import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ChevronRight, Plus, Search } from 'lucide-react'

import { fetchTenants } from '@/api/super-admin'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateTenantSheet } from '@/shells/super-admin/components/create-tenant-sheet'
import { EmptyState } from '@/shells/super-admin/components/empty-state'
import { PageHeader } from '@/shells/super-admin/components/page-header'
import { formatDate } from '@/shells/super-admin/lib/format'
import type { Tenant } from '@/types/tenant/tenant'

export function TenantsPage() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  async function loadTenants() {
    setIsLoading(true)
    setLoadError(null)
    try {
      setTenants(await fetchTenants())
    } catch {
      setLoadError('Não foi possível carregar a lista de tenants.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTenants()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tenants
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
    )
  }, [tenants, search])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tenants"
        description="Organizações clientes da plataforma. Abra um tenant para gerenciar usuários."
        action={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Novo tenant
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          {loadError ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-destructive text-sm">{loadError}</p>
              <Button type="button" variant="outline" onClick={() => void loadTenants()}>
                Tentar novamente
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b px-6 py-4 last:border-0"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-6 w-16" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Building2 className="size-5" />}
              title={search ? 'Nenhum resultado' : 'Nenhum tenant cadastrado'}
              description={
                search
                  ? 'Tente outro termo de busca ou limpe o filtro.'
                  : 'Crie o primeiro tenant para começar a convidar usuários.'
              }
              actionLabel={search ? undefined : 'Criar tenant'}
              onAction={search ? undefined : () => setCreateOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organização</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Usuários</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tenant) => (
                  <TableRow
                    key={tenant.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                  >
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {tenant.slug}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {tenant.users_count ?? 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(tenant.created_at)}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/tenants/${tenant.id}`}
                        aria-label={`Abrir ${tenant.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          buttonVariants({
                            variant: 'ghost',
                            size: 'icon-sm',
                          }),
                          'opacity-70 group-hover:opacity-100',
                        )}
                      >
                        <ChevronRight className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateTenantSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(tenant) => {
          setTenants((current) =>
            [...current, tenant].sort((a, b) => a.name.localeCompare(b.name)),
          )
        }}
      />
    </div>
  )
}
