const apiOrigin = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '')

/**
 * Converte caminhos relativos do storage (/storage/...) em URL acessível pelo cliente.
 * URLs absolutas legadas (ex.: localhost) são reescritas para o path relativo.
 */
export function resolveMediaUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null
  }

  const trimmed = value.trim()

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed)
      const storageIndex = parsed.pathname.indexOf('/storage/')
      if (storageIndex !== -1) {
        return `${apiOrigin}${parsed.pathname.slice(storageIndex)}`
      }
    } catch {
      return trimmed
    }

    return trimmed
  }

  if (trimmed.startsWith('/storage/')) {
    return `${apiOrigin}${trimmed}`
  }

  if (trimmed.startsWith('storage/')) {
    return `${apiOrigin}/${trimmed}`
  }

  return `${apiOrigin}/storage/${trimmed.replace(/^\/+/, '')}`
}
