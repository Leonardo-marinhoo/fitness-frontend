import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export function TenantDashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo, {user.name}</CardTitle>
        <CardDescription>
          Você está autenticado na área do tenant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">E-mail:</span> {user.email}
        </p>
        <p>
          <span className="text-muted-foreground">Papel:</span> {user.role}
        </p>
      </CardContent>
    </Card>
  )
}
