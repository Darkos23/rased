'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import ThumbnailUpload from '@/components/ui/ThumbnailUpload'

interface LessonDraft {
  title: string
  content: string
  video_url: string
  duration_min: number | ''
}

const emptyLesson = (): LessonDraft => ({ title: '', content: '', video_url: '', duration_min: '' })

export default function NewCoursePage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [form, setForm] = useState({ title: '', description: '', level: 'beginner', status: 'published', thumbnail: '' })
  const [lessons, setLessons] = useState<LessonDraft[]>([emptyLesson()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'teacher' && user.role !== 'admin'))) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const updateLesson = (i: number, k: keyof LessonDraft, v: string | number) =>
    setLessons(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError(t.courses.title_required); return }
    setError('')
    setSaving(true)
    try {
      const courseRes = await api.post('/courses', form)
      const courseId = courseRes.data.id
      const validLessons = lessons.filter(l => l.title.trim())
      await Promise.all(
        validLessons.map((l, i) =>
          api.post('/lessons', {
            course_id:    courseId,
            title:        l.title,
            content:      l.content || null,
            video_url:    l.video_url || null,
            duration_min: Number(l.duration_min) || 0,
            order:        i + 1,
          })
        )
      )
      router.push(`/courses/${courseRes.data.slug}`)
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
            <Link href="/courses" className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-muted hover:border-brand-400 hover:text-brand-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.courses.new_title}</h1>
              <p className="text-ui-muted text-sm">{t.courses.new_sub}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-3 mb-8">
            {[{ n: 1, label: t.courses.step_info }, { n: 2, label: t.courses.step_lessons }].map(s => (
              <button key={s.n} type="button" onClick={() => setStep(s.n as 1 | 2)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  step === s.n ? 'bg-brand-600 text-white shadow-sm' : 'bg-ui-panel border border-ui-border text-ui-muted hover:border-brand-300'
                }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === s.n ? 'bg-white/20' : 'bg-ui-border'}`}>
                  {s.n}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_title} *</label>
                  <input type="text" required value={form.title} onChange={setField('title')}
                    placeholder={'Ex : ' + t.courses.field_title}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-outfit text-lg" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_desc}</label>
                  <textarea value={form.description} onChange={setField('description')} rows={4}
                    placeholder={t.courses.desc_placeholder}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_level}</label>
                  <select value={form.level} onChange={setField('level')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg">
                    <option value="beginner">{t.courses.beginner}</option>
                    <option value="intermediate">{t.courses.intermediate}</option>
                    <option value="advanced">{t.courses.advanced}</option>
                  </select>
                </div>

                <ThumbnailUpload
                  value={form.thumbnail}
                  onChange={url => setForm(f => ({ ...f, thumbnail: url }))}
                  label={t.courses.field_thumbnail}
                />

                <div className="flex justify-end">
                  <button type="button"
                    onClick={() => { if (!form.title.trim()) { setError(t.courses.title_required_step); return }; setError(''); setStep(2) }}
                    className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm">
                    {t.courses.next_lessons}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                {lessons.map((lesson, i) => (
                  <div key={i} className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">{i + 1}</span>
                        <p className="font-semibold text-ui-text text-sm">{t.courses.lesson_label} {i + 1}</p>
                      </div>
                      {lessons.length > 1 && (
                        <button type="button" onClick={() => setLessons(ls => ls.filter((_, idx) => idx !== i))}
                          className="text-ui-muted hover:text-red-500 transition text-xs font-medium">
                          {t.courses.remove_lesson}
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.articles.field_title} *</label>
                        <input type="text" value={lesson.title} onChange={e => updateLesson(i, 'title', e.target.value)}
                          placeholder={t.courses.lesson_label + ' ' + (i + 1)}
                          className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_video}</label>
                          <input type="url" value={lesson.video_url} onChange={e => updateLesson(i, 'video_url', e.target.value)}
                            placeholder={t.courses.video_placeholder}
                            className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_duration}</label>
                          <input type="number" min={0} value={lesson.duration_min}
                            onChange={e => updateLesson(i, 'duration_min', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="45"
                            className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_html}</label>
                        <textarea value={lesson.content} onChange={e => updateLesson(i, 'content', e.target.value)} rows={3}
                          placeholder="<p>…</p>"
                          className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-mono resize-none" />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => setLessons(ls => [...ls, emptyLesson()])}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-ui-border text-ui-muted text-sm font-semibold hover:border-brand-300 hover:text-brand-500 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {t.courses.add_lesson}
                </button>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition">
                    ← {t.common.back}
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                    {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {saving ? t.courses.creating : t.courses.create}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
