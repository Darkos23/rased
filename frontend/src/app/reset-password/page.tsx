'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

function ResetPasswordForm() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token') ?? ''
  const emailParam = searchParams.get('email') ?? ''

  const [form, setForm] = useState({
    email:                 emailParam,
    password:              '',
    password_confirmation: '',
  })
  const [resetting, setResetting] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!token) setError(t.auth.reset_error)
  }, [token, t.auth.reset_error])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      setError(t.auth.pw_mismatch)
      return
    }
    setError('')
    setResetting(true)
    try {
      await api.post('/auth/reset-password', { ...form, token })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError(t.auth.reset_error)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ui-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center">
              <img src="/rased-logo.png" alt="RASED" className="w-11 h-11 object-contain" />
            </div>
            <span className="font-outfit font-bold text-2xl text-ui-text tracking-tight">RASED</span>
          </Link>
        </div>

        <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8">

          {success ? (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text mb-2">{t.profile.pw_changed}</h1>
              <p className="text-ui-muted text-sm leading-relaxed mb-2">{t.auth.reset_success}</p>
              <p className="text-xs text-ui-muted">{t.common.loading}</p>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.auth.reset_title}</h1>
                <p className="text-ui-muted text-sm mt-1">{t.auth.reset_sub}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">
                  {error}
                  {error === t.auth.reset_error && (
                    <span> <Link href="/forgot-password" className="underline hover:text-red-900">{t.auth.forgot_btn.toLowerCase()}</Link>.</span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.auth.new_password}</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={set('password')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.auth.confirm_password}</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password_confirmation}
                    onChange={set('password_confirmation')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetting || !token}
                  className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {resetting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {resetting ? t.auth.resetting : t.auth.reset_btn}
                </button>
              </form>

              <p className="text-center mt-5 text-sm text-ui-muted">
                <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition">
                  {t.auth.forgot_back}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
