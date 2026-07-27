import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cours — RASED',
  description: 'Formations académiques et scientifiques proposées par les institutions membres du RASED.',
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
