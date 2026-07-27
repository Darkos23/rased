'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { Meeting, PaginatedResponse } from '@/types'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'

export default function MeetingsPage() {
  const { user } = useAuth()
  const { lang, t } = useLang()

  const [data, setData]               = useState<PaginatedResponse<Meeting> | null>(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [page, setPage]               = useState(1)
  const [search, setSearch]           = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatus]     = useState('')

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchMeetings = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ page: String(page) })
    if (search)       params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    api.get(`/meetings?${params}`)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [page, search, statusFilter])

  useEffect(() => { fetchMeetings() }, [fetchMeetings])

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'

  const statusConfig: Record<string, { label: string; color: string }> = {
    scheduled: { label: t.meetings.scheduled, color: 'bg-blue-100 text-blue-700' },
    live:      { label: t.meetings.live,       color: 'bg-red-100 text-red-700' },
    ended:     { label: t.meetings.ended,      color: 'bg-slate-100 text-slate-500' },
  }

  /* Separate live meetings for the top banner */
  const liveMeetings = data?.data.filter(m => m.status === 'live') ?? []
  const otherMeetings = data?.data.filter(m => m.status !== 'live') ?? []
  const hasLive = liveMeetings.length > 0 && !statusFilter

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-outfit text-4xl font-bold text-ui-text mb-1">{t.meetings.title}</h1>
              <p className="text-ui-muted">{t.meetings.subtitle}</p>
            </div>
            {user && (user.role === 'teacher' || user.role === 'admin') && (
              <Link href="/meetings/new"
                className="flex items-center gap-2 bg-brand-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-700 transition shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t.meetings.new}
              </Link>
            )}
          </div>

          {/* ── LIVE BANNER ── */}
          {hasLive && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
              {/* Header strip */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-red-200 bg-red-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
                <span className="text-white font-outfit font-bold text-sm uppercase tracking-widest">
                  {t.meetings.live_now}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {liveMeetings.map(meeting => (
                  <Link
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    className="group flex items-center justify-between gap-4 bg-white rounded-xl p-4 border border-red-100 hover:border-red-300 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-outfit font-semibold text-ui-text group-hover:text-red-600 transition truncate">
                          {meeting.title}
                        </p>
                        <p className="text-xs text-ui-muted mt-0.5">
                          {t.meetings.by} <span className="font-medium">{meeting.host.name}</span>
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-full group-hover:bg-red-700 transition shadow-sm">
                      {t.meetings.join} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
                placeholder={t.meetings.search_placeholder}
                className="w-full border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-panel"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatus(e.target.value); setPage(1) }}
              className="border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel"
            >
              <option value="">{t.meetings.filter_all_status}</option>
              <option value="scheduled">{t.meetings.scheduled}</option>
              <option value="live">{t.meetings.live}</option>
              <option value="ended">{t.meetings.ended}</option>
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
              {t.meetings.loading}
            </div>
          )}

          {/* Error */}
          {error && <ErrorState onRetry={fetchMeetings} />}

          {/* List — non-live meetings (or all meetings when filtered) */}
          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {(statusFilter ? data?.data : otherMeetings)?.map(meeting => {
                const s = statusConfig[meeting.status] ?? { label: meeting.status, color: '' }
                const dateStr = new Date(meeting.scheduled_at).toLocaleString(locale, {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
                const hasReplay = !!meeting.recording_url

                return (
                  <div
                    key={meeting.id}
                    className={`bg-ui-panel border rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row md:items-center gap-5 ${
                      meeting.status === 'live' ? 'border-red-200 bg-red-50/30' : 'border-ui-border'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      meeting.status === 'live' ? 'bg-red-100' : hasReplay ? 'bg-emerald-50' : 'bg-brand-50'
                    }`}>
                      {hasReplay ? (
                        <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      ) : (
                        <svg className={`w-6 h-6 ${meeting.status === 'live' ? 'text-red-500' : 'text-brand-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
                          {meeting.status === 'live' && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5 align-middle" />
                          )}
                          {s.label}
                        </span>
                        {hasReplay && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            📺 {t.meetings.replay_available}
                          </span>
                        )}
                      </div>
                      <Link href={`/meetings/${meeting.id}`}>
                        <h2 className="font-outfit text-lg font-semibold text-ui-text hover:text-brand-600 transition cursor-pointer">
                          {meeting.title}
                        </h2>
                      </Link>
                      {meeting.description && (
                        <p className="text-sm text-ui-muted mt-1 line-clamp-2">{meeting.description}</p>
                      )}
                      <p className="text-sm text-ui-muted mt-2 capitalize">
                        {dateStr} · {t.meetings.by} <span className="font-medium text-ui-text">{meeting.host.name}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {meeting.status !== 'ended' && (
                        <Link
                          href={`/meetings/${meeting.id}`}
                          className={`text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-sm ${
                            meeting.status === 'live'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-brand-600 text-white hover:bg-brand-700'
                          }`}
                        >
                          {t.meetings.join}
                        </Link>
                      )}
                      {hasReplay && (
                        <Link
                          href={`/meetings/${meeting.id}`}
                          className="flex items-center gap-1.5 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-50 transition"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          {t.meetings.watch_replay}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {data && !error && <Pagination currentPage={data.current_page} lastPage={data.last_page} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}

          {data?.data.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <p className="font-outfit text-lg font-semibold text-ui-text">{t.meetings.empty_title}</p>
              <p className="text-ui-muted text-sm mt-1">{t.meetings.empty_sub}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
