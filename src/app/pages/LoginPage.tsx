import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '@/api/client'
import { useAuth } from '@/contexts/AuthContext'
import { getShellHomePath } from '@/routes/index'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login({ email, password })
      void navigate(getShellHomePath(user.role), { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        const emailError = err.payload?.errors?.email?.[0]
        setError(emailError ?? err.message)
      } else {
        setError('Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dark shell-bg flex min-h-svh items-center justify-center p-4">
      <div className="surface-soft w-full max-w-[380px] p-8">
        <div className="mb-8 text-center">
          <div className="student-brand mb-1.5">mb</div>
          <p className="text-caption m-0">Hub de Educação Física ci/cd</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          {error && (
            <div
              className="mb-4 rounded-[10px] border border-[color-mix(in_oklab,var(--color-red)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-red)_12%,transparent)] px-3.5 py-2.5 text-[13px] text-[var(--color-red)]"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-[13px] text-[var(--text-secondary)]" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="box-border w-full rounded-[10px] border border-[var(--s-border-h)] bg-[var(--s2)] px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none font-sans focus:border-[color-mix(in_oklab,var(--accent-lime)_35%,var(--s-border-h))]"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-[13px] text-[var(--text-secondary)]" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="box-border w-full rounded-[10px] border border-[var(--s-border-h)] bg-[var(--s2)] px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none font-sans focus:border-[color-mix(in_oklab,var(--accent-lime)_35%,var(--s-border-h))]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn('btn-accent w-full', isSubmitting && 'opacity-60')}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-caption mt-5 text-center">
          trainer@fitness.com · student@fitness.com · senha: 123456
        </p>
      </div>
    </div>
  )
}
