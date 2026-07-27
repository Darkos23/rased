'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useLang } from '@/contexts/LanguageContext'

export default function ArchivesPage() {
  const { t } = useLang()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-panel pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-3">{t.static_page.archives_title}</h1>
          <p className="text-ui-muted mb-16">{t.static_page.archives_sub}</p>
          <div className="border border-dashed border-ui-border rounded-2xl py-16">
            <p className="text-ui-muted font-medium">{t.static_page.coming_soon}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
