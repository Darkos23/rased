'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')

  // Already verified → go to dashboard
  if (user?.email_verified_at) {
    router.replace('/dashboard')
    return null
  }

  const handleResend = async () => {
    setError('')
    setResending(true)
    try {
      await api.post('/auth/email/resend')
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch {
      setError(t.common.error_generic)
    } finally {
      setResending(false)
    }
  }

  return (
    <main className="min-h-screen bg-ui-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-10 text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <div>
            <h1 className="font-outfit text-2xl font-bold text-ui-text mb-2">{t.auth.verify_title}</h1>
            <p className="text-ui-muted text-sm">
              {t.auth.verify_sub}{' '}
              {user?.email && (
                <span className="font-semibold text-ui-text">{user.email}</span>
              )}.
            </p>
            <p className="text-ui-muted text-sm mt-1">{t.auth.verify_check_spam}</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {resent && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t.auth.verify_resent}
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full py-3 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {resending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {resending ? t.auth.verify_resending : t.auth.verify_resend}
          </button>

          <Link href="/dashboard" className="block text-sm text-ui-muted hover:text-brand-600 transition">
            {t.auth.verify_go_dashboard} →
          </Link>
        </div>
      </div>
    </main>
  )
}
