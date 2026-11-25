'use client'

import { useLang } from '@/contexts/LanguageContext'

interface Props {
  onRetry?: () => void
  message?: string
}

export default function ErrorState({ onRetry, message }: Props) {
  const { t } = useLang()

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-ui-text text-sm">{message ?? t.common.error_generic}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-semibold text-brand-600 border border-brand-200 px-5 py-2 rounded-full hover:bg-brand-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.dashboard.retry}
        </button>
      )}
    </div>
  )
}
