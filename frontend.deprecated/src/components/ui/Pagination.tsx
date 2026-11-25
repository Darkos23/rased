'use client'

import { useLang } from '@/contexts/LanguageContext'

interface Props {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, lastPage, onPageChange }: Props) {
  const { t } = useLang()

  if (lastPage <= 1) return null

  const pages: (number | '…')[] = []
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || Math.abs(i - currentPage) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border border-ui-border text-sm font-semibold text-ui-muted hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← {t.common.prev}
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-ui-muted text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                p === currentPage
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-ui-muted hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-4 py-2 rounded-full border border-ui-border text-sm font-semibold text-ui-muted hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t.common.next} →
      </button>
    </div>
  )
}
