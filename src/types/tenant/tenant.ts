export type Tenant = {
  id: number
  name: string
  slug: string
  users_count?: number
  created_at?: string
}

export type CreateTenantPayload = {
  name: string
  slug?: string
}

export type CreateTenantUserPayload = {
  name: string
  email: string
  password: string
}
