'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Course, Lesson } from '@/types'
import ThumbnailUpload from '@/components/ui/ThumbnailUpload'

interface LessonDraft extends Partial<Lesson> {
  _new?: boolean
  _deleted?: boolean
}

export default function EditCoursePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [course, setCourse]   = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({ title: '', description: '', level: 'beginner', thumbnail: '', status: 'published' })
  const [lessons, setLessons] = useState<LessonDraft[]>([])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    api.get(`/courses/${slug}`).then(res => {
      const c: Course = res.data
      setCourse(c)
      setForm({ title: c.title, description: c.description ?? '', level: c.level, thumbnail: c.thumbnail ?? '', status: c.status })
      setLessons(c.lessons ?? [])
    }).catch(() => router.replace('/courses'))
      .finally(() => setLoading(false))
  }, [slug, router])

  if (authLoading || loading || !course) return null

  if (user && user.role !== 'admin' && user.id !== course.teacher.id) {
    router.replace(`/courses/${slug}`)
    return null
  }

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const updateLesson = (i: number, k: keyof LessonDraft, v: string | number) =>
    setLessons(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const addLesson = () => setLessons(ls => [...ls, { _new: true, title: '', content: '', video_url: '', duration_min: 0, order: ls.length + 1 }])

  const removeLesson = (i: number) =>
    setLessons(ls => ls.map((l, idx) => idx === i ? { ...l, _deleted: true } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError(t.courses.title_required_step); return }
    setError('')
    setSaving(true)
    try {
      await api.put(`/courses/${course.id}`, form)

      const ops: Promise<unknown>[] = []
      lessons.forEach((l, i) => {
        if (l._deleted && l.id) {
          ops.push(api.delete(`/lessons/${l.id}`))
        } else if (l._new && l.title?.trim()) {
          ops.push(api.post('/lessons', {
            course_id: course.id, title: l.title, content: l.content ?? null,
            video_url: l.video_url ?? null, duration_min: Number(l.duration_min) || 0, order: i + 1,
          }))
        } else if (!l._new && !l._deleted && l.id) {
          ops.push(api.put(`/lessons/${l.id}`, {
            title: l.title, content: l.content ?? null,
            video_url: l.video_url ?? null, duration_min: Number(l.duration_min) || 0, order: i + 1,
          }))
        }
      })
      await Promise.all(ops)

      const updated = await api.get(`/courses/${course.id}`)
      router.push(`/courses/${updated.data.slug}`)
    } catch {
      setError(t.common.error_save)
    } finally {
      setSaving(false)
    }
  }

  const visibleLessons = lessons.filter(l => !l._deleted)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/courses/${slug}`} className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-muted hover:border-brand-400 hover:text-brand-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-ui-text">{t.courses.edit_title}</h1>
              <p className="text-ui-muted text-sm truncate max-w-md">{course.title}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Course info */}
            <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="font-outfit font-bold text-ui-text text-lg border-b border-ui-border pb-4">{t.courses.general_info}</h2>

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_title} *</label>
                <input type="text" required value={form.title} onChange={setField('title')}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg font-outfit text-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_desc}</label>
                <textarea value={form.description} onChange={setField('description')} rows={3}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg resize-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.courses.field_level}</label>
                  <select value={form.level} onChange={setField('level')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="beginner">{t.courses.beginner}</option>
                    <option value="intermediate">{t.courses.intermediate}</option>
                    <option value="advanced">{t.courses.advanced}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.common.status}</label>
                  <select value={form.status} onChange={setField('status')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="published">{t.dashboard.published}</option>
                    <option value="draft">{t.dashboard.draft}</option>
                  </select>
                </div>
              </div>

              <ThumbnailUpload
                value={form.thumbnail}
                onChange={url => setForm(f => ({ ...f, thumbnail: url }))}
                label={t.courses.field_thumbnail}
              />
            </div>

            {/* Lessons */}
            <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between border-b border-ui-border pb-4 mb-6">
                <h2 className="font-outfit font-bold text-ui-text text-lg">{t.courses.step_lessons}</h2>
                <span className="text-xs text-ui-muted">
                  {visibleLessons.length} {visibleLessons.length !== 1 ? t.course_detail.lessons_pl : t.course_detail.lesson}
                </span>
              </div>

              <div className="space-y-4">
                {visibleLessons.map((lesson, visIdx) => {
                  const realIdx = lessons.indexOf(lesson)
                  return (
                    <div key={realIdx} className="border border-ui-border rounded-xl p-5 space-y-4 bg-ui-bg">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-ui-text">
                          <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                            {visIdx + 1}
                          </span>
                          {t.courses.lesson_label} {visIdx + 1}
                        </span>
                        <button type="button" onClick={() => removeLesson(realIdx)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition">
                          {t.courses.remove_lesson}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_title} *</label>
                        <input type="text" value={lesson.title ?? ''} onChange={e => updateLesson(realIdx, 'title', e.target.value)}
                          className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_video}</label>
                          <input type="url" value={lesson.video_url ?? ''} onChange={e => updateLesson(realIdx, 'video_url', e.target.value)}
                            placeholder={t.courses.video_placeholder}
                            className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_duration}</label>
                          <input type="number" min={0} value={lesson.duration_min ?? 0} onChange={e => updateLesson(realIdx, 'duration_min', Number(e.target.value))}
                            className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ui-muted uppercase tracking-wide mb-1.5">{t.courses.field_html}</label>
                        <textarea rows={2} value={lesson.content ?? ''} onChange={e => updateLesson(realIdx, 'content', e.target.value)}
                          className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel font-mono resize-none" />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button type="button" onClick={addLesson}
                className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-ui-border text-ui-muted text-sm font-semibold hover:border-brand-300 hover:text-brand-500 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t.courses.add_lesson}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <Link href={`/courses/${slug}`}
                className="px-6 py-2.5 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition">
                {t.common.cancel}
              </Link>
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? t.common.saving : t.common.save_changes}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
