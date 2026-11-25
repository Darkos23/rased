'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'

export default function LoginPage() {
  const { login, logout } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loggedInUser = await login(form.email, form.password)
      if (loggedInUser.role !== 'admin') {
        await logout()
        setError(t.auth.login_admin_only)
        return
      }
      router.push('/dashboard')
    } catch {
      setError(t.auth.login_error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center min-h-screen bg-ui-bg px-4 pt-[calc(var(--nav-height)+16px)] pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 items-center justify-center mb-4">
              <img src="/rased-logo.png" alt="RASED" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="font-outfit text-3xl font-extrabold text-ui-text mb-1">{t.auth.login_title}</h1>
            <p className="text-ui-muted text-sm">{t.auth.login_sub}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">
              {error}
            </div>
          )}

          <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-ui-text mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="vous@rased-africa.org"
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-ui-bg"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-ui-text">{t.auth.password}</label>
                  <Link href="/forgot-password" className="text-xs text-brand-500 hover:text-brand-700 font-medium transition">
                    {t.auth.forgot_password}
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-ui-bg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-full hover:bg-brand-700 transition-all shadow-soft disabled:opacity-60 mt-1"
              >
                {loading ? t.auth.logging_in : t.auth.login_btn}
              </button>
            </form>
          </div>

          <p className="text-sm text-center text-ui-muted mt-6">
            {t.auth.no_account}{' '}
            <Link href="/register" className="text-brand-600 hover:underline font-bold">
              {t.auth.register_free}
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
