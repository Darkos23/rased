'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ImageCarousel from '@/components/home/ImageCarousel'
import { useLang } from '@/contexts/LanguageContext'
import api from '@/lib/api'
import { Article, Meeting } from '@/types'

interface Stats { articles: number; meetings: number }

export default function Home() {
  const { lang, t } = useLang()

  const [articles, setArticles] = useState<Article[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [stats,    setStats]    = useState<Stats>({ articles: 0, meetings: 0 })

  const dateFmt = lang === 'fr' ? 'fr-FR' : 'en-GB'

  useEffect(() => {
    Promise.all([
      api.get('/articles?per_page=10'),
      api.get('/meetings?per_page=10'),
    ]).then(([art, mtg]) => {
      setArticles((art.data.data ?? []).slice(0, 3))
      setMeetings((mtg.data.data ?? []).slice(0, 3))
      setStats({
        articles: art.data.total ?? 0,
        meetings: mtg.data.total ?? 0,
      })
    }).catch(() => {/* silently fail – page shows empty state */})
  }, [])

  const heroArticle: Article | null = articles[0] ?? null
  const heroMeeting: Meeting | null = meetings.find(m => m.status === 'scheduled') ?? meetings[0] ?? null

  // Listes affichées dans les sections dédiées plus bas — on exclut l'item déjà mis en avant
  // dans le hero pour éviter de montrer deux fois le même article/la même réunion.
  const listArticles = heroArticle ? articles.filter(a => a.id !== heroArticle.id) : articles
  const listMeetings = heroMeeting ? meetings.filter(m => m.id !== heroMeeting.id) : meetings

  // Légendes affichées dans la card superposée au hero, synchronisées avec les photos
  // du carousel (ImageCarousel) via onIndexChange — une légende par photo, dans le même ordre.
  const heroPhotoCaptions = lang === 'fr' ? [
    {
      label: 'Signature du réseau · Nouakchott',
      title: 'Signature du RASED',
      body: 'De gauche à droite : Pr Mohamed Aly Louly, directeur de l’ENS de Nouakchott (Mauritanie) ; Pr Moustapha Sokhna, doyen de la FASTEF-UCAD (Sénégal) ; Pr Abdellatif Kidai, doyen de la Faculté des Sciences de l’Éducation de l’Université Mohammed V de Rabat (Maroc).',
    },
    {
      label: 'Secrétariat général',
      title: 'Abdallahi El Kerim',
      body: 'Secrétaire général du RASED (à gauche sur la photo).',
    },
  ] : [
    {
      label: 'Network signing · Nouakchott',
      title: 'RASED signing ceremony',
      body: 'From left to right: Pr Mohamed Aly Louly, director of the ENS of Nouakchott (Mauritania); Pr Moustapha Sokhna, dean of FASTEF-UCAD (Senegal); Pr Abdellatif Kidai, dean of the Faculty of Educational Sciences, Mohammed V University, Rabat (Morocco).',
    },
    {
      label: 'Secretariat General',
      title: 'Abdallahi El Kerim',
      body: 'Secretary General of RASED (on the left in the photo).',
    },
  ]

  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0)

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ui-panel">

        {/* ── HERO ────────────────────────────────────── */}
        <section className="relative pt-32 md:pt-36 pb-20 overflow-hidden bg-grid-pattern">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full bg-brand-100 mix-blend-multiply blur-3xl opacity-50 animate-[blob_7s_infinite]" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-accent/10 mix-blend-multiply blur-3xl opacity-40 animate-[blob_7s_2s_infinite]" />

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Texte */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-ui-border shadow-soft text-xs font-bold text-ui-muted tracking-wide mb-8">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  {t.home.badge}
                </div>

                <h1 className="font-outfit text-[clamp(2.8rem,5vw,5rem)] font-extrabold text-ui-text leading-[1.05] tracking-tight mb-6">
                  {t.home.hero1}<br />
                  <span className="relative inline-block">
                    <span className="text-brand-600">{t.home.hero2}</span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 200 5" preserveAspectRatio="none">
                      <path d="M0 2.5 Q50 0 100 2.5 Q150 5 200 2.5" stroke="var(--accent)" strokeWidth="2.5" fill="none"/>
                    </svg>
                  </span>
                </h1>

                <p className="text-lg text-ui-muted mb-8 leading-relaxed max-w-lg">
                  {t.home.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/articles" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 text-white rounded-full font-bold text-sm hover:bg-brand-700 hover:shadow-[0_8px_30px_rgba(44,106,91,0.3)] hover:-translate-y-0.5 transition-all">
                    {t.home.cta_explore}
                  </Link>
                </div>

                {stats.articles > 0 && (
                  <div className="flex flex-wrap gap-6 text-sm text-ui-muted font-medium">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent" />{`${stats.articles} ${t.home.articles_n}`}</span>
                    {stats.meetings > 0 && (
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />{`${stats.meetings} ${t.home.meetings_n}`}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Carousel de photos réelles (événements RASED) — utilisé tant qu'il n'y a pas encore d'article/réunion en base.
                  La card superposée affiche la légende de la photo actuellement visible dans le carousel. */}
              {!(heroArticle || heroMeeting) && (
                <div className="relative hidden lg:block py-6">
                  <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full bg-brand-50 blur-2xl opacity-70" />
                  </div>

                  {/* Carousel d'images — cadre en 16:9 pour matcher le ratio réel des photos (945×532),
                      donc plus de bandes blanches avec object-contain. Flotte comme les autres cards du hero. */}
                  <div className="relative z-0 w-full aspect-video animate-[float_6s_ease-in-out_infinite]">
                    <ImageCarousel index={heroPhotoIndex} onIndexChange={setHeroPhotoIndex} fit="contain" />
                  </div>

                  {/* Légende sous l'image — hauteur fixe pour ne pas faire bouger le bloc de texte
                      à gauche quand on change de photo (grid items-center sur toute la hero). */}
                  <div className="mt-5 px-1 min-h-[132px] flex gap-4">
                    <span
                      key={heroPhotoIndex}
                      className="shrink-0 font-outfit text-4xl font-extrabold text-brand-100 leading-none select-none"
                      style={{ animation: 'fadeIn 0.5s ease-out' }}
                    >
                      0{heroPhotoIndex + 1}
                    </span>
                    <div key={`text-${heroPhotoIndex}`} className="flex-1 border-l-2 border-accent/30 pl-4" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                      <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1.5">
                        {heroPhotoCaptions[heroPhotoIndex].label}
                      </p>
                      <h3 className="font-outfit font-bold text-ui-text text-lg leading-snug mb-1.5">
                        {heroPhotoCaptions[heroPhotoIndex].title}
                      </h3>
                      <p className="text-sm text-ui-muted leading-relaxed line-clamp-3">
                        {heroPhotoCaptions[heroPhotoIndex].body}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cards flottantes (article / réunion réels) */}
              {(heroArticle || heroMeeting) && (
                <div className="hidden lg:flex flex-col gap-4 py-6">

                  <div className="relative w-full aspect-[4/3]">
                    {/* Carousel d'images — pleine largeur, en arrière-plan */}
                    <div className="absolute inset-0 z-0">
                      <ImageCarousel />
                    </div>

                    {/* Card article — superposée, en avant-plan */}
                    {heroArticle && (
                      <div className="absolute z-10 -bottom-6 -right-6 w-72 bg-white rounded-2xl border border-ui-border shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-5 animate-[float_6s_ease-in-out_infinite] -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full capitalize">{heroArticle.category ?? 'Publication'}</span>
                          <span className="text-[10px] font-medium text-ui-muted">
                            {new Date(heroArticle.created_at).toLocaleDateString(dateFmt, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="font-outfit font-bold text-ui-text text-sm leading-snug mb-3 line-clamp-2">{heroArticle.title}</h3>
                        <div className="flex items-center gap-2 pt-3 border-t border-ui-border">
                          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
                            {heroArticle.author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-xs text-ui-muted font-medium">{heroArticle.author.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-start mt-16">
                    {/* Card réunion */}
                    {heroMeeting && (
                      <div className="bg-white rounded-2xl border border-ui-border shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-5 animate-[float_6s_ease-in-out_1.5s_infinite] rotate-1 hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {heroMeeting.status === 'scheduled' ? t.meetings.scheduled : t.meetings.live}
                          </span>
                          <span className="text-[10px] font-bold text-ui-muted">
                            {new Date(heroMeeting.scheduled_at).toLocaleDateString(dateFmt, { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h3 className="font-outfit font-bold text-ui-text text-sm leading-snug mb-4 line-clamp-2">{heroMeeting.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-ui-muted">{heroMeeting.host.name}</span>
                          <Link href="/meetings" className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 px-3 py-1.5 rounded-full hover:bg-brand-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            {t.home.join}
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Badge stats */}
                    {stats.articles > 0 && (
                      <div className="bg-white rounded-2xl border border-ui-border shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-6 py-5 justify-self-start">
                        <p className="font-outfit text-4xl font-extrabold text-accent leading-none">{stats.articles}</p>
                        <p className="text-xs text-ui-muted font-medium mt-1">
                          {lang === 'fr' ? 'Publications\n& ressources' : 'Publications\n& resources'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MODULES ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-5">
            <Link href="/articles" className="group bg-white border border-ui-border rounded-2xl p-8 shadow-soft hover:shadow-[0_12px_40px_rgba(31,74,65,0.08)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              </div>
              <h3 className="font-outfit text-xl font-bold text-ui-text mb-2 group-hover:text-accent transition-colors">{t.home.module_articles_title}</h3>
              <p className="text-ui-muted text-sm leading-relaxed mb-6">{t.home.module_articles_desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                {stats.articles > 0 ? `${stats.articles} ${t.home.articles_n}` : t.home.see_articles} →
              </span>
            </Link>

            <Link href="/meetings" className="group bg-white border border-ui-border rounded-2xl p-8 shadow-soft hover:shadow-[0_12px_40px_rgba(31,74,65,0.08)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="font-outfit text-xl font-bold text-ui-text mb-2 group-hover:text-emerald-600 transition-colors">{t.home.module_meetings_title}</h3>
              <p className="text-ui-muted text-sm leading-relaxed mb-6">{t.home.module_meetings_desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                {stats.meetings > 0 ? `${stats.meetings} ${t.home.meetings_n}` : t.home.see_meetings} →
              </span>
            </Link>
          </div>
        </section>

        {/* ── MISSIONS & MEMBRES ───────────────────── */}
        <section className="border-t border-ui-border bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16">

            {/* Missions */}
            <div>
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                {lang === 'fr' ? 'Le réseau' : 'The network'}
              </p>
              <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-8">
                {lang === 'fr' ? 'Nos missions' : 'Our missions'}
              </h2>
              <ul className="space-y-4">
                {(lang === 'fr' ? [
                  'Renforcer la coopération scientifique entre institutions africaines en sciences de l’éducation',
                  'Consolider la gouvernance et les orientations stratégiques du réseau',
                  'Lancer des projets de recherche collaboratifs entre institutions membres',
                  'Développer des écoles doctorales communes',
                  'Organiser une université d’été annuelle',
                  'Faciliter l’adhésion de nouvelles institutions partenaires',
                  'Rayonner comme espace africain de référence en sciences de l’éducation',
                ] : [
                  'Strengthen scientific cooperation between African institutions in educational sciences',
                  'Consolidate the network’s governance and strategic direction',
                  'Launch collaborative research projects between member institutions',
                  'Develop joint doctoral schools',
                  'Organize an annual summer university',
                  'Facilitate the admission of new partner institutions',
                  'Stand as a reference African space for educational sciences',
                ]).map((mission, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-sm text-ui-muted leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Membres */}
            <div id="membres">
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                {lang === 'fr' ? '5 catégories statutaires' : '5 statutory categories'}
              </p>
              <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-6">
                {lang === 'fr' ? 'Nos membres' : 'Our members'}
              </h2>

              <p className="text-xs font-bold text-ui-muted uppercase tracking-wide mb-3">
                {lang === 'fr' ? 'Membres fondateurs' : 'Founding members'}
              </p>
              <div className="space-y-3">
                {[
                  { name: 'FASTEF · UCAD', place: 'Dakar, Sénégal', person: 'Pr Moustapha Sokhna' },
                  { name: lang === 'fr' ? 'Faculté des Sciences de l’Éducation · Université Mohammed V' : 'Faculty of Educational Sciences · Mohammed V University', place: 'Rabat, Maroc', person: 'Pr Abdellatif Kidai' },
                  { name: lang === 'fr' ? 'École Normale Supérieure' : 'École Normale Supérieure', place: 'Nouakchott, Mauritanie', person: 'Pr Mohamed Aly Louly' },
                ].map((inst) => (
                  <div key={inst.name} className="flex items-center justify-between border border-ui-border rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ui-text">{inst.name}</p>
                      <p className="text-xs text-ui-muted">{inst.place} · {inst.person}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-ui-muted mt-6 leading-relaxed">
                {lang === 'fr'
                  ? 'Les modalités et droits propres à chaque catégorie sont définies par les Statuts du Réseau (Règlement intérieur, art. 9-14).'
                  : 'The specific terms and rights of each category are defined by the Network’s Statutes (Internal Regulations, art. 9-14).'}
              </p>

              <Link href="/membres" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 mt-5 hover:text-brand-700 transition-colors">
                {lang === 'fr' ? 'Voir tous les membres' : 'See all members'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>

          </div>
        </section>

        {/* ── GOUVERNANCE ───────────────────── */}
        <section id="gouvernance" className="border-t border-ui-border bg-ui-panel py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                {lang === 'fr' ? 'Organisation' : 'Organisation'}
              </p>
              <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-4">
                {lang === 'fr' ? 'Gouvernance' : 'Governance'}
              </h2>
              <p className="text-ui-muted text-sm leading-relaxed">
                {lang === 'fr'
                  ? 'La gouvernance du RASED s’articule autour de quatre organes statutaires (Règlement intérieur, art. 15-35).'
                  : 'RASED’s governance is structured around four statutory bodies (Internal Regulations, art. 15-35).'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-7">
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                  {lang === 'fr' ? 'Présidence' : 'Presidency'}
                </p>
                <p className="font-outfit font-bold text-ui-text text-lg mb-1">Pr Abdellatif Kidai</p>
                <p className="text-sm text-ui-muted mb-3">
                  {lang === 'fr'
                    ? 'Doyen de la Faculté des Sciences de l’Éducation, Université Mohammed V, Rabat'
                    : 'Dean of the Faculty of Educational Sciences, Mohammed V University, Rabat'}
                </p>
                <p className="text-xs text-ui-muted border-t border-ui-border pt-3">
                  {lang === 'fr'
                    ? 'Mandat de 2 ans renouvelable une fois, selon un principe de rotation entre institutions membres.'
                    : '2-year term renewable once, following a rotation principle between member institutions.'}
                </p>
              </div>

              <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-7">
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                  {lang === 'fr' ? 'Vice-présidences' : 'Vice-presidencies'}
                </p>
                <p className="font-outfit font-bold text-ui-text text-lg mb-1">
                  {lang === 'fr' ? '3 Vice-présidents' : '3 Vice-Presidents'}
                </p>
                <p className="text-sm text-ui-muted mb-3">
                  {lang === 'fr'
                    ? 'Un représentant par grande région, assistant le Président et assurant la coordination avec les institutions membres.'
                    : 'One representative per major region, assisting the President and coordinating with member institutions.'}
                </p>
              </div>

              <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-7">
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                  {lang === 'fr' ? 'Organe exécutif' : 'Executive body'}
                </p>
                <p className="font-outfit font-bold text-ui-text text-lg mb-1">
                  {lang === 'fr' ? 'Comité de coordination' : 'Coordination Committee'}
                </p>
                <p className="text-sm text-ui-muted">
                  {lang === 'fr'
                    ? 'Président, Vice-présidents, Secrétaire général, Trésorier général et Présidents des commissions permanentes. Se réunit au moins deux fois par an.'
                    : 'President, Vice-Presidents, Secretary General, Treasurer General and Chairs of the permanent commissions. Meets at least twice a year.'}
                </p>
              </div>

              <div className="bg-white border border-ui-border rounded-2xl shadow-soft p-7">
                <div className="flex items-start gap-4 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/rased-sg-portrait.jpeg" alt="Abdallahi El Kerim" className="w-12 h-12 rounded-full object-cover shrink-0 border border-ui-border" />
                  <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                      {lang === 'fr' ? 'Organe administratif' : 'Administrative body'}
                    </p>
                    <p className="font-outfit font-bold text-ui-text text-lg leading-snug">Abdallahi El Kerim</p>
                  </div>
                </div>
                <p className="text-xs text-ui-muted mb-3">{lang === 'fr' ? 'Secrétaire général' : 'Secretary General'}</p>
                <p className="text-sm text-ui-muted">
                  {lang === 'fr'
                    ? 'Gestion quotidienne du Réseau. Le Secrétaire général est nommé par l’Assemblée générale pour un mandat de 4 ans, renouvelable une fois. Directeur de la Formation et de la coopération à l’ENS de Nouakchott depuis 1988.'
                    : 'Day-to-day management of the Network. The Secretary General is appointed by the General Assembly for a 4-year term, renewable once. Director of Training and Cooperation at ENS Nouakchott since 1988.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PUBLICATIONS ──────────────────────────── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{t.home.articles_label}</p>
                <h2 className="font-outfit text-4xl font-extrabold text-ui-text">{t.home.recent_articles}</h2>
              </div>
              <Link href="/articles" className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-accent border border-accent/20 px-4 py-2 rounded-full hover:bg-accent/5 transition-all">
                {t.home.see_all} <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {listArticles.length === 0 ? (
              <div className="text-center py-16 text-ui-muted">
                <p className="font-outfit text-xl font-bold mb-2">{t.home.no_articles}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-5 gap-5">
                <Link href={`/articles/${listArticles[0].slug}`} className="md:col-span-3 group bg-white border border-ui-border rounded-2xl p-8 shadow-soft hover:shadow-[0_12px_40px_rgba(31,74,65,0.10)] hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[260px]">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">{listArticles[0].category ?? 'Publication'}</span>
                    <h3 className="font-outfit text-2xl font-extrabold text-ui-text mt-3 mb-2 leading-snug group-hover:text-accent transition-colors">{listArticles[0].title}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-ui-border mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center font-outfit font-bold text-xs text-brand-700">
                        {listArticles[0].author.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ui-text">{listArticles[0].author.name}</p>
                        <p className="text-xs text-ui-muted">{new Date(listArticles[0].created_at).toLocaleDateString(dateFmt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="md:col-span-2 flex flex-col gap-4">
                  {listArticles.slice(1).map((a: Article) => (
                    <Link key={a.id} href={`/articles/${a.slug}`} className="group flex-1 bg-white border border-ui-border rounded-2xl p-6 shadow-soft hover:shadow-[0_8px_24px_rgba(31,74,65,0.08)] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">{a.category ?? 'Publication'}</span>
                        <h4 className="font-outfit font-bold text-ui-text mt-2 text-base leading-snug group-hover:text-accent transition-colors">{a.title}</h4>
                      </div>
                      <p className="text-xs text-ui-muted mt-4 font-medium">
                        {a.author.name} · {new Date(a.created_at).toLocaleDateString(dateFmt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── RÉUNIONS ──────────────────────────────── */}
        <section className="bg-ui-bg border-t border-ui-border py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">{t.home.meetings_label}</p>
                <h2 className="font-outfit text-4xl font-extrabold text-ui-text">{t.home.agenda}</h2>
              </div>
              <Link href="/meetings" className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 transition-all">
                {t.home.see_all} <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Extrait vidéo — reportage TV du lancement du RASED à Nouakchott,
                même événement que les photos du hero. Hébergé directement (public/), pas de dépendance YouTube/Vimeo. */}
            <div className="mb-10 bg-white border border-ui-border rounded-2xl shadow-soft overflow-hidden">
              <video controls preload="metadata" className="w-full aspect-video bg-black" poster="/rased-doyen-nkc.jpeg">
                <source src="/rased-lancement-nkc.mp4" type="video/mp4" />
              </video>
              <div className="px-6 py-4">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
                  {lang === 'fr' ? 'Reportage télévisé' : 'TV coverage'}
                </p>
                <p className="text-sm text-ui-muted">
                  {lang === 'fr'
                    ? 'Extrait de la couverture télévisée de la signature du RASED à Nouakchott, en Mauritanie.'
                    : 'Excerpt from the TV coverage of the RASED signing ceremony in Nouakchott, Mauritania.'}
                </p>
              </div>
            </div>

            {listMeetings.length === 0 ? (
              <div className="text-center py-16 text-ui-muted">
                <p className="font-outfit text-xl font-bold mb-2">{t.home.no_meetings}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {listMeetings.map((m: Meeting, i: number) => (
                  <div key={i} className="group flex items-center gap-5 bg-white border border-ui-border rounded-2xl px-6 py-5 shadow-soft hover:shadow-[0_8px_30px_rgba(31,74,65,0.08)] hover:-translate-y-0.5 transition-all">
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-ui-bg border border-ui-border flex flex-col items-center justify-center">
                      <span className="font-outfit text-xl font-extrabold text-ui-text leading-none">
                        {new Date(m.scheduled_at).getDate()}
                      </span>
                      <span className="text-[10px] font-bold text-ui-muted uppercase">
                        {new Date(m.scheduled_at).toLocaleDateString(dateFmt, { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-outfit font-bold text-ui-text text-base truncate group-hover:text-brand-600 transition-colors">{m.title}</h4>
                      <p className="text-sm text-ui-muted mt-0.5">
                        {m.host.name} · {new Date(m.scheduled_at).toLocaleTimeString(dateFmt, { hour: '2-digit', minute: '2-digit' })} GMT
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <span className={`hidden md:block text-xs font-bold px-3 py-1 rounded-full ${m.status === 'scheduled' ? 'bg-emerald-50 text-emerald-700' : m.status === 'live' ? 'bg-red-50 text-red-700' : 'bg-ui-bg text-ui-muted'}`}>
                        {m.status === 'scheduled' ? t.home.scheduled : m.status === 'live' ? t.home.live : t.home.replay}
                      </span>
                      {m.status !== 'ended' && m.google_meet_url ? (
                        <a href={m.google_meet_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold px-5 py-2.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 hover:shadow-[0_4px_20px_rgba(44,106,91,0.3)] transition-all">
                          {t.home.join}
                        </a>
                      ) : m.recording_url ? (
                        <a href={m.recording_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold px-5 py-2.5 rounded-full border border-ui-border text-ui-text hover:border-brand-400 hover:text-brand-600 transition-all">
                          {t.home.see_replay}
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
          <div className="relative bg-brand-900 rounded-3xl overflow-hidden py-20 px-8 md:px-16 text-center">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/20 blur-3xl -ml-20 -mb-20" />
            <div className="relative z-10 max-w-xl mx-auto">
              <p className="text-xs font-bold text-brand-200 uppercase tracking-widest mb-4">RASED · Réseau panafricain</p>
              <h2 className="font-outfit text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {t.home.cta_title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <p className="text-brand-200/80 text-base leading-relaxed mb-8">
                {t.home.cta_sub}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/articles" className="px-8 py-4 bg-accent text-white rounded-full font-bold text-base hover:bg-accent/90 hover:-translate-y-0.5 transition-all shadow-[0_8px_30px_rgba(184,146,58,0.35)]">
                  {t.home.cta_explore}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
