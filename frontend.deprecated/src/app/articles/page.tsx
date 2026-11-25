'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Article, PaginatedResponse } from '@/types'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'

const CATEGORIES = ['Pédagogie', 'Didactique', 'Numérique', 'Recherche', 'Formation', 'Évaluation', 'Politique éducative', 'Autre']

export default function ArticlesPage() {
  const { user } = useAuth()
  const { lang, t } = useLang()

  const [data, setData]           = useState<PaginatedResponse<Article> | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory]   = useState('')

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchArticles = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ page: String(page) })
    if (search)   params.set('search',   search)
    if (category) params.set('category', category)
    api.get(`/articles?${params}`)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [page, search, category])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-36 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-ui-text mb-1">{t.articles.title}</h1>
            <p className="text-ui-muted">{t.articles.subtitle}</p>
          </div>
          {user && (
            <Link href="/articles/new"
              className="flex items-center gap-2 bg-brand-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-700 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t.articles.new}
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
              placeholder={t.articles.search_placeholder}
              className="w-full border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-panel"
            />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="border border-ui-border rounded-xl px-4 py-2.5 text-sm text-ui-text focus:outline-none focus:ring-2 focus:ring-brand-500 bg-ui-panel"
          >
            <option value="">{t.articles.filter_category}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
            {t.articles.loading}
          </div>
        )}

        {/* Error */}
        {error && <ErrorState onRetry={fetchArticles} />}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map(article => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group">
                <div className="bg-ui-panel border border-ui-border rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-200 transition overflow-hidden h-full flex flex-col">
                  {article.thumbnail ? (
                    <div className="overflow-hidden">
                      <img src={article.thumbnail} alt={article.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-brand-50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    {article.category && (
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">{article.category}</span>
                    )}
                    <h2 className="font-outfit text-lg font-semibold text-ui-text mb-3 line-clamp-2 group-hover:text-brand-600 transition flex-1">
                      {article.title}
                    </h2>
                    <div className="flex items-center gap-2 pt-4 border-t border-ui-border mt-auto">
                      <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {article.author.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-ui-muted truncate">
                        {article.author.name} · {new Date(article.created_at).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {data && !error && <Pagination currentPage={data.current_page} lastPage={data.last_page} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}

        {data?.data.length === 0 && !loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="font-outfit text-lg font-semibold text-ui-text">{t.articles.empty_title}</p>
            <p className="text-ui-muted text-sm mt-1">{t.articles.empty_sub}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
