'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

export default function NewMeetingPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [form, setForm] = useState({ title: '', description: '', scheduled_at: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'teacher' && user.role !== 'admin'))) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    setForm(f => ({ ...f, scheduled_at: tomorrow.toISOString().slice(0, 16) }))
  }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.scheduled_at) { setError(t.meetings.error_required); return }
    setError('')
    setSaving(true)
    try {
      await api.post('/meetings', form)
      router.push('/meetings')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message ?? t.common.error_generic)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-2xl mx-auto px-4">

          <div className="flex items-center gap-4 mb-8">
            <Link href="/meetings" className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-muted hover:border-brand-400 hover:text-brand-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.meetings.new_title}</h1>
              <p className="text-ui-muted text-sm">{t.meetings.new_sub}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8 space-y-6">

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.meetings.field_title} *</label>
                <input type="text" required value={form.title} onChange={set('title')}
                  placeholder={t.meetings.field_title_placeholder}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-outfit text-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.meetings.field_desc}</label>
                <textarea value={form.description} onChange={set('description')} rows={4}
                  placeholder={t.meetings.field_desc_placeholder}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.meetings.field_date} *</label>
                <input type="datetime-local" required value={form.scheduled_at} onChange={set('scheduled_at')}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg" />
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
                <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-brand-700" dangerouslySetInnerHTML={{ __html: t.meetings.jitsi_info }} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6">
              <Link href="/meetings"
                className="px-6 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition">
                {t.common.cancel}
              </Link>
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? t.meetings.scheduling : t.meetings.schedule}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
