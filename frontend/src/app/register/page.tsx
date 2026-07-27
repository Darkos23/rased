'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'

export default function RegisterPage() {
  const { register } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'researcher',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError(t.auth.pw_mismatch)
      return
    }
    setLoading(true)
    try {
      await register(form)
      router.push('/verify-email')
    } catch {
      setError(t.auth.register_error)
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  })

  const fields = [
    { label: t.auth.full_name,        key: 'name',                  type: 'text',     placeholder: 'Aminata Sow' },
    { label: 'Email',                  key: 'email',                 type: 'email',    placeholder: 'vous@rased-africa.org' },
    { label: t.auth.password,          key: 'password',              type: 'password', placeholder: '••••••••' },
    { label: t.auth.confirm_password,  key: 'password_confirmation', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center min-h-screen bg-ui-bg px-4 pt-[calc(var(--nav-height)+16px)] pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 items-center justify-center mb-4">
              <img src="/rased-logo.png" alt="RASED" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="font-outfit text-3xl font-extrabold text-ui-text mb-1">{t.auth.register_title}</h1>
            <p className="text-ui-muted text-sm">{t.auth.register_sub}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 font-medium">
              {error}
            </div>
          )}

          <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-8">
            {/* Role selector */}
            <div className="flex rounded-xl border border-ui-border overflow-hidden mb-6">
              {[
                { value: 'teacher',    label: t.auth.teacher_role },
                { value: 'researcher', label: t.auth.researcher_role },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${form.role === value ? 'bg-brand-600 text-white' : 'text-ui-muted hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-ui-text mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    {...field(key as keyof typeof form)}
                    className="w-full border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-ui-bg"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-full hover:bg-brand-700 transition-all shadow-soft disabled:opacity-60 mt-2"
              >
                {loading ? t.auth.registering : t.auth.register_btn}
              </button>
            </form>
          </div>

          <p className="text-sm text-center text-ui-muted mt-6">
            {t.auth.already_account}{' '}
            <Link href="/login" className="text-brand-600 hover:underline font-bold">
              {t.auth.sign_in}
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
