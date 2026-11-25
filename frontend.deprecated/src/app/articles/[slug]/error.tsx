'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export default function ArticleError({ reset }: { reset: () => void }) {
  const { t } = useLang()
  return (
    <div className="min-h-screen bg-ui-bg flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-ui-text mb-1">{t.common.error_generic}</p>
        <p className="text-sm text-ui-muted">{t.article_detail.back}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="text-sm font-semibold text-brand-600 border border-brand-200 px-5 py-2 rounded-full hover:bg-brand-50 transition">
          {t.dashboard.retry}
        </button>
        <Link href="/articles" className="text-sm font-semibold text-ui-text border border-ui-border px-5 py-2 rounded-full hover:border-brand-300 transition">
          {t.article_detail.back}
        </Link>
      </div>
    </div>
  )
}
