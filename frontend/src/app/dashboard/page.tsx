'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Article, Course, Meeting } from '@/types'

/* ── Types ── */
interface AdminDashboard {
  role: 'admin'
  articles: number
  courses: number
  meetings: number
  researchers: number
  teachers: number
}

interface TeacherDashboard {
  role: 'teacher'
  my_courses: Course[]
  my_articles: Article[]
  my_meetings: Meeting[]
}

interface ResearcherDashboard {
  role: 'researcher'
  my_articles: Article[]
  upcoming: Meeting[]
}

type DashboardData = AdminDashboard | TeacherDashboard | ResearcherDashboard

/* ── Helpers ── */
function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ui-muted uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500">
          {icon}
        </div>
      </div>
      <p className="font-outfit text-3xl font-bold text-ui-text">{value}</p>
    </div>
  )
}

function SectionHeader({ title, href, createHref }: { title: string; href: string; createHref?: string }) {
  const { t } = useLang()
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-outfit text-xl font-bold text-ui-text">{title}</h2>
      <div className="flex items-center gap-3">
        {createHref && (
          <Link href={createHref} className="flex items-center gap-1 text-xs font-bold bg-brand-600 text-white px-3 py-1.5 rounded-full hover:bg-brand-700 transition">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t.dashboard.create}
          </Link>
        )}
        <Link href={href} className="text-sm text-brand-500 hover:text-brand-700 font-medium transition">
          {t.dashboard.see_all}
        </Link>
      </div>
    </div>
  )
}

function ArticleRow({ article }: { article: Article }) {
  const { t } = useLang()
  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <div className="flex items-start gap-4 py-4 border-b border-ui-border last:border-0 hover:bg-brand-50/50 -mx-4 px-4 rounded-xl transition">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex-shrink-0 flex items-center justify-center text-brand-600 font-bold text-sm">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ui-text group-hover:text-brand-600 transition line-clamp-1">
            {article.title}
          </p>
          <p className="text-xs text-ui-muted mt-0.5">
            {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            {article.category && ` · ${article.category}`}
          </p>
        </div>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
          article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {article.status === 'published' ? t.dashboard.published : t.dashboard.draft}
        </span>
      </div>
    </Link>
  )
}

function CourseRow({ course }: { course: Course }) {
  const { t } = useLang()
  const lvlColor: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700',
  }
  const lvlLabel: Record<string, string> = {
    beginner: t.courses.beginner,
    intermediate: t.courses.intermediate,
    advanced: t.courses.advanced,
  }
  return (
    <Link href={`/courses/${course.slug}`} className="block group">
      <div className="flex items-start gap-4 py-4 border-b border-ui-border last:border-0 hover:bg-brand-50/50 -mx-4 px-4 rounded-xl transition">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex-shrink-0 flex items-center justify-center text-accent font-bold text-sm">
          C
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ui-text group-hover:text-brand-600 transition line-clamp-1">
            {course.title}
          </p>
          <p className="text-xs text-ui-muted mt-0.5">
            {new Date(course.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${lvlColor[course.level] ?? 'bg-ui-border text-ui-muted'}`}>
          {lvlLabel[course.level] ?? course.level}
        </span>
      </div>
    </Link>
  )
}

function MeetingRow({ meeting }: { meeting: Meeting }) {
  const { t } = useLang()
  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    live:      'bg-emerald-100 text-emerald-700',
    ended:     'bg-ui-border text-ui-muted',
  }
  const statusLabel: Record<string, string> = {
    scheduled: t.meetings.scheduled,
    live:      t.meetings.live,
    ended:     t.meetings.ended,
  }
  const dateStr = new Date(meeting.scheduled_at).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
  return (
    <div className="flex items-start gap-4 py-4 border-b border-ui-border last:border-0">
      <div className="w-10 h-10 rounded-xl bg-brand-700/10 flex-shrink-0 flex items-center justify-center">
        <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ui-text line-clamp-1">{meeting.title}</p>
        <p className="text-xs text-ui-muted mt-0.5 capitalize">{dateStr}</p>
        {meeting.google_meet_url && (
          <a
            href={meeting.google_meet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-700 font-medium mt-1 transition"
          >
            {t.meetings.join} →
          </a>
        )}
      </div>
      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[meeting.status] ?? ''}`}>
        {statusLabel[meeting.status] ?? meeting.status}
      </span>
    </div>
  )
}

