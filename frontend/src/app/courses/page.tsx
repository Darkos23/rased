'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Course, PaginatedResponse } from '@/types'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'

export default function CoursesPage() {
  const { user } = useAuth()
  const { t } = useLang()

  const [data, setData]           = useState<PaginatedResponse<Course> | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [levelFilter, setLevel]   = useState('')

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchCourses = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ page: String(page) })
    if (search)      params.set('search', search)
    if (levelFilter) params.set('level',  levelFilter)
    api.get(`/courses?${params}`)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [page, search, levelFilter])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const levelColor: Record<string, string> = {
    beginner:     'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced:     'bg-rose-100 text-rose-700',
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-outfit text-4xl font-bold text-ui-text mb-1">{t.courses.title}</h1>
              <p className="text-ui-muted">{t.courses.subtitle}</p>
            </div>
            {user && (user.role === 'teacher' || user.role === 'admin') && (
              <Link href="/courses/new"
                className="flex items-center gap-2 bg-brand-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-700 transition shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t.courses.new}
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={t.courses.search_placeholder}
                className="w-full border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-panel"
              />
            </div>
            <select
              value={levelFilter}
              onChange={e => { setLevel(e.target.value); setPage(1) }}
              className="border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel"
            >
              <option value="">{t.courses.filter_all_levels}</option>
              <option value="beginner">{t.courses.beginner}</option>
              <option value="intermediate">{t.courses.intermediate}</option>
              <option value="advanced">{t.courses.advanced}</option>
            </select>
          </div>

          {/* Count */}
          {data && !loading && (
            <p className="text-xs text-ui-muted mb-4">{data.total} {t.admin.total}</p>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 text-ui-muted py-20 justify-center">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              {t.courses.loading}
            </div>
          )}

          {/* Error */}
          {error && <ErrorState onRetry={fetchCourses} />}

          {/* Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.map(course => {
                const levelLabels: Record<string, string> = {
                  beginner:     t.courses.beginner,
                  intermediate: t.courses.intermediate,
                  advanced:     t.courses.advanced,
                }
                const lvl = {
                  label: levelLabels[course.level] ?? course.level,
                  color: levelColor[course.level] ?? 'bg-ui-border text-ui-muted',
                }
                return (
                  <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                    <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-200 transition overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-video overflow-hidden bg-brand-700">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${lvl.color}`}>
                          {lvl.label}
                        </span>
                        <h2 className="font-outfit text-lg font-semibold text-ui-text mb-2 line-clamp-2 group-hover:text-brand-600 transition">
                          {course.title}
                        </h2>
                        {course.description && (
                          <p className="text-sm text-ui-muted line-clamp-2 mb-4 flex-1">{course.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-ui-border">
                          <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {course.teacher.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-ui-muted truncate">{course.teacher.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {data && !error && <Pagination currentPage={data.current_page} lastPage={data.last_page} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}

          {data?.data.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="font-outfit text-lg font-semibold text-ui-text">{t.courses.empty_title}</p>
              <p className="text-ui-muted text-sm mt-1">{t.courses.empty_sub}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
