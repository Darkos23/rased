'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Pagination from '@/components/ui/Pagination'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { PaginatedResponse, Role } from '@/types'

interface AdminUser {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
  created_at: string
}

const ROLES: Role[] = ['admin', 'teacher', 'researcher']

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const router = useRouter()

  const [data, setData]         = useState<PaginatedResponse<AdminUser> | null>(null)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [roleFilter, setRole]   = useState<Role | ''>('')
  const [updating, setUpdating] = useState<number | null>(null)
  const [toast, setToast]       = useState('')

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search)     params.set('search', search)
    if (roleFilter) params.set('role', roleFilter)
    api.get(`/admin/users?${params}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [page, search, roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  /* debounce search */
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleRoleChange = async (userId: number, newRole: Role) => {
    setUpdating(userId)
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setData(d => d ? {
        ...d,
        data: d.data.map(u => u.id === userId ? { ...u, role: newRole } : u)
      } : d)
      setToast(t.admin.role_updated)
      setTimeout(() => setToast(''), 3000)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`${t.admin.confirm_delete}\n\n${userName}`)) return
    setUpdating(userId)
    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
    } finally {
      setUpdating(null)
    }
  }

  const roleColor: Record<Role, string> = {
    admin:      'bg-brand-100 text-brand-700',
    teacher:    'bg-amber-100 text-amber-700',
    researcher: 'bg-emerald-100 text-emerald-700',
  }
  const roleLabel: Record<Role, string> = {
    admin:      t.dashboard.role_admin,
    teacher:    t.dashboard.role_teacher,
    researcher: t.dashboard.role_researcher,
  }

  if (authLoading || !user) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-outfit text-3xl font-bold text-ui-text">{t.admin.users_title}</h1>
            <p className="text-ui-muted mt-1">{t.admin.users_sub}</p>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {toast}
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
                placeholder={t.admin.search_placeholder}
                className="w-full border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-panel"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => { setRole(e.target.value as Role | ''); setPage(1) }}
              className="border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel"
            >
              <option value="">{t.admin.filter_all}</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{roleLabel[r]}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          {data && (
            <p className="text-xs text-ui-muted mb-4">{data.total} {t.admin.total}</p>
          )}

          {/* Table */}
          <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-ui-muted">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                {t.common.loading}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-20 text-ui-muted text-sm">{t.admin.no_users}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ui-border bg-ui-bg">
                    <th className="text-left text-xs font-semibold text-ui-muted uppercase tracking-wider px-6 py-3">{t.admin.col_user}</th>
                    <th className="text-left text-xs font-semibold text-ui-muted uppercase tracking-wider px-4 py-3">{t.admin.col_role}</th>
                    <th className="text-left text-xs font-semibold text-ui-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">{t.admin.col_joined}</th>
                    <th className="text-right text-xs font-semibold text-ui-muted uppercase tracking-wider px-6 py-3">{t.admin.col_actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ui-border">
                  {data?.data.map(u => (
                    <tr key={u.id} className="hover:bg-brand-50/40 transition">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-700 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                            {u.avatar
                              ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                              : u.name.charAt(0).toUpperCase()
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ui-text truncate">
                              {u.name}
                              {u.id === user?.id && (
                                <span className="ml-2 text-xs text-brand-500 font-normal">{t.admin.you}</span>
                              )}
                            </p>
                            <p className="text-xs text-ui-muted truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor[u.role]}`}>
                          {roleLabel[u.role]}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-ui-muted">
                          {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role select */}
                          {u.id !== user?.id && (
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value as Role)}
                              disabled={updating === u.id}
                              className="text-xs border border-ui-border rounded-lg px-2 py-1.5 text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-bg disabled:opacity-50"
                            >
                              {ROLES.map(r => (
                                <option key={r} value={r}>{roleLabel[r]}</option>
                              ))}
                            </select>
                          )}

                          {/* Delete */}
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDelete(u.id, u.name)}
                              disabled={updating === u.id}
                              className="p-1.5 rounded-lg text-ui-muted hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                              title={t.admin.delete_user}
                            >
                              {updating === u.id ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              onPageChange={p => setPage(p)}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
