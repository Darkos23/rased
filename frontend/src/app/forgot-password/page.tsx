'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const { t } = useLang()
  const [email, setEmail]   = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError(t.common.error_generic)
    } finally {
      setSending(false)
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

          {sent ? (
            /* Confirmation state */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text mb-2">{t.auth.forgot_sent_title}</h1>
              <p className="text-ui-muted text-sm leading-relaxed mb-6">{t.auth.forgot_sent_sub}</p>
              <Link href="/login" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition">
                {t.auth.forgot_back}
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.auth.forgot_title}</h1>
                <p className="text-ui-muted text-sm mt-1 leading-relaxed">{t.auth.forgot_sub}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {sending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {sending ? t.auth.forgot_sending : t.auth.forgot_btn}
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