/* ── Admin Dashboard ── */
function AdminView({ data }: { data: AdminDashboard }) {
  const { t } = useLang()
  const quickLinks = [
    { href: '/articles', createHref: '/articles/new', label: t.dashboard.articles, desc: t.dashboard.admin_articles_desc },
    { href: '/courses',  createHref: '/courses/new',  label: t.dashboard.courses,  desc: t.dashboard.admin_courses_desc },
    { href: '/meetings', createHref: '/meetings/new', label: t.dashboard.meetings, desc: t.dashboard.admin_meetings_desc },
  ]
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-outfit text-3xl font-bold text-ui-text">{t.dashboard.admin_title}</h1>
        <p className="text-ui-muted mt-1">{t.dashboard.admin_sub}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label={t.dashboard.articles} value={data.articles} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        } />
        <StatCard label={t.dashboard.courses} value={data.courses} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
          </svg>
        } />
        <StatCard label={t.dashboard.meetings} value={data.meetings} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        } />
        <StatCard label={t.dashboard.researchers} value={data.researchers} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        } />
        <StatCard label={t.dashboard.teachers} value={data.teachers} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        } />
      </div>
      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickLinks.map(item => (
          <div key={item.href} className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm hover:shadow-md hover:border-brand-200 transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ui-text">{item.label}</p>
                <p className="text-sm text-ui-muted mt-1">{item.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href={item.createHref} className="flex-1 text-center text-xs font-bold bg-brand-600 text-white px-3 py-2 rounded-full hover:bg-brand-700 transition">
                + {t.dashboard.create}
              </Link>
              <Link href={item.href} className="flex-1 text-center text-xs font-semibold border border-ui-border text-ui-muted px-3 py-2 rounded-full hover:border-brand-300 hover:text-brand-600 transition">
                {t.dashboard.see_all}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Teacher Dashboard ── */
function TeacherView({ data }: { data: TeacherDashboard }) {
  const { t } = useLang()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-outfit text-3xl font-bold text-ui-text">{t.dashboard.teacher_title}</h1>
        <p className="text-ui-muted mt-1">{t.dashboard.teacher_sub}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Mes cours */}
        <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
          <SectionHeader title={t.dashboard.my_courses} href="/courses" createHref="/courses/new" />
          {data.my_courses.length === 0
            ? <p className="text-ui-muted text-sm py-4 text-center">{t.dashboard.no_courses}</p>
            : data.my_courses.map(c => <CourseRow key={c.id} course={c} />)
          }
        </div>

        {/* Mes publications */}
        <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
          <SectionHeader title={t.dashboard.my_articles} href="/articles" createHref="/articles/new" />
          {data.my_articles.length === 0
            ? <p className="text-ui-muted text-sm py-4 text-center">{t.dashboard.no_articles}</p>
            : data.my_articles.map(a => <ArticleRow key={a.id} article={a} />)
          }
        </div>

        {/* Mes réunions */}
        <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
          <SectionHeader title={t.dashboard.my_meetings} href="/meetings" createHref="/meetings/new" />
          {data.my_meetings.length === 0
            ? <p className="text-ui-muted text-sm py-4 text-center">{t.dashboard.no_meetings}</p>
            : data.my_meetings.map(m => <MeetingRow key={m.id} meeting={m} />)
          }
        </div>
      </div>
    </div>
  )
}

/* ── Researcher Dashboard ── */
function ResearcherView({ data }: { data: ResearcherDashboard }) {
  const { t } = useLang()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-outfit text-3xl font-bold text-ui-text">{t.dashboard.researcher_title}</h1>
        <p className="text-ui-muted mt-1">{t.dashboard.researcher_sub}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Mes publications */}
        <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
          <SectionHeader title={t.dashboard.my_articles} href="/articles" createHref="/articles/new" />
          {data.my_articles.length === 0
            ? (
              <div className="py-12 text-center">
                <svg className="w-10 h-10 text-ui-border mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-ui-muted text-sm">{t.dashboard.no_articles}</p>
              </div>
            )
            : data.my_articles.map(a => <ArticleRow key={a.id} article={a} />)
          }
        </div>

        {/* Prochaines réunions */}
        <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
          <SectionHeader title={t.dashboard.upcoming} href="/meetings" />
          {data.upcoming.length === 0
            ? <p className="text-ui-muted text-sm py-4 text-center">{t.dashboard.no_upcoming}</p>
            : data.upcoming.map(m => <MeetingRow key={m.id} meeting={m} />)
          }
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
      return
    }
    if (user) {
      api.get('/dashboard')
        .then(res => setDashboard(res.data))
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-ui-bg pt-[var(--nav-height)]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-ui-muted text-sm">{t.dashboard.loading}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!dashboard) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ui-bg">
          <p className="text-ui-text font-medium">{t.dashboard.error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-brand-500 hover:underline">
            {t.dashboard.retry}
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const roleLabel =
    user?.role === 'admin'      ? t.dashboard.role_admin :
    user?.role === 'teacher'    ? t.dashboard.role_teacher :
                                  t.dashboard.role_researcher

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-[var(--nav-height)]">
        {/* Top bar */}
        <div className="bg-brand-700 border-b border-brand-800">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
            <div>
              <p className="text-brand-200 text-sm">{t.dashboard.hello}</p>
              <p className="text-white font-outfit font-semibold text-xl">{user?.name}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {dashboard.role === 'admin'      && <AdminView      data={dashboard as AdminDashboard} />}
          {dashboard.role === 'teacher'    && <TeacherView    data={dashboard as TeacherDashboard} />}
          {dashboard.role === 'researcher' && <ResearcherView data={dashboard as ResearcherDashboard} />}
        </div>
      </main>
      <Footer />
    </>
  )
}
