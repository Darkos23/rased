import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon profil — RASED',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
