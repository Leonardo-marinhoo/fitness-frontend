import type { ApiValidationError } from '@/types/auth/user'

export const apiBaseUrl = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL ?? '')

export class ApiError extends Error {
  status: number
  payload?: ApiValidationError

  constructor(status: number, message: string, payload?: ApiValidationError) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = (await response.json().catch(() => null)) as
    | T
    | ApiValidationError
    | null

  if (!response.ok) {
    const payload = data as ApiValidationError | null
    throw new ApiError(
      response.status,
      payload?.message ?? 'Erro na requisição.',
      payload ?? undefined,
    )
  }

  return data as T
}
