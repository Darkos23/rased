'use client'

import { useState, useCallback } from 'react'
import api from '@/lib/api'

/**
 * Traduit un tableau de textes via le proxy DeepL backend.
 * Cache les résultats pour éviter les appels en double.
 */
export function useTranslate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const cache = new Map<string, string>()

  const translate = useCallback(async (texts: string[], targetLang: 'FR' | 'EN'): Promise<string[]> => {
    // Vérifier le cache
    const cacheKey = texts.join('|||') + targetLang
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!.split('|||')
    }

    setLoading(true)
    setError('')
    try {
      const res = await api.post('/translate', { text: texts, target_lang: targetLang })
      const translated: string[] = res.data.translations.map((t: { text: string }) => t.text)
      cache.set(cacheKey, translated.join('|||'))
      return translated
    } catch {
      setError('Traduction indisponible.')
      return texts // fallback : texte original
    } finally {
      setLoading(false)
    }
  }, [])

  return { translate, loading, error }
}
