'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'

export default function ProfilePage() {
  const { user, loading: authLoading, setUser } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({ name: '', bio: '', locale: 'fr' })
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  // Password change
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError]     = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, bio: user.bio ?? '', locale: user.locale ?? 'fr' })
      setAvatarPreview(user.avatar ?? '')
    }
  }, [user])

  if (authLoading || !user) return null

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const roleLabel: Record<string, string> = {
    admin:      t.dashboard.role_admin,
    teacher:    t.dashboard.role_teacher,
    researcher: t.dashboard.role_researcher,
  }

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  /* ── Upload avatar ── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)
    setAvatarUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await api.post('/users/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatarPreview(res.data.url)
      setUser({ ...user, avatar: res.data.url })
    } catch {
      setError(t.common.error_generic)
      setAvatarPreview(user.avatar ?? '')
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Save profile ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError(`${t.profile.name} ${t.common.required}.`); return }
    setError('')
    setSaving(true)
    setSuccess(false)
    try {
      const res = await api.put('/users/me', form)
      setUser(res.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError(t.common.error_generic)
    } finally {
      setSaving(false)
    }
  }

  /* ── Change password ── */
  const setPwField = (k: keyof typeof pwForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwForm(f => ({ ...f, [k]: e.target.value }))

  const handlePwChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.password_confirmation) {
      setPwError('Les mots de passe ne correspondent pas.')
      return
    }
    if (pwForm.password.length < 8) {
      setPwError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setPwError('')
    setPwSaving(true)
    setPwSuccess(false)
    try {
      await api.put('/users/me/password', pwForm)
      setPwSuccess(true)
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setPwError(e?.response?.data?.message ?? 'Mot de passe actuel incorrect.')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6">

          {/* Header card */}
          <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-6">
              {/* Avatar with replacement button */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-ui-border bg-brand-700 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center hover:bg-brand-700 transition disabled:opacity-50"
                  title={t.profile.photo_hint}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="font-outfit text-2xl font-bold text-ui-text">{user.name}</h1>
                <p className="text-ui-muted text-sm">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
                  {roleLabel[user.role] ?? user.role}
                </span>
                <p className="text-xs text-ui-muted mt-2">
                  {t.profile.photo_hint}
                </p>
              </div>
            </div>
          </div>

          {/* Edit profile form */}
          <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8">
            <h2 className="font-outfit font-bold text-ui-text text-lg border-b border-ui-border pb-4 mb-6">
              {t.profile.title}
            </h2>

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t.profile.saved}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">{error}</div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.name} *</label>
                  <input type="text" required value={form.name} onChange={setField('name')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.locale}</label>
                  <select value={form.locale} onChange={setField('locale')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.bio}</label>
                <textarea value={form.bio} onChange={setField('bio')} rows={4}
                  placeholder={t.profile.bio_placeholder}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg resize-none" />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving}
                  className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {saving ? t.profile.saving : t.profile.save}
                </button>
              </div>
            </form>
          </div>

          {/* Password change */}
          <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm p-8">
            <h2 className="font-outfit font-bold text-ui-text text-lg border-b border-ui-border pb-4 mb-6">
              {t.profile.password_title}
            </h2>

            {pwSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t.profile.pw_changed}
              </div>
            )}
            {pwError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">{pwError}</div>
            )}

            <form onSubmit={handlePwChange} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.current_pw}</label>
                <input type="password" required value={pwForm.current_password} onChange={setPwField('current_password')}
                  className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.new_pw}</label>
                  <input type="password" required value={pwForm.password} onChange={setPwField('password')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ui-text mb-2">{t.profile.confirm_pw}</label>
                  <input type="password" required value={pwForm.password_confirmation} onChange={setPwField('password_confirmation')}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={pwSaving}
                  className="px-8 py-2.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {pwSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {pwSaving ? t.profile.changing : t.profile.change_pw}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
