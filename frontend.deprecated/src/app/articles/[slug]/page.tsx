import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getArticleBySlug } from '@/lib/server-api'
import ArticleActions from '@/components/articles/ArticleActions'
import ArticleTranslate from '@/components/articles/ArticleTranslate'
import ArticleSidebar from '@/components/articles/ArticleSidebar'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const date = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const levelLabel: Record<string, string> = {
    fr: 'FR',
    en: 'EN',
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-bg pt-[var(--nav-height)]">
        {/* Hero banner */}
        <div className="relative bg-brand-700 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          {/* Blobs */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--brand-500) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-16 right-0 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />
          <div className="relative max-w-4xl mx-auto px-4 py-20">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-between gap-2 text-brand-200 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Link href="/" className="hover:text-white transition">Accueil</Link>
                <span>/</span>
                <Link href="/articles" className="hover:text-white transition">Publications</Link>
                <span>/</span>
                <span className="text-white/70 truncate max-w-xs">{article.title}</span>
              </div>
              <ArticleActions articleId={article.id} authorId={article.author.id} slug={slug} />
            </nav>

            {/* Category + lang badge */}
            <div className="flex items-center gap-3 mb-5">
              {article.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white uppercase tracking-wide">
                  {article.category}
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                {levelLabel[article.lang] ?? article.lang}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-3xl">
              {article.title}
            </h1>

            {/* Author + date */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {article.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{article.author.name}</p>
                <p className="text-brand-200 text-xs">{date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className={`max-w-4xl mx-auto px-4 pb-24 ${article.thumbnail ? 'pt-16' : 'pt-12'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start">

            {/* Article content */}
            <article>
              <ArticleTranslate
                originalTitle={article.title}
                originalBody={article.body}
                articleLang={article.lang}
              />
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-outfit prose-headings:text-ui-text
                  prose-p:text-ui-text prose-p:leading-relaxed
                  prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-ui-text
                  prose-blockquote:border-l-brand-500 prose-blockquote:bg-brand-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                  prose-code:bg-brand-50 prose-code:text-brand-700 prose-code:rounded prose-code:px-1
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </article>

            <ArticleSidebar
              authorName={article.author.name}
              date={date}
              category={article.category}
              lang={article.lang}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
