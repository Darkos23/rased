'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'

type Status = 'loading' | 'success' | 'already' | 'error' | 'expired'

function VerifyContent() {
  const { id, hash } = useParams<{ id: string; hash: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLang()
  const { setUser, user } = useAuth()

  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const expires = searchParams.get('expires')
    api.get(`/auth/email/verify/${id}/${hash}${expires ? `?expires=${expires}` : ''}`)
      .then(res => {
        if (res.data.already) {
          setStatus('already')
        } else {
          setStatus('success')
          // Refresh user to get updated email_verified_at
          if (user) setUser({ ...user, email_verified_at: new Date().toISOString() })
        }
        setTimeout(() => router.push('/dashboard'), 3000)
      })
      .catch(err => {
        const code = err?.response?.status
        setStatus(code === 410 ? 'expired' : 'error')
      })
  }, [id, hash]) // eslint-disable-line react-hooks/exhaustive-deps

  const isSuccess = status === 'success' || status === 'already'

  return (
    <main className="min-h-screen bg-ui-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-10 text-center space-y-6">

          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
              <p className="text-ui-muted text-sm">{t.common.loading}</p>
            </>
          )}

          {/* Success / Already */}
          {isSuccess && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="font-outfit text-2xl font-bold text-ui-text mb-2">{t.auth.verify_success_title}</h1>
                <p className="text-ui-muted text-sm">{t.auth.verify_success_sub}</p>
              </div>
              <Link href="/dashboard"
                className="inline-block px-8 py-3 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm">
                {t.auth.verify_go_dashboard}
              </Link>
            </>
          )}

          {/* Error / Expired */}
          {(status === 'error' || status === 'expired') && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h1 className="font-outfit text-xl font-bold text-ui-text mb-2">
                  {status === 'expired' ? t.auth.verify_error_expired : t.auth.verify_error_invalid}
                </h1>
              </div>
              <Link href="/verify-email"
                className="inline-block px-8 py-3 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm">
                {t.auth.verify_resend}
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function VerifyEmailConfirmPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
