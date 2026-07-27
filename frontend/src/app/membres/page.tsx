'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useLang } from '@/contexts/LanguageContext'
import { members, type Member } from '@/data/members'

export default function MembresPage() {
  const { lang, t } = useLang()
  const [openId, setOpenId] = useState<string | null>(null)

  const sorted = [...members].sort((a, b) => a.rank - b.rank)
  const openMember = sorted.find((m) => m.id === openId) ?? null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-panel pt-32 pb-24">
        <div className="w-full px-4 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-3">{t.static_page.members_title}</h1>
            <p className="text-ui-muted">{t.static_page.members_sub}</p>
          </div>

          <p className="text-xs text-ui-muted text-center max-w-2xl mx-auto mb-16">
            {lang === 'fr'
              ? 'Cette page se complète progressivement au fil des profils transmis par les institutions membres.'
              : 'This page is filled in progressively as member institutions share their profiles.'}
          </p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {sorted.map((m) => (
              <div
                key={m.id}
                className="relative overflow-hidden rounded-2xl border border-ui-border shadow-soft hover:-translate-y-1 hover:shadow-hover transition-all duration-300 h-[380px] flex flex-col"
              >
                {/* Fond façon papier officiel — crème très légèrement teinté */}
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, var(--brand-50) 0%, transparent 55%)' }} />

                {/* Texture gravée façon papier sécurisé (guilloché), très discrète */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'repeating-linear-gradient(115deg, var(--brand-700) 0px, var(--brand-700) 1px, transparent 1px, transparent 22px)' }}
                />

                {/* Sceau du réseau en filigrane — fond blanc du logo neutralisé (multiply)
                    pour ne garder que les traits colorés, comme un tampon encré sur papier. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/rased-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.22] mix-blend-multiply pointer-events-none select-none"
                />

                <div className="relative p-7 flex flex-col flex-1 min-h-0">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-20 h-24 rounded-lg object-cover shrink-0 border-2 border-white shadow-soft"
                      />
                    ) : (
                      <div className="w-20 h-24 rounded-lg bg-brand-50 border-2 border-white shadow-soft shrink-0 flex items-center justify-center">
                        <svg className="w-9 h-9 text-brand-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                        </svg>
                      </div>
                    )}

                    <div className="relative">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] text-right leading-relaxed">
                        {lang === 'fr' ? m.category.fr : m.category.en}
                      </p>
                      {m.nationality && (
                        <span
                          className="absolute left-1/2 top-full -translate-x-1/2 text-8xl opacity-[0.15] mix-blend-multiply pointer-events-none select-none leading-none"
                          aria-hidden="true"
                        >
                          {m.nationality.flag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px w-10 bg-accent mb-3" />
                  <h3 className="font-outfit text-2xl font-extrabold text-ui-text leading-tight">{m.name}</h3>
                  <p className="text-sm text-ui-muted mt-1">{lang === 'fr' ? m.role.fr : m.role.en}</p>
                  {m.institution && (
                    <p className="text-xs text-ui-muted/70 mt-1">
                      {lang === 'fr' ? m.institution.fr : m.institution.en}{m.place ? ` · ${m.place}` : ''}
                    </p>
                  )}

                  {m.highlights && m.highlights.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setOpenId(m.id)}
                      className="mt-auto pt-5 border-t border-ui-border text-left text-xs font-bold text-accent uppercase tracking-[0.1em] hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      {lang === 'fr' ? 'Voir le profil complet →' : 'View full profile →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {openMember && (
        <MemberModal member={openMember} lang={lang} onClose={() => setOpenId(null)} />
      )}
    </>
  )
}

function MemberModal({ member, lang, onClose }: { member: Member; lang: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ui-text/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-ui-border shadow-hover p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-ui-muted hover:bg-ui-panel transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-4 mb-6 pr-10">
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="w-16 h-20 rounded-lg object-cover shrink-0 border-2 border-white shadow-soft"
            />
          ) : (
            <div className="w-16 h-20 rounded-lg bg-brand-50 border-2 border-white shadow-soft shrink-0 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
              {lang === 'fr' ? member.category.fr : member.category.en}
            </p>
            <h3 className="font-outfit text-xl font-extrabold text-ui-text leading-tight mt-1">{member.name}</h3>
            <p className="text-sm text-ui-muted mt-0.5">{lang === 'fr' ? member.role.fr : member.role.en}</p>
            {member.institution && (
              <p className="text-xs text-ui-muted/70 mt-1">
                {lang === 'fr' ? member.institution.fr : member.institution.en}{member.place ? ` · ${member.place}` : ''}
              </p>
            )}
          </div>
        </div>

        {member.highlights && member.highlights.length > 0 && (
          <ul className="space-y-3 border-t border-ui-border pt-5">
            {member.highlights.map((h, hi) => (
              <li key={hi} className="flex items-start gap-2.5 text-sm text-ui-muted leading-relaxed">
                <span className="flex-shrink-0 w-1 h-1 rounded-full bg-accent mt-2" />
                {lang === 'fr' ? h.fr : h.en}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
