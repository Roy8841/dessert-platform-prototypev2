import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Butter&Story Prototype',
  description: 'B2C/B2B dual-path dessert platform prototype',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
