import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publications — RASED',
  description: 'Articles de recherche, tribunes et actualités du réseau RASED.',
}

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
