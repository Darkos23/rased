'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import RichTextEditor from '@/components/ui/RichTextEditor'
import ThumbnailUpload from '@/components/ui/ThumbnailUpload'

const categories = ['Pédagogie', 'Didactique', 'Numérique', 'Recherche', 'Formation', 'Évaluation', 'Politique éducative', 'Autre']

export default function NewArticlePage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [form, setForm] = useState({ title: '', body: '', category: '', lang: 'fr', status: 'published', thumbnail: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'teacher' && user.role !== 'admin'))) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) { setError(t.articles.error_required); return }
    setError('')
    setSaving(true)
    try {
      const res = await api.post('/articles', { ...form, status: asDraft ? 'draft' : 'published' })
      router.push(`/articles/${res.data.slug}`)
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/articles" className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-muted hover:border-brand-400 hover:text-brand-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.articles.new_title}</h1>
              <p className="text-ui-muted text-sm">{t.articles.new_sub}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8 space-y-6">

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_title} *</label>
                <input type="text" required value={form.title} onChange={set('title')}
                  placeholder={t.articles.field_title + '…'}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-outfit text-lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_category}</label>
                  <select value={form.category} onChange={set('category')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg">
                    <option value="">{t.articles.no_category}</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_lang}</label>
                  <select value={form.lang} onChange={set('lang')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <ThumbnailUpload
                value={form.thumbnail}
                onChange={url => setForm(f => ({ ...f, thumbnail: url }))}
                label={t.articles.field_thumbnail}
              />

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_content} *</label>
                <RichTextEditor
                  value={form.body}
                  onChange={html => setForm(f => ({ ...f, body: html }))}
                  placeholder={t.articles.body_placeholder}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={e => handleSubmit(e as unknown as React.FormEvent, true)} disabled={saving}
                className="px-6 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-50">
                {t.articles.save_draft}
              </button>
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? t.articles.publishing : t.articles.publish}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
