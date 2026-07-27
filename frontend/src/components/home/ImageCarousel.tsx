'use client'

import { useEffect, useState } from 'react'

interface Slide {
  src: string
  alt: string
}

// Slides shown on the homepage hero — real photos only for now.
// Ajouter d'autres entrées ici dès que de nouvelles photos sont fournies.
const placeholderSlides: Slide[] = [
  { src: '/rased-doyen-nkc.jpeg', alt: "Signature du RASED à Nouakchott, en Mauritanie — de gauche à droite : Pr Mohamed Aly Louly, directeur de l'ENS de Nouakchott (Mauritanie) ; Pr Moustapha Sokhna, doyen de la FASTEF-UCAD (Sénégal) ; Pr Abdellatif Kidai, doyen de la Faculté des Sciences de l'Éducation de l'Université Mohammed V de Rabat (Maroc)." },
  { src: '/rased-secretaire-general.jpeg', alt: "Abdallahi El Kerim (à gauche), Secrétaire général du RASED." },
]

const gradients = [
  'linear-gradient(135deg, var(--brand-600), var(--brand-900))',
  'linear-gradient(135deg, var(--accent), var(--brand-700))',
  'linear-gradient(135deg, var(--brand-400), var(--brand-800))',
]

interface ImageCarouselProps {
  slides?: Slide[]
  className?: string
  // Prévient le parent à chaque changement de slide, pour lui permettre
  // de synchroniser un contenu externe (ex. une card de légende) sur la photo affichée.
  onIndexChange?: (index: number) => void
  // Index contrôlé depuis l'extérieur (optionnel) — permet à un parent de piloter
  // le carousel (ex. via les points de la card de légende) tout en gardant l'auto-rotation.
  index?: number
  // 'cover' (défaut) remplit le cadre quitte à rogner l'image ; 'contain' garde la photo
  // entière visible, avec des bandes vides comblées par le fond blanc du carousel.
  fit?: 'cover' | 'contain'
}

export default function ImageCarousel({ slides = placeholderSlides, className = '', onIndexChange, index: controlledIndex, fit = 'cover' }: ImageCarouselProps) {
  const isControlled = controlledIndex !== undefined
  const [internalIndex, setInternalIndex] = useState(0)
  const index = isControlled ? controlledIndex! : internalIndex

  // Applique un nouvel index : met à jour l'état interne (mode non-contrôlé)
  // ou notifie simplement le parent, qui a la main sur l'index (mode contrôlé).
  const applyIndex = (next: number) => {
    if (isControlled) {
      onIndexChange?.(next)
    } else {
      setInternalIndex(next)
    }
  }

  useEffect(() => {
    if (!isControlled) onIndexChange?.(index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => applyIndex((index + 1) % slides.length), 6000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, index, isControlled])

  const goTo = (i: number) => applyIndex(i)
  const prev = () => applyIndex((index - 1 + slides.length) % slides.length)
  const next = () => applyIndex((index + 1) % slides.length)

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl border border-ui-border shadow-[0_20px_60px_rgba(0,0,0,0.10)] bg-white ${className}`}>
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            {slide.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.src} alt={slide.alt} className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            ) : (
              <div
                className="w-full h-full flex items-end p-4"
                style={{ background: gradients[i % gradients.length] }}
              >
                <span className="text-white text-xs font-semibold drop-shadow-sm">{slide.alt}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Barre de progression façon « stories » — remplace les points génériques */}
          <div className="absolute top-3 inset-x-3 z-10 flex items-center gap-1.5 bg-black/10 backdrop-blur-sm rounded-full p-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Image ${i + 1}`}
                className="relative flex-1 h-1 rounded-full bg-white/40 overflow-hidden"
              >
                {i < index && <span className="absolute inset-0 bg-white" />}
                {i === index && (
                  <span
                    key={index}
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ animation: 'growWidth 6s linear forwards' }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-ui-text flex items-center justify-center shadow-soft transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-ui-text flex items-center justify-center shadow-soft transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
        </>
      )}
    </div>
  )
}
