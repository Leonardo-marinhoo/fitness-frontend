import { ApiError, apiBaseUrl } from '@/api/client'
import type { ApiValidationError, AuthUser, RegistrationInvitation } from '@/types/auth/user'

type InvitationResponse = { data: RegistrationInvitation }
type UserResponse = { data: AuthUser }

export async function fetchInvitation(token: string): Promise<RegistrationInvitation> {
  const response = await fetch(`${apiBaseUrl}/api/invitations/${token}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  const data = (await response.json().catch(() => null)) as InvitationResponse | ApiValidationError | null

  if (!response.ok) {
    const payload = data as ApiValidationError | null
    throw new ApiError(response.status, payload?.message ?? 'Convite inválido.', payload ?? undefined)
  }

  return (data as InvitationResponse).data
}

export async function acceptInvitation(token: string, payload: FormData): Promise<AuthUser> {
  const response = await fetch(`${apiBaseUrl}/api/invitations/${token}/accept`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    body: payload,
  })

  const data = (await response.json().catch(() => null)) as UserResponse | ApiValidationError | null

  if (!response.ok) {
    const errorPayload = data as ApiValidationError | null
    throw new ApiError(response.status, errorPayload?.message ?? 'Erro ao finalizar cadastro.', errorPayload ?? undefined)
  }

  return (data as UserResponse).data
}
