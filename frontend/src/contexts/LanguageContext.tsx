'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { fr } from '@/i18n/fr'
import { en } from '@/i18n/en'
import type { Translations } from '@/i18n/fr'

type Lang = 'fr' | 'en'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: fr,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  // Initialiser depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('fastef_lang') as Lang | null
    if (saved === 'fr' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('fastef_lang', l)
  }

  const t = lang === 'en' ? en : fr

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
