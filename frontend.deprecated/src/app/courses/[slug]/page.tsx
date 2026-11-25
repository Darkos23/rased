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

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [notFound, setNotFound]   = useState(false)
  const [apiError, setApiError]   = useState(false)
  const [deleting, setDeleting]   = useState(false)

  const levelMeta: Record<string, { label: string; color: string }> = {
    beginner:     { label: t.courses.beginner,     color: 'bg-emerald-100 text-emerald-700' },
    intermediate: { label: t.courses.intermediate, color: 'bg-amber-100 text-amber-700' },
    advanced:     { label: t.courses.advanced,     color: 'bg-rose-100 text-rose-700' },
  }

  const handleDelete = async () => {
    if (!confirm(t.course_detail.confirm_delete)) return
    setDeleting(true)
    try {
      await api.delete(`/courses/${course?.id}`)
      router.push('/courses')
    } catch { setDeleting(false) }
  }

  const loadCourse = () => {
    setLoading(true)
    setNotFound(false)
    setApiError(false)
    api
      .get(`/courses/${slug}`)
      .then(res => {
        setCourse(res.data)
        if (res.data.lessons?.length) setActiveLesson(res.data.lessons[0])
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
        else setApiError(true)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCourse() }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-ui-bg">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-ui-muted text-sm">{t.course_detail.loading}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (apiError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-ui-bg px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="font-semibold text-ui-text">{t.common.error_generic}</p>
          <div className="flex gap-3">
            <button onClick={loadCourse} className="text-sm font-semibold text-brand-600 border border-brand-200 px-5 py-2 rounded-full hover:bg-brand-50 transition">
              {t.dashboard.retry}
            </button>
            <Link href="/courses" className="text-sm font-semibold text-ui-text border border-ui-border px-5 py-2 rounded-full hover:border-brand-300 transition">
              ← {t.course_detail.back}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (notFound || !course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ui-bg">
          <p className="text-2xl font-outfit font-bold text-ui-text">{t.course_detail.not_found}</p>
          <Link href="/courses" className="text-brand-500 hover:underline text-sm">
            ← {t.course_detail.back}
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const lvl = levelMeta[course.level] ?? { label: course.level, color: 'bg-ui-border text-ui-muted' }
  const totalMin = course.lessons?.reduce((acc, l) => acc + (l.duration_min ?? 0), 0) ?? 0
  const totalH = Math.floor(totalMin / 60)
  const totalRem = totalMin % 60

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-[var(--nav-height)]">

        {/* Hero */}
        <div className="relative bg-brand-700 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--brand-500), transparent 70%)' }}
          />
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            {/* Breadcrumb + actions */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <nav className="flex items-center gap-2 text-brand-200 text-sm">
                <Link href="/" className="hover:text-white transition">{t.nav.home}</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition">{t.nav.courses}</Link>
                <span>/</span>
                <span className="text-white/70 truncate max-w-xs">{course.title}</span>
              </nav>
              {user && (user.role === 'admin' || user.id === course.teacher.id) && (
                <div className="flex items-center gap-2">
                  <Link href={`/courses/${slug}/edit`}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full transition">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t.course_detail.edit}
                  </Link>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 px-4 py-2 rounded-full transition disabled:opacity-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting ? t.course_detail.deleting : t.course_detail.delete}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
              {/* Left: course info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lvl.color}`}>
                    {lvl.label}
                  </span>
                </div>
                <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-brand-100 text-lg leading-relaxed mb-6 max-w-2xl">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-6 text-brand-200 text-sm">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {course.lessons?.length ?? 0} {course.lessons?.length === 1 ? t.course_detail.lesson : t.course_detail.lessons_pl}
                  </span>
                  {totalMin > 0 && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {totalH > 0 ? `${totalH}h ${totalRem}min` : `${totalRem} ${t.course_detail.min}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: instructor card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <p className="text-brand-200 text-xs font-semibold uppercase tracking-wider mb-4">{t.dashboard.role_teacher}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {course.teacher.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{course.teacher.name}</p>
                    <p className="text-brand-200 text-xs">{t.course_detail.teacher_role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {!course.lessons?.length ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                </svg>
              </div>
              <p className="font-outfit text-lg font-semibold text-ui-text">{t.course_detail.no_lessons}</p>
              <p className="text-ui-muted text-sm mt-1">{t.course_detail.no_lessons_sub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">

              {/* Lessons list */}
              <div className="bg-ui-panel rounded-2xl border border-ui-border shadow-sm overflow-hidden lg:sticky lg:top-28">
                <div className="px-5 py-4 border-b border-ui-border">
                  <h2 className="font-outfit font-semibold text-ui-text">{t.course_detail.program}</h2>
                  <p className="text-xs text-ui-muted mt-0.5">
                    {course.lessons.length} {course.lessons.length === 1 ? t.course_detail.lesson : t.course_detail.lessons_pl}
                  </p>
                </div>
                <div className="divide-y divide-ui-border max-h-[560px] overflow-y-auto">
                  {course.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left px-5 py-4 flex items-start gap-3 transition hover:bg-brand-50 ${
                        activeLesson?.id === lesson.id ? 'bg-brand-50 border-l-4 border-brand-500' : ''
                      }`}
                    >
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                        activeLesson?.id === lesson.id ? 'bg-brand-500 text-white' : 'bg-ui-border text-ui-muted'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium leading-snug line-clamp-2 ${
                          activeLesson?.id === lesson.id ? 'text-brand-700' : 'text-ui-text'
                        }`}>
                          {lesson.title}
                        </p>
                        {lesson.duration_min > 0 && (
                          <p className="text-xs text-ui-muted mt-1">{lesson.duration_min} {t.course_detail.min}</p>
                        )}
                      </div>
                      {lesson.video_url && (
                        <svg className="w-4 h-4 text-ui-muted flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active lesson viewer */}
              {activeLesson && (
                <div className="space-y-6">
                  {activeLesson.video_url ? (
                    <div className="rounded-2xl overflow-hidden bg-black shadow-[0_8px_40px_rgba(0,0,0,0.18)] aspect-video">
                      <iframe
                        src={activeLesson.video_url.replace('watch?v=', 'embed/')}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-brand-50 border-2 border-dashed border-brand-200 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-brand-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                        </svg>
                        <p className="text-brand-400 text-sm">{t.course_detail.no_video}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
                    <h3 className="font-outfit text-2xl font-bold text-ui-text mb-2">{activeLesson.title}</h3>
                    {activeLesson.duration_min > 0 && (
                      <p className="text-sm text-ui-muted mb-4">
                        {t.course_detail.duration} {activeLesson.duration_min} {t.course_detail.min}
                      </p>
                    )}
                    {activeLesson.content && (
                      <div
                        className="prose prose-slate max-w-none prose-p:text-ui-text prose-p:leading-relaxed prose-headings:font-outfit"
                        dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
