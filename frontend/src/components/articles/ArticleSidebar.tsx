'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

interface Props {
  authorName: string
  date: string
  category?: string | null
  lang: string
}

export default function ArticleSidebar({ authorName, date, category, lang }: Props) {
  const { t } = useLang()

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {/* Author card */}
      <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm">
        <p className="text-xs font-semibold text-ui-muted uppercase tracking-wider mb-4">{t.article_detail.author}</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-ui-text">{authorName}</p>
            <p className="text-xs text-ui-muted">{t.article_detail.researcher}</p>
          </div>
        </div>
      </div>

      {/* Meta card */}
      <div className="bg-ui-panel rounded-2xl border border-ui-border p-6 shadow-sm space-y-4">
        <p className="text-xs font-semibold text-ui-muted uppercase tracking-wider">{t.nav.articles}</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ui-muted">{t.article_detail.published}</span>
            <span className="font-medium text-ui-text">{date}</span>
          </div>
          {category && (
            <div className="flex justify-between">
              <span className="text-ui-muted">{t.article_detail.category}</span>
              <span className="font-medium text-accent">{category}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ui-muted">{t.article_detail.language}</span>
            <span className="font-medium text-ui-text">{lang === 'fr' ? 'Français' : 'English'}</span>
          </div>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/articles"
        className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 font-medium transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t.article_detail.back}
      </Link>
    </aside>
  )
}
