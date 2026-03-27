import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Redaktören',
  description: 'Modern klassicism for Slot 04.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
