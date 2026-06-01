import { apiRequest } from '@/api/client'
import type { AuthUser, LoginPayload } from '@/types/auth/user'

type AuthUserResponse = {
  data: AuthUser
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await apiRequest<AuthUserResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function logout(): Promise<void> {
  await apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  })
}

export async function fetchMe(): Promise<AuthUser> {
  const response = await apiRequest<AuthUserResponse>('/api/auth/me')
  return response.data
}
