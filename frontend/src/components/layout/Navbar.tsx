'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import VerificationBanner from '@/components/ui/VerificationBanner'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const aboutMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  // Whether the verification banner is showing — must mirror VerificationBanner's own condition,
  // so we know exactly when the header's real height changes.
  const bannerVisible = !!(user && !user.email_verified_at)

  // Close about menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(e.target as Node)) {
        setAboutOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    router.push('/')
  }

  // Publish the header's real rendered height (nav row + verification banner,
  // if shown) as a CSS variable, so pages can offset content correctly
  // instead of relying on a hardcoded pt-20 that breaks when the banner appears.
  // Re-measures whenever something we know changes the header's height
  // (banner appearing/disappearing, mobile menu toggling, viewport resize),
  // plus a ResizeObserver as a defensive fallback for any other case.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const setHeight = () => {
      document.documentElement.style.setProperty('--nav-height', `${el.offsetHeight}px`)
    }
    setHeight()
    const raf = requestAnimationFrame(setHeight) // catch late layout (fonts, async content)
    window.addEventListener('resize', setHeight)
    const observer = new ResizeObserver(setHeight)
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', setHeight)
      observer.disconnect()
    }
  }, [bannerVisible, mobileOpen])

  const aboutChildren = [
    { href: '/#gouvernance', label: t.nav.about_presentation },
    { href: '/commissions', label: t.nav.about_commissions },
    { href: '/archives', label: t.nav.about_archives },
  ]

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/#gouvernance', label: t.nav.about, children: aboutChildren },
    { href: '/membres', label: t.nav.members },
    { href: '/meetings', label: t.nav.activities },
    { href: '/articles', label: t.nav.works },
  ]

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-50 bg-white/95 glass-nav border-b border-ui-border shadow-soft transition-all duration-300">
      <VerificationBanner />
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/rased-logo.png" alt="RASED" className="w-11 h-11 shrink-0" />
          <div>
            <span className="font-outfit font-bold text-xl text-ui-text tracking-tight">RASED</span>
            <span className="hidden md:block text-[10px] text-ui-muted font-medium leading-none">Réseau Africain des Sciences de l&apos;Éducation</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map(({ href, label, children }, i) => (
            children ? (
              <div key={`${href}-${i}`} className="relative" ref={aboutMenuRef}>
                <button
                  onClick={() => setAboutOpen(v => !v)}
                  className="flex items-center gap-1 text-sm font-semibold text-ui-muted hover:text-brand-700 transition-colors whitespace-nowrap"
                >
                  {label}
                  <svg className={`w-3 h-3 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {aboutOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-ui-border rounded-2xl shadow-lg overflow-hidden z-50 py-1">
                    {children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setAboutOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ui-text hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={`${href}-${i}`} href={href} className="text-sm font-semibold text-ui-muted hover:text-brand-700 transition-colors whitespace-nowrap">{label}</Link>
            )
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-xs font-bold text-ui-muted border border-ui-border rounded-full px-3 py-1 hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>

          {/* User menu */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-ui-border hover:border-brand-400 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-ui-text max-w-[120px] truncate">{user.name}</span>
                <svg className={`w-3 h-3 text-ui-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-ui-border rounded-2xl shadow-lg overflow-hidden z-50 py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ui-text hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {t.nav.dashboard}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/users"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-ui-text hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      {t.nav.admin_users}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3">
          {navItems.map(({ href, label, children }, i) => (
            children ? (
              <div key={`${href}-${i}`} className="border-b border-slate-50">
                <button
                  onClick={() => setMobileAboutOpen(v => !v)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-ui-muted py-2"
                >
                  {label}
                  <svg className={`w-3.5 h-3.5 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileAboutOpen && (
                  <div className="flex flex-col gap-2 pb-2 pl-3">
                    {children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => { setMobileOpen(false); setMobileAboutOpen(false) }} className="text-sm text-ui-muted py-1">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={`${href}-${i}`} href={href} onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-ui-muted py-2 border-b border-slate-50">
                {label}
              </Link>
            )
          ))}
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-sm font-semibold text-ui-muted py-2 text-left"
          >
            {lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
          </button>
          {user && (
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 pb-2">
                <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-ui-text truncate">{user.name}</span>
              </div>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-ui-muted py-2">
                {t.nav.dashboard}
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin/users" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-ui-muted py-2">
                  {t.nav.admin_users}
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600 py-2 text-left">
                {t.nav.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
