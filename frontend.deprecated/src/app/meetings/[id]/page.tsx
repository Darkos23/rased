'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Meeting } from '@/types'

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => {
      dispose: () => void
    }
  }
}

/** Converts a YouTube or Vimeo URL to an embeddable iframe src. Returns null for other URLs. */
function getEmbedUrl(url: string): string | null {
  // YouTube: watch?v=ID or youtu.be/ID or youtube.com/shorts/ID
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`

  // Vimeo: vimeo.com/ID
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`

  return null
}

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { lang, t } = useLang()
  const router = useRouter()

  const [meeting, setMeeting]     = useState<Meeting | null>(null)
  const [loading, setLoading]     = useState(true)
  const [joined, setJoined]       = useState(false)
  const [jwtToken, setJwtToken]   = useState<string | null>(null)
  const [notFound, setNotFound]   = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [toast, setToast]         = useState('')

  /* Recording form */
  const [showRecForm, setShowRecForm]       = useState(false)
  const [recordingUrl, setRecordingUrl]     = useState('')
  const [savingRec, setSavingRec]           = useState(false)

  const jitsiRef = useRef<HTMLDivElement>(null)
  const apiRef   = useRef<{ dispose: () => void } | null>(null)

  useEffect(() => {
    api.get(`/meetings/${id}`)
      .then(res => { setMeeting(res.data); setRecordingUrl(res.data.recording_url ?? '') })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDelete = async () => {
    if (!confirm(t.meeting_detail.confirm_delete)) return
    setDeleting(true)
    try {
      await api.delete(`/meetings/${id}`)
      router.push('/meetings')
    } catch {
      setDeleting(false)
    }
  }

  const handleJoin = async () => {
    try {
      const res = await api.get(`/meetings/${id}/token`)
      setJwtToken(res.data.token)
      setJoined(true)
    } catch {
      setJoined(true)
    }
  }

  const handleSaveRecording = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recordingUrl.trim()) return
    setSavingRec(true)
    try {
      const res = await api.patch(`/meetings/${id}/recording`, { recording_url: recordingUrl })
      setMeeting(res.data)
      setShowRecForm(false)
      showToast(t.meeting_detail.recording_saved)
    } finally {
      setSavingRec(false)
    }
  }

  /* JaaS embed */
  useEffect(() => {
    if (!joined || !meeting?.google_meet_url) return
    const urlParts = meeting.google_meet_url.split('/')
    const roomName = urlParts[urlParts.length - 1]
    const appId    = urlParts[urlParts.length - 2]
    if (!roomName || !appId) return

    const scriptId = 'jitsi-api-script'
    const launch = () => {
      if (!jitsiRef.current || !window.JitsiMeetExternalAPI) return
      apiRef.current?.dispose()
      const options: Record<string, unknown> = {
        roomName: `${appId}/${roomName}`,
        parentNode: jitsiRef.current,
        width: '100%', height: '100%',
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          defaultLanguage: lang,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['microphone','camera','desktop','fullscreen','fodeviceselection','hangup','chat','recording','raisehand','tileview','settings'],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        },
        userInfo: { displayName: user?.name ?? 'RASED', email: user?.email ?? '' },
      }
      if (jwtToken) options.jwt = jwtToken
      apiRef.current = new window.JitsiMeetExternalAPI('8x8.vc', options)
    }

    if (document.getElementById(scriptId)) {
      launch()
    } else {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://8x8.vc/${appId}/external_api.js`
      script.async = true
      script.onload = launch
      document.body.appendChild(script)
    }
    return () => { apiRef.current?.dispose() }
  }, [joined, jwtToken, meeting, user, lang])

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-ui-bg pt-[var(--nav-height)]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  )

  if (notFound || !meeting) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ui-bg pt-[var(--nav-height)]">
        <p className="text-xl font-outfit font-bold text-ui-text">{t.meeting_detail.not_found}</p>
        <Link href="/meetings" className="text-brand-500 hover:underline text-sm">{t.meeting_detail.back}</Link>
      </div>
    </>
  )

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const statusConfig: Record<string, { label: string; color: string }> = {
    scheduled: { label: t.meetings.scheduled, color: 'bg-blue-100 text-blue-700' },
    live:      { label: t.meetings.live,       color: 'bg-emerald-100 text-emerald-700' },
    ended:     { label: t.meetings.ended,      color: 'bg-ui-border text-ui-muted' },
  }
  const s      = statusConfig[meeting.status] ?? { label: meeting.status, color: '' }
  const date   = new Date(meeting.scheduled_at)
  const dateStr = date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const canJoin = meeting.status !== 'ended' && !!meeting.google_meet_url
  const isHostOrAdmin = !!(user && (user.id === meeting.host.id || user.role === 'admin'))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-[var(--nav-height)]">

        {/* Toast */}
        {toast && (
          <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        )}

        {/* Jitsi fullscreen */}
        {joined && (
          <div className="fixed inset-0 z-50 bg-black pt-[var(--nav-height)]">
            <div className="absolute top-20 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center">
                  <span className="text-white font-outfit font-bold text-sm">F</span>
                </div>
                <span className="text-white font-semibold text-sm truncate max-w-xs">{meeting.title}</span>
              </div>
              <button
                onClick={() => { apiRef.current?.dispose(); setJoined(false) }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t.meeting_detail.leave}
              </button>
            </div>
            <div ref={jitsiRef} className="w-full h-full" />
          </div>
        )}

        {/* Detail page */}
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Breadcrumb + actions */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-ui-muted text-sm">
              <Link href="/" className="hover:text-brand-600 transition">{t.nav.home}</Link>
              <span>/</span>
              <Link href="/meetings" className="hover:text-brand-600 transition">{t.nav.activities}</Link>
              <span>/</span>
              <span className="text-ui-text truncate max-w-xs">{meeting.title}</span>
            </nav>

            {isHostOrAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/meetings/${id}/edit`}
                  className="flex items-center gap-2 text-sm font-semibold text-ui-text border border-ui-border px-4 py-2 rounded-full hover:border-brand-400 hover:text-brand-600 transition"
                >
                  {t.meeting_detail.edit}
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                >
                  {deleting ? t.meeting_detail.deleting : t.meeting_detail.delete}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* Main content */}
            <div className="space-y-6">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                {s.label}
              </span>

              <h1 className="font-outfit text-3xl font-bold text-ui-text leading-tight">
                {meeting.title}
              </h1>

              {meeting.description && (
                <p className="text-ui-muted leading-relaxed">{meeting.description}</p>
              )}

              {/* Date & host */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-ui-text capitalize">{dateStr}</p>
                    <p className="text-ui-muted">{timeStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-ui-text">{meeting.host.name}</p>
                    <p className="text-ui-muted">{t.meeting_detail.host}</p>
                  </div>
                </div>
              </div>

              {/* Join button */}
              {canJoin && (
                <button
                  onClick={handleJoin}
                  className="inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-sm text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  {t.meeting_detail.join}
                </button>
              )}

              {/* Recording — embedded player or external link */}
              {meeting.recording_url && (() => {
                const embedUrl = getEmbedUrl(meeting.recording_url)
                return (
                  <div className="space-y-3">
                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        {t.meetings.replay_available}
                      </span>
                    </div>

                    {/* Embedded player */}
                    {embedUrl ? (
                      <div className="rounded-2xl overflow-hidden border border-ui-border shadow-sm aspect-video bg-black">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={meeting.title}
                        />
                      </div>
                    ) : (
                      /* Non-embeddable URL (Drive, etc.) — fallback button */
                      <a
                        href={meeting.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 border border-ui-border hover:border-brand-300 text-ui-text font-semibold px-6 py-3 rounded-full transition text-sm"
                      >
                        <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.meeting_detail.recording}
                      </a>
                    )}

                    {/* Always show external link below embed */}
                    {embedUrl && (
                      <a
                        href={meeting.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-ui-muted hover:text-brand-600 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {t.meetings.replay_external}
                      </a>
                    )}
                  </div>
                )
              })()}

              {meeting.status === 'ended' && !meeting.recording_url && !showRecForm && (
                <div className="bg-ui-border/30 rounded-xl px-5 py-4 text-sm text-ui-muted">
                  {t.meeting_detail.ended_no_rec}
                </div>
              )}

              {/* Add recording form (host/admin only) */}
              {isHostOrAdmin && (
                <div className="pt-2">
                  {showRecForm ? (
                    <form onSubmit={handleSaveRecording} className="bg-ui-panel border border-ui-border rounded-2xl p-5 space-y-4">
                      <p className="text-sm font-semibold text-ui-text">{t.meeting_detail.add_recording}</p>
                      <div>
                        <label className="block text-xs font-semibold text-ui-muted mb-1.5 uppercase tracking-wide">
                          {t.meeting_detail.recording_url_label}
                        </label>
                        <input
                          type="url"
                          required
                          value={recordingUrl}
                          onChange={e => setRecordingUrl(e.target.value)}
                          placeholder={t.meeting_detail.recording_url_placeholder}
                          className="w-full border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={savingRec}
                          className="px-5 py-2 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                          {savingRec && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                          {t.meeting_detail.save_recording}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRecForm(false)}
                          className="px-5 py-2 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition"
                        >
                          {t.common.cancel}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowRecForm(true)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-ui-muted border border-dashed border-ui-border px-5 py-2.5 rounded-full hover:border-brand-300 hover:text-brand-600 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      {t.meeting_detail.add_recording}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Join card */}
              {canJoin && (
                <div className="bg-brand-700 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <p className="text-white font-outfit font-semibold mb-1">Jitsi Meet</p>
                  <p className="text-brand-200 text-xs mb-4 leading-relaxed">{t.meeting_detail.no_install}</p>
                  <button
                    onClick={handleJoin}
                    className="w-full bg-white text-brand-700 font-bold py-2.5 rounded-full text-sm hover:bg-brand-50 transition"
                  >
                    {t.meeting_detail.join} →
                  </button>
                </div>
              )}

              {/* Direct link */}
              {meeting.google_meet_url && (
                <div className="bg-ui-panel border border-ui-border rounded-2xl p-5">
                  <p className="text-xs font-semibold text-ui-muted uppercase tracking-wider mb-3">{t.meeting_detail.direct_link}</p>
                  <a
                    href={meeting.google_meet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 font-medium transition break-all"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t.meeting_detail.open_new_tab}
                  </a>
                </div>
              )}

              {/* Replay sidebar card */}
              {meeting.recording_url ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <p className="font-semibold text-emerald-800">{t.meetings.replay_available}</p>
                  </div>
                  <p className="text-emerald-700 text-xs leading-relaxed mb-3">{t.meetings.replay_on_platform}</p>
                  <a
                    href={meeting.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 underline underline-offset-2 transition"
                  >
                    {t.meetings.replay_external} ↗
                  </a>
                </div>
              ) : (
                /* Info Jitsi — shown when no replay yet */
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-sm text-brand-700">
                  <p className="font-semibold mb-1">Jitsi Meet</p>
                  <p className="text-brand-600 text-xs leading-relaxed">{t.meeting_detail.jitsi_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
