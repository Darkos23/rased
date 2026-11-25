'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useLang } from '@/contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLang()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg flex flex-col items-center justify-center px-4 pt-[var(--nav-height)]">
        <div className="text-center max-w-md">
          {/* Numéro 404 */}
          <p className="font-outfit text-[120px] font-extrabold text-brand-100 leading-none select-none">
            404
          </p>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto -mt-6 mb-6">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="font-outfit text-2xl font-bold text-ui-text mb-3">
            {t.common.not_found_title}
          </h1>
          <p className="text-ui-muted text-sm leading-relaxed mb-8">
            {t.common.not_found_sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition shadow-sm"
            >
              {t.common.go_home}
            </Link>
            <Link
              href="/articles"
              className="px-6 py-3 rounded-full border border-ui-border text-ui-text text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition"
            >
              {t.nav.articles}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
