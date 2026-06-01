import { apiRequest } from '@/api/client'
import type { AuthUser } from '@/types/auth/user'
import type { RegistrationInvitation, TrainerProfile } from '@/types/auth/user'
import type {
  CreateTenantPayload,
  CreateTenantUserPayload,
  Tenant,
} from '@/types/tenant/tenant'

type TrainerListResponse = { data: (TrainerProfile & { students_count: number; user: AuthUser })[] }

export async function fetchAdminTrainers(): Promise<(TrainerProfile & { students_count: number; user: AuthUser })[]> {
  const res = await apiRequest<TrainerListResponse>('/api/super-admin/trainers')
  return res.data
}

export async function createTrainerInvitation(payload: {
  invited_name?: string
}): Promise<RegistrationInvitation> {
  const res = await apiRequest<{ data: RegistrationInvitation }>('/api/super-admin/trainer-invitations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

type TenantResponse = { data: Tenant }
type TenantsResponse = { data: Tenant[] }
type UsersResponse = { data: AuthUser[] }

export async function fetchTenants(): Promise<Tenant[]> {
  const response = await apiRequest<TenantsResponse>('/api/super-admin/tenants')
  return response.data
}

export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  const response = await apiRequest<TenantResponse>('/api/super-admin/tenants', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function fetchTenant(tenantId: number): Promise<Tenant> {
  const response = await apiRequest<TenantResponse>(
    `/api/super-admin/tenants/${tenantId}`,
  )
  return response.data
}

export async function fetchTenantUsers(tenantId: number): Promise<AuthUser[]> {
  const response = await apiRequest<UsersResponse>(
    `/api/super-admin/tenants/${tenantId}/users`,
  )
  return response.data
}

export async function createTenantUser(
  tenantId: number,
  payload: CreateTenantUserPayload,
): Promise<AuthUser> {
  const response = await apiRequest<{ data: AuthUser }>(
    `/api/super-admin/tenants/${tenantId}/users`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
  return response.data
}
