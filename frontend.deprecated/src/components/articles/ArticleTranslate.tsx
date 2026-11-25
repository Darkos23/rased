'use client'

import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { useTranslate } from '@/hooks/useTranslate'

interface Props {
  originalTitle: string
  originalBody: string
  articleLang: 'fr' | 'en'
}

export default function ArticleTranslate({ originalTitle, originalBody, articleLang }: Props) {
  const { lang, t } = useLang()
  const { translate, loading } = useTranslate()
  const [translated, setTranslated] = useState<{ title: string; body: string } | null>(null)
  const [showing, setShowing] = useState(false)

  // On ne propose la traduction que si la langue du site est différente de la langue de l'article
  const targetLang = lang === 'fr' ? 'FR' : 'EN'
  const needsTranslation = articleLang !== lang

  if (!needsTranslation) return null

  const handleTranslate = async () => {
    if (translated) {
      setShowing(v => !v)
      return
    }
    const results = await translate([originalTitle, originalBody], targetLang)
    setTranslated({ title: results[0], body: results[1] })
    setShowing(true)
  }

  return (
    <div>
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-semibold text-brand-600 border border-brand-200 px-4 py-2 rounded-full hover:bg-brand-50 transition disabled:opacity-50 mb-6"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            {t.article_detail.translating}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {showing ? t.article_detail.translate_back : t.article_detail.translate}
          </>
        )}
      </button>

      {showing && translated && (
        <div className="mb-8 p-5 bg-brand-50 border border-brand-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-brand-600 uppercase tracking-wide">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Traduit par DeepL
          </div>
          <h2 className="font-outfit text-xl font-bold text-ui-text mb-4">{translated.title}</h2>
          <div
            className="prose prose-slate max-w-none prose-p:text-ui-text prose-headings:text-ui-text prose-a:text-brand-500 text-sm"
            dangerouslySetInnerHTML={{ __html: translated.body }}
          />
        </div>
      )}
    </div>
  )
}
