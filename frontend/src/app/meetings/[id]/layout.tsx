import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  try {
    const res = await fetch(`${process.env.API_URL}/meetings/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error()
    const meeting = await res.json()
    const date = new Date(meeting.scheduled_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    const description = meeting.description?.slice(0, 160) ?? date
    return {
      title: `${meeting.title} — RASED`,
      description,
      openGraph: { title: meeting.title, description },
    }
  } catch {
    return { title: 'Réunion — RASED' }
  }
}

export default function MeetingDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
