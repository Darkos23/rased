import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inscription — RASED',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
