import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${process.env.API_URL}/courses/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error()
    const course = await res.json()
    const description = course.description?.slice(0, 160) ?? ''
    return {
      title: `${course.title} — RASED`,
      description,
      openGraph: {
        title: course.title,
        description,
        ...(course.thumbnail ? { images: [{ url: course.thumbnail }] } : {}),
      },
    }
  } catch {
    return { title: 'Cours — RASED' }
  }
}

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
