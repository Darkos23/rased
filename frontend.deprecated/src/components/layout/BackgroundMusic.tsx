'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

// Musique d'ambiance du site — extrait (kora) fourni par le doyen, compressé pour le web.
// Les navigateurs bloquent l'autoplay avec son : on tente de démarrer la lecture dès la
// première interaction de l'utilisateur (clic, touche, tap), puis on laisse un bouton
// flottant pour couper/remettre le son à tout moment.
const AUDIO_SRC = '/rased-ambient.mp3'
const STORAGE_KEY = 'rased-music-muted'

export default function BackgroundMusic() {
  const { lang } = useLang()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Respecte un choix précédent de l'utilisateur (coupé manuellement) — lu une seule
  // fois à l'initialisation pour éviter un setState dans un effet.
  const [muted, setMuted] = useState(() => (
    typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1'
  ))
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const tryStart = () => {
      if (muted) return
      audio.play().catch(() => {
        // toujours bloqué (pas encore d'interaction) — on réessaiera au prochain geste
      })
    }

    // Tentative directe (fonctionne si l'utilisateur a déjà interagi avec le domaine)
    tryStart()

    // Démarrage garanti au premier geste utilisateur sur la page
    const onFirstInteraction = () => {
      tryStart()
    }
    window.addEventListener('pointerdown', onFirstInteraction)
    window.addEventListener('keydown', onFirstInteraction)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setMuted(true)
      window.localStorage.setItem(STORAGE_KEY, '1')
    } else {
      setMuted(false)
      window.localStorage.removeItem(STORAGE_KEY)
      audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={
          playing
            ? (lang === 'fr' ? 'Couper la musique' : 'Mute music')
            : (lang === 'fr' ? 'Activer la musique' : 'Play music')
        }
        title={
          playing
            ? (lang === 'fr' ? 'Couper la musique' : 'Mute music')
            : (lang === 'fr' ? 'Activer la musique' : 'Play music')
        }
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white border border-ui-border shadow-hover flex items-center justify-center text-ui-text hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        {playing ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5L6 9H2v6h4l5 4V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5L6 9H2v6h4l5 4V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M23 9l-6 6M17 9l6 6" />
          </svg>
        )}
      </button>
    </>
  )
}
