'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

export default function VerificationBanner() {
  const { user, setUser } = useAuth()
  const { t } = useLang()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  // Don't show if not logged in or already verified
  if (!user || user.email_verified_at) return null

  const handleResend = async () => {
    setResending(true)
    try {
      await api.post('/auth/email/resend')
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch {
      // silent fail — link to verify page as fallback
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{t.auth.verify_banner}</span>
        </div>

        <div className="flex items-center gap-3">
          {resent ? (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t.auth.verify_resent}
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? t.auth.verify_resending : t.auth.verify_banner_resend}
            </button>
          )}
          <Link href="/verify-email" className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition">
            {t.auth.verify_title} →
          </Link>
        </div>
      </div>
    </div>
  )
}
