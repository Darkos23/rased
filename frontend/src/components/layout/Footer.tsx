'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  const navLinks = [
    { href: '/articles',  label: t.nav.articles },
    { href: '/meetings',  label: t.nav.activities },
  ]

  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/rased-logo.png" alt="RASED" className="w-11 h-11 shrink-0" />
            <span className="font-outfit font-bold text-xl tracking-tight">RASED</span>
          </div>
          <p className="text-sm text-brand-200/70 leading-relaxed">
            {t.footer.faculty_desc}
          </p>
        </div>

        <div>
          <h4 className="font-outfit font-bold mb-4 text-sm text-brand-200 uppercase tracking-wide">{t.footer.navigation}</h4>
          <ul className="space-y-3 text-sm text-brand-200/70">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact">
          <h4 className="font-outfit font-bold mb-4 text-sm text-brand-200 uppercase tracking-wide">{t.footer.contact}</h4>
          <ul className="space-y-3 text-sm text-brand-200/70">
            <li>Secrétariat Permanent</li>
            <li>Institutions membres : Dakar · Rabat · Nouakchott</li>
            <li>
              <a href="mailto:contact@rased-africa.org" className="hover:text-white transition-colors">
                contact@rased-africa.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-brand-200/50 flex items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RASED — Réseau Africain des Sciences de l&apos;Éducation. {t.footer.rights}</p>
          <Link href="/login" className="text-brand-200/30 hover:text-brand-200/60 transition-colors shrink-0">
            {t.footer.login}
          </Link>
        </div>
      </div>
    </footer>
  )
}
