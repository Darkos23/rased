import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réunions — RASED',
  description: 'Événements académiques, séminaires et réunions du réseau RASED.',
}

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
