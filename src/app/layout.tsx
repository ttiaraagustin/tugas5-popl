import './globals.css'
import type { Metadata } from 'next'
import { Red_Rose } from 'next/font/google'

const inter = Red_Rose({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sadar Jiwa',
  description: 'Cek Kesehatan mu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
      {children}
      </body>
    </html>
  )
}
