'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Article } from '@/types'
import RichTextEditor from '@/components/ui/RichTextEditor'
import ThumbnailUpload from '@/components/ui/ThumbnailUpload'

const categories = ['Pédagogie', 'Didactique', 'Numérique', 'Recherche', 'Formation', 'Évaluation', 'Politique éducative', 'Autre']

export default function EditArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const [form, setForm] = useState({
    title: '', body: '', category: '', lang: 'fr', status: 'published', thumbnail: '',
  })

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    api.get(`/articles/${slug}`).then(res => {
      const a: Article = res.data
      setArticle(a)
      setForm({
        title: a.title,
        body: a.body,
        category: a.category ?? '',
        lang: a.lang,
        status: a.status,
        thumbnail: a.thumbnail ?? '',
      })
    }).catch(() => router.replace('/articles'))
      .finally(() => setLoading(false))
  }, [slug, router])

  if (authLoading || loading || !article) return null

  if (user && user.role !== 'admin' && user.id !== article.author.id) {
    router.replace(`/articles/${slug}`)
    return null
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) { setError(t.articles.error_required); return }
    setError('')
    setSaving(true)
    try {
      await api.put(`/articles/${article.id}`, { ...form, status: asDraft ? 'draft' : form.status })
      router.push(`/articles/${slug}`)
    } catch {
      setError(t.common.error_save)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/articles/${slug}`} className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-muted hover:border-brand-400 hover:text-brand-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.articles.edit_title}</h1>
              <p className="text-ui-muted text-sm truncate max-w-md">{article.title}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8 space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_title} *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={set('title')}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-outfit text-lg"
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_category}</label>
                  <select value={form.category} onChange={set('category')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="">{t.articles.no_category}</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_lang}</label>
                  <select value={form.lang} onChange={set('lang')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.common.status}</label>
                  <select value={form.status} onChange={set('status')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="published">{t.dashboard.published}</option>
                    <option value="draft">{t.dashboard.draft}</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail */}
              <ThumbnailUpload
                value={form.thumbnail}
                onChange={url => setForm(f => ({ ...f, thumbnail: url }))}
                label={t.articles.field_thumbnail}
              />

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.articles.field_content} *</label>
                <RichTextEditor
                  value={form.body}
                  onChange={html => setForm(f => ({ ...f, body: html }))}
                  placeholder={t.articles.body_placeholder}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <Link href={`/articles/${slug}`}
                className="px-6 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition">
                {t.common.cancel}
              </Link>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={e => handleSubmit(e as unknown as React.FormEvent, true)}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-50"
                >
                  {t.articles.save_draft}
                </button>
                <button type="submit" disabled={saving}
                  className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {saving ? t.common.saving : t.common.save_changes}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
