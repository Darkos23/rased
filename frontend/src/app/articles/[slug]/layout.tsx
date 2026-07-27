import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${process.env.API_URL}/articles/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error()
    const article = await res.json()
    const description = article.body?.replace(/<[^>]+>/g, '').slice(0, 160) ?? ''
    return {
      title: `${article.title} — RASED`,
      description,
      openGraph: {
        title: article.title,
        description,
        ...(article.thumbnail ? { images: [{ url: article.thumbnail }] } : {}),
      },
    }
  } catch {
    return { title: 'Publication — RASED' }
  }
}

export default function ArticleDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
